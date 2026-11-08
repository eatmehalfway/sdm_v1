#!/usr/bin/env bash
# Deploy this branch to Cloud Run + Cloud SQL.
# The Render service should keep tracking main. This creates a separate URL and database.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-ccq}"
SQL_INSTANCE="${SQL_INSTANCE:-ccq-pg}"
SQL_DATABASE="${SQL_DATABASE:-ccq}"
SQL_USER="${SQL_USER:-ccq_app}"
SECRET_NAME="${SECRET_NAME:-ccq-database-url}"
REPO="${REPO:-ccq}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Set PROJECT_ID or run: gcloud config set project YOUR_PROJECT" >&2
  exit 1
fi

echo "Project ${PROJECT_ID}, region ${REGION}, service ${SERVICE}"

gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --project "${PROJECT_ID}"

if ! gcloud artifacts repositories describe "${REPO}" --location "${REGION}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${REPO}" \
    --repository-format docker \
    --location "${REGION}" \
    --project "${PROJECT_ID}"
fi

if ! gcloud sql instances describe "${SQL_INSTANCE}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud sql instances create "${SQL_INSTANCE}" \
    --project "${PROJECT_ID}" \
    --database-version POSTGRES_16 \
    --tier db-f1-micro \
    --region "${REGION}" \
    --edition ENTERPRISE \
    --storage-size 10 \
    --storage-auto-increase \
    --availability-type zonal
fi

echo "Waiting for Cloud SQL instance ${SQL_INSTANCE} to become runnable. The first create takes several minutes."
for _ in $(seq 1 80); do
  SQL_STATE="$(gcloud sql instances describe "${SQL_INSTANCE}" --project "${PROJECT_ID}" --format='value(state)')"
  case "${SQL_STATE}" in
    RUNNABLE) break ;;
    FAILED|SUSPENDED)
      echo "Cloud SQL instance ${SQL_INSTANCE} is ${SQL_STATE}." >&2
      exit 1
      ;;
  esac
  sleep 15
done
if [[ "${SQL_STATE}" != "RUNNABLE" ]]; then
  echo "Timed out waiting for ${SQL_INSTANCE} (last state: ${SQL_STATE}). Run this script again; it will keep waiting." >&2
  exit 1
fi

if ! gcloud sql databases describe "${SQL_DATABASE}" --instance "${SQL_INSTANCE}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud sql databases create "${SQL_DATABASE}" \
    --instance "${SQL_INSTANCE}" \
    --project "${PROJECT_ID}"
fi

CONNECTION_NAME="$(gcloud sql instances describe "${SQL_INSTANCE}" --project "${PROJECT_ID}" --format='value(connectionName)')"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:$(git -C "${ROOT}" rev-parse --short HEAD)"

if gcloud secrets describe "${SECRET_NAME}" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  echo "Using existing secret ${SECRET_NAME}"
else
  SQL_PASSWORD="$(python3 -c 'import secrets; print(secrets.token_urlsafe(24))')"
  ENCODED_PASSWORD="$(SQL_PASSWORD="${SQL_PASSWORD}" python3 -c 'import os, urllib.parse; print(urllib.parse.quote(os.environ["SQL_PASSWORD"], safe=""))')"
  if gcloud sql users list --instance "${SQL_INSTANCE}" --project "${PROJECT_ID}" --format='value(name)' | grep -qx "${SQL_USER}"; then
    gcloud sql users set-password "${SQL_USER}" \
      --instance "${SQL_INSTANCE}" \
      --project "${PROJECT_ID}" \
      --password "${SQL_PASSWORD}"
  else
    gcloud sql users create "${SQL_USER}" \
      --instance "${SQL_INSTANCE}" \
      --project "${PROJECT_ID}" \
      --password "${SQL_PASSWORD}"
  fi
  DATABASE_URL="postgresql://${SQL_USER}:${ENCODED_PASSWORD}@/${SQL_DATABASE}?host=/cloudsql/${CONNECTION_NAME}"
  printf '%s' "${DATABASE_URL}" | gcloud secrets create "${SECRET_NAME}" \
    --project "${PROJECT_ID}" \
    --replication-policy automatic \
    --data-file - >/dev/null
  unset SQL_PASSWORD ENCODED_PASSWORD DATABASE_URL
fi

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
for role in roles/cloudsql.client roles/cloudbuild.builds.builder roles/artifactregistry.writer; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member "serviceAccount:${RUNTIME_SA}" \
    --role "${role}" \
    --condition None >/dev/null
done
if gcloud storage buckets describe "gs://${PROJECT_ID}_cloudbuild" --project "${PROJECT_ID}" >/dev/null 2>&1; then
  gcloud storage buckets add-iam-policy-binding "gs://${PROJECT_ID}_cloudbuild" \
    --member "serviceAccount:${RUNTIME_SA}" \
    --role roles/storage.objectViewer \
    >/dev/null
fi
gcloud secrets add-iam-policy-binding "${SECRET_NAME}" \
  --project "${PROJECT_ID}" \
  --member "serviceAccount:${RUNTIME_SA}" \
  --role roles/secretmanager.secretAccessor \
  --condition None >/dev/null

gcloud builds submit "${ROOT}" \
  --project "${PROJECT_ID}" \
  --config "${ROOT}/deploy/gcp/cloudbuild.yaml" \
  --substitutions "_IMAGE=${IMAGE}"

gcloud run deploy "${SERVICE}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --image "${IMAGE}" \
  --platform managed \
  --no-invoker-iam-check \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --concurrency 8 \
  --min-instances 0 \
  --max-instances 3 \
  --add-cloudsql-instances "${CONNECTION_NAME}" \
  --set-secrets "DATABASE_URL=${SECRET_NAME}:latest" \
  --service-account "${RUNTIME_SA}"

SERVICE_URL="$(gcloud run services describe "${SERVICE}" \
  --project "${PROJECT_ID}" \
  --region "${REGION}" \
  --format='value(status.url)')"
echo "Public: ${SERVICE_URL}/v2"
