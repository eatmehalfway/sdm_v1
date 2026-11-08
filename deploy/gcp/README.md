# Cloud Run, beside Render

`main` keeps deploying to Render. This branch deploys the same Flask app to Cloud Run and stores runs in its own Cloud SQL database. The two sites do not share a database, so a saved analysis on one does not appear on the other.

Gemini and Jev keys stay in the browser, the same as on Render. The server only needs `DATABASE_URL`.

## What you need

- `gcloud` signed in, with a project that has billing
- Permission to create Cloud SQL, Artifact Registry, Secret Manager, and Cloud Run

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT
```

## Deploy

From the repo root, on this branch:

```bash
chmod +x deploy/gcp/deploy.sh
./deploy/gcp/deploy.sh
```

Optional overrides: `REGION` (default `us-central1`), `SERVICE` (default `ccq`), `SQL_INSTANCE` (default `ccq-pg`).

The script is safe to run again. It reuses the Cloud SQL instance and the `ccq-database-url` secret if they already exist. The first run creates a Postgres 16 instance (`db-f1-micro`), a database named `ccq`, a user, and the secret. That instance takes several minutes. The secret is the Cloud SQL socket URL:

```text
postgresql://USER:PASSWORD@/ccq?host=/cloudsql/PROJECT:REGION:INSTANCE
```

Cloud Run connects through that socket. The database password is not printed.

When the script finishes it prints the service URL. Open `/v2` on that host.

This organization blocks adding `allUsers` to IAM. The deploy turns off the Cloud Run invoker check instead, which is what makes a browser able to open the service. To do that on an existing service without a full redeploy:

```bash
gcloud run services update ccq \
  --project gcp-sdm-v1 \
  --region us-central1 \
  --no-invoker-iam-check
```

## Local check of the image

```bash
docker build -f deploy/gcp/Dockerfile -t ccq sdm_pipeline
docker run --rm -p 8080:8080 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/ccq \
  ccq
```

Postgres has to be running on the machine (`docker compose up -d postgres` from `sdm_pipeline`).

## Leave Render alone

Point the Render service at `main`. Do not point it at this branch unless you intend to rebuild that service. This branch does not add a Dockerfile at the Render service root, so an accidental deploy of this branch to Render still uses the Python build, as long as the Render root stays the repo or `sdm_pipeline`.
