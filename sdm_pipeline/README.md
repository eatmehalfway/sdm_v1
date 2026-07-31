# CCQ Clinical Conversation Analyzer

Flask app that runs a multi-encounter CCQ pipeline (decision detection, overview, communication analysis, informed-consent risk mapping) against Gemini, with results stored in PostgreSQL.

## Setup

From this directory (`sdm_v1/sdm_pipeline`):

```bash
# Create virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

## Start PostgreSQL locally

Docker Desktop must be running.

```bash
docker compose up -d postgres
```

The default development connection is:

```text
postgresql://postgres:postgres@127.0.0.1:5432/ccq
```

To use a different database, set `DATABASE_URL`:

```bash
export DATABASE_URL="postgresql://user:password@host:5432/database"
```

The application creates and upgrades its `runs` table when it starts.

## Run the application

```bash
# Make sure the venv is activated
source .venv/bin/activate

python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000).

The app opens on **Department Overview**: a collision-separated beeswarm plot of patient episodes for a single department (Spine & Orthopedics).

- **X axis:** quality of alternatives compared — *Not compared*, *Limited comparison*, *Meaningful comparison*
- **Y axis:** % of core risks discussed
- **Color:** clinician

Click any point (or table row) to open the existing CCQ episode detail view.

Demo episodes are synthetic so the aggregate view is populated without prior runs. Saved schema-v2 analyses from **Run Analysis** also appear on the plot.

## Using the UI

### Department Overview
1. Review the beeswarm plot (X = tradeoff quality, Y = % core risks, color = clinician)
2. Click a point to drill into that episode’s Decisions / Overview / Communication / Informed Consent analysis
3. Use **← Back to Department** to return

### Run Analysis
1. Enter a **Google Gemini API Key**
2. Optionally upload a **Risk-Intervention Mapping.xlsx** (otherwise the built-in procedure/risk fallback is used)
3. Select a procedure or **Auto-Detect**
4. Upload one or more encounter `.txt` transcripts
5. Click **Run CCQ Analysis**

Sample transcripts for a multi-encounter run:

- `test_fixtures/encounter_1_consult.txt`
- `test_fixtures/encounter_2_followup.txt`

## Notes

- Gemini calls run in the browser; the Flask server stores history, serves the UI, and supplies department aggregate/demo data.
- PostgreSQL is required. Local development can use the included `docker-compose.yml`; hosted environments should provide `DATABASE_URL`.
- Production can run with `gunicorn app:app`.
- Analysis is observational only — it does not conclude legal sufficiency of consent or that the patient understood.
