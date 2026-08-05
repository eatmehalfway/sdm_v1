from flask import Flask, request, jsonify, render_template
import json
import os
import re
from collections import Counter, defaultdict
from datetime import datetime

import psycopg

from department_data import (
    CLINICIANS,
    DEPARTMENT_NAME,
    get_demo_episode_detail,
    get_demo_episodes,
    metrics_from_regions,
)

app = Flask(__name__)
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:postgres@127.0.0.1:5432/ccq",
)


def get_db():
    return psycopg.connect(DATABASE_URL)


def init_db():
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS runs (
            id BIGSERIAL PRIMARY KEY,
            filename TEXT,
            run_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            raw_text TEXT,
            turns_json TEXT,
            regions_json TEXT,
            total_encounters INTEGER
        )
    ''')
        cursor.execute("ALTER TABLE runs ADD COLUMN IF NOT EXISTS total_encounters INTEGER")


init_db()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/history', methods=['GET'])
def get_history():
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('SELECT id, filename, run_date FROM runs ORDER BY id DESC')
        rows = cursor.fetchall()
    return jsonify([
        {
            "id": row[0],
            "filename": row[1],
            "run_date": row[2].isoformat() if hasattr(row[2], "isoformat") else row[2],
        }
        for row in rows
    ])


@app.route('/api/run/<int:run_id>', methods=['GET'])
def get_run(run_id):
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('SELECT turns_json, regions_json FROM runs WHERE id = %s', (run_id,))
        row = cursor.fetchone()
    if row:
        return jsonify({
            "turns": json.loads(row[0]),
            "regions": json.loads(row[1])
        })
    return jsonify({"error": "Not found"}), 404


@app.route('/api/save', methods=['POST'])
def save_run():
    data = request.get_json(silent=True) or {}
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('''
        INSERT INTO runs (filename, run_date, raw_text, turns_json, regions_json, total_encounters)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (
        data.get('filename', 'Unknown'),
        datetime.now().astimezone(),
        data.get('raw_text', ''),
        json.dumps(data.get('turns', [])),
        json.dumps(data.get('regions', [])),
        data.get("total_encounters"),
        ))
        run_id = cursor.fetchone()[0]
    return jsonify({"status": "success", "id": run_id})


@app.route('/api/clear', methods=['POST'])
def clear_history():
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('DELETE FROM runs')
    return jsonify({"status": "cleared"})


def _db_episodes():
    """Map saved CCQ runs onto the department plot (assigned round-robin to clinicians)."""
    with get_db() as conn, conn.cursor() as cursor:
        cursor.execute('SELECT id, filename, run_date, turns_json, regions_json, total_encounters FROM runs ORDER BY id DESC')
        rows = cursor.fetchall()

    episodes = []
    for i, row in enumerate(rows):
        run_id, filename, run_date, turns_json, regions_json, total_encounters = row
        try:
            regions = json.loads(regions_json)
        except Exception:
            continue
        metrics = metrics_from_regions(regions)
        if not metrics:
            continue
        try:
            turns = json.loads(turns_json)
        except Exception:
            turns = []
        transcribed_encounters = len({
            turn.get("encounter") for turn in turns
            if isinstance(turn, dict) and turn.get("encounter")
        }) or 1
        total_encounters = max(int(total_encounters or transcribed_encounters), transcribed_encounters)
        clin = CLINICIANS[i % len(CLINICIANS)]
        episodes.append({
            "episode_id": f"run_{run_id}",
            "source": "db",
            "run_id": run_id,
            "department": DEPARTMENT_NAME,
            "clinician_id": clin["id"],
            "clinician_name": clin["name"],
            "clinician_color": clin["color"],
            "patient_label": filename or f"Run #{run_id}",
            "index_decision_id": metrics.get("index_decision_id"),
            "has_index_decision": metrics.get("has_index_decision", False),
            "procedure": metrics.get("procedure"),
            "tradeoff_level": metrics.get("tradeoff_level"),
            "decision_label": metrics.get("decision_label") or "Clinical decision",
            "status": metrics["status"],
            "ccq_score": metrics["ccq_score"],
            "decision_framing": metrics["decision_framing"],
            "tradeoff_pct": metrics["tradeoff_pct"],
            "engagement_pct": metrics["engagement_pct"],
            "core_risk_pct": metrics["core_risk_pct"],
            "teachback": metrics["teachback"],
            "core_risk_items": metrics.get("core_risk_items", []),
            "patient_questions": metrics.get("patient_questions", []),
            "recommendation_explained": metrics.get("recommendation_explained", False),
            "questions_answered_count": metrics.get("questions_answered_count", 0),
            "questions_total_count": metrics.get("questions_total_count", 0),
            "transcribed_encounters": transcribed_encounters,
            "total_encounters": total_encounters,
            "completeness_pct": round(100 * transcribed_encounters / total_encounters),
            "run_date": run_date.isoformat() if hasattr(run_date, "isoformat") else run_date,
        })
    return episodes


def _risk_frequency(episodes):
    counts = defaultdict(lambda: {"discussed": 0, "not_discussed": 0})
    for episode in episodes:
        for risk in episode.get("core_risk_items") or []:
            name = risk.get("risk_name") or "Unnamed risk"
            key = "discussed" if risk.get("detection_status") == "Discussed" else "not_discussed"
            counts[name][key] += 1
    rows = []
    for name, value in counts.items():
        total = value["discussed"] + value["not_discussed"]
        rows.append({
            "risk_name": name,
            "not_discussed_count": value["not_discussed"],
            "discussed_count": value["discussed"],
            "pct_not_discussed": round(100 * value["not_discussed"] / total) if total else 0,
        })
    return sorted(rows, key=lambda row: (-row["not_discussed_count"], row["risk_name"]))


def _question_topic(question):
    normalized = re.sub(r"[^a-z0-9 ]", "", question.casefold())
    topic_rules = [
        ("Recovery and return to activities", ("heal", "recovery", "work", "drive", "activity")),
        ("Risks of waiting", ("wait", "worse", "progress", "delay")),
        ("Pain and symptom relief", ("pain", "relief", "symptom")),
        ("Procedure risks", ("risk", "safe", "complication")),
    ]
    for label, keywords in topic_rules:
        if any(keyword in normalized for keyword in keywords):
            return label
    words = [word for word in normalized.split() if len(word) > 3]
    return " ".join(words[:5]).title() or "Other questions"


def _question_rollup(episodes):
    grouped = Counter()
    examples = {}
    for episode in episodes:
        for item in episode.get("patient_questions") or []:
            question = item.get("question") if isinstance(item, dict) else str(item)
            if not question:
                continue
            topic = _question_topic(question)
            grouped[topic] += 1
            examples.setdefault(topic, question)
    return [
        {"topic": topic, "count": count, "example": examples[topic]}
        for topic, count in grouped.most_common()
    ]


@app.route('/api/department/overview', methods=['GET'])
def department_overview():
    """Aggregate episode metrics for the department jitter plot.

    Always includes synthetic demo episodes so the view is populated.
    Saved CCQ runs (schema v2) are appended when present.
    """
    demo = get_demo_episodes()
    real = _db_episodes()
    episodes = demo + real
    return jsonify({
        "department": DEPARTMENT_NAME,
        "clinicians": CLINICIANS,
        "episodes": episodes,
        "risk_frequency": _risk_frequency(episodes),
        "question_rollup": _question_rollup(episodes),
        "demo_count": len(demo),
        "db_count": len(real),
    })


@app.route('/api/department/episode/<episode_id>', methods=['GET'])
def department_episode(episode_id):
    """Load full CCQ payload for a clicked episode (demo or DB)."""
    if episode_id.startswith("run_"):
        try:
            run_id = int(episode_id.split("_", 1)[1])
        except ValueError:
            return jsonify({"error": "Invalid run episode id"}), 400
        with get_db() as conn, conn.cursor() as cursor:
            cursor.execute('SELECT turns_json, regions_json FROM runs WHERE id = %s', (run_id,))
            row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Not found"}), 404
        return jsonify({
            "episode_id": episode_id,
            "source": "db",
            "run_id": run_id,
            "turns": json.loads(row[0]),
            "regions": json.loads(row[1]),
        })

    detail = get_demo_episode_detail(episode_id)
    if not detail:
        return jsonify({"error": "Not found"}), 404
    return jsonify(detail)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
