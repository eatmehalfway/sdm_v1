#!/usr/bin/env python3
"""Pass C failures and unknown saved runs must not count as missed core risks."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from department_data import (
    annotate_behavior_speakers,
    metrics_from_regions,
    risk_frequency_rows,
    speaker_side,
)
from procedure_analytics import risk_category_gap_stats


def region(risks, pass_c="omit"):
    decision = {
        "decision_id": "d1",
        "decision_label": "Knee replacement",
        "status": "Resolved",
        "selected_intervention": "Knee replacement",
        "decision_overview": {"options_considered": []},
        "communication_analysis": {
            "decision_framing": "Single option presented",
            "tradeoff_comparisons": [],
            "patient_engagement": {},
            "understanding_verification": "No active understanding check detected",
        },
        "informed_consent_analysis": {
            "interventions": [{
                "intervention_name": "Knee replacement",
                "core_risks": risks,
            }],
        },
    }
    if pass_c != "omit":
        decision["pipeline_status"] = {"pass_c": pass_c}
    return {"decisions": [decision]}


def frequency(metrics):
    rows = risk_frequency_rows([{"core_risk_items": metrics["core_risk_items"]}])
    return {row["risk_name"]: row["not_discussed_count"] for row in rows}


def test_failed_pass_does_not_count():
    metrics = metrics_from_regions(region([
        {"risk_name": "Infection", "detection_status": "Not assessed"},
        {"risk_name": "Nerve injury", "detection_status": "Not assessed"},
    ], pass_c="failed"))
    assert metrics["core_risk_pct"] is None
    assert metrics["core_risk_items"] == []
    assert frequency(metrics) == {}


def test_missing_status_keeps_discussed_and_drops_not_detected():
    metrics = metrics_from_regions(region([
        {"risk_name": "Infection", "detection_status": "Discussed"},
        {"risk_name": "Nerve injury", "detection_status": "Not detected"},
        {"risk_name": "Dural tear", "detection_status": "Not detected"},
    ]))
    names = [item["risk_name"] for item in metrics["core_risk_items"]]
    assert names == ["Infection"]
    assert metrics["core_risk_pct"] == 100
    assert frequency(metrics) == {"Infection": 0}


def test_ok_pass_counts_real_gaps():
    metrics = metrics_from_regions(region([
        {"risk_name": "Infection", "detection_status": "Discussed"},
        {"risk_name": "Nerve injury", "detection_status": "Not detected"},
        {"risk_name": "Dural tear", "detection_status": "Not detected"},
    ], pass_c="ok"))
    assert metrics["core_risk_pct"] == 33
    assert frequency(metrics) == {"Infection": 0, "Nerve injury": 1, "Dural tear": 1}


def test_not_assessed_leaves_gap_stats():
    stats = risk_category_gap_stats([{
        "clinician_id": "clin_chen",
        "procedure": "Knee replacement",
        "core_risk_items": [
            {"risk_name": "Infection", "risk_category": "Infection", "detection_status": "Not assessed"},
            {"risk_name": "Nerve injury", "risk_category": "Nerve", "detection_status": "Not detected"},
        ],
    }], min_clinicians=1, min_procedures=1, min_episodes_per_group=1)
    by_name = {row["risk_category"]: row for row in stats}
    assert "Infection" not in by_name
    assert by_name["Nerve"]["applicable_episodes"] == 1
    assert by_name["Nerve"]["gap_rate"] == 100.0


def test_patient_mention_stays_not_discussed():
    metrics = metrics_from_regions(region([
        {
            "risk_name": "Infection",
            "detection_status": "Not detected",
            "patient_turn_indices": [4],
        },
    ], pass_c="ok"))
    assert metrics["core_risk_pct"] == 0
    assert metrics["core_risk_items"][0]["detection_status"] == "Not detected"
    assert frequency(metrics) == {"Infection": 1}


def test_speaker_sides_split_patient_and_clinician():
    payload = region([
        {
            "risk_name": "Infection",
            "detection_status": "Discussed",
            "turn_indices": [2],
            "patient_turn_indices": [4],
        },
    ], pass_c="ok")
    decision = payload["decisions"][0]
    decision["decision_overview"]["options_considered"] = [{
        "option_name": "Surgery",
        "benefits": {"text": "relief", "quote": "relief", "turn_indices": [2, 4]},
    }]
    decision["decision_overview"]["patient_considerations"] = {
        "questions": [{
            "question": "What about infection?",
            "turn_indices": [4],
            "response_turn_indices": [5],
        }],
    }
    turns = [
        {"index": 2, "speaker_line": "SURGEON"},
        {"index": 4, "speaker_line": "PATIENT"},
        {"index": 5, "speaker_line": "FAMILY"},
    ]
    annotate_behavior_speakers(payload, turns)
    risk = decision["informed_consent_analysis"]["interventions"][0]["core_risks"][0]
    assert risk["speaker_sides"] == {"2": "clinician", "4": "patient"}
    benefit = decision["decision_overview"]["options_considered"][0]["benefits"]
    assert benefit["speaker_sides"] == {"2": "clinician", "4": "patient"}
    question = decision["decision_overview"]["patient_considerations"]["questions"][0]
    assert question["speaker_sides"] == {"4": "patient", "5": "patient"}
    assert speaker_side("CAREGIVER") == "patient"
    assert speaker_side("SURGEON") == "clinician"
    metrics = metrics_from_regions(payload)
    assert metrics["core_risk_pct"] == 100
    assert metrics["core_risk_items"][0]["clinician_turns"] == 1
    assert metrics["core_risk_items"][0]["patient_turns"] == 1
    assert metrics["behavior_counts"]["benefit"] == {"clinician": 1, "patient": 1}
    assert metrics["behavior_counts"]["risk"] == {"clinician": 1, "patient": 1}
    assert metrics["behavior_counts"]["question"] == {"clinician": 0, "patient": 2}


def test_named_conservative_option_picks_up_the_clinician_mention():
    payload = region([], pass_c="ok")
    decision = payload["decisions"][0]
    decision["decision_overview"]["options_considered"] = [
        {"option_name": "Hip replacement", "what_it_involves": {"quote": "The ball and the socket both get replaced.", "turn_indices": [43]}},
        {"option_name": "Conservative care", "named_only": True},
    ]
    turns = [
        {"index": 35, "speaker_line": "SURGEON", "text_lines": [
            "I'd recommend a hip replacement rather than continuing with conservative care.",
        ]},
        {"index": 40, "speaker_line": "PATIENT", "text_lines": ["So I can still choose not to have surgery?"]},
    ]
    annotate_behavior_speakers(payload, turns)
    conservative = decision["decision_overview"]["options_considered"][1]
    assert conservative["named_only"] is False
    assert conservative["what_it_involves"]["turn_indices"] == [35]
    assert "conservative care" in conservative["what_it_involves"]["quote"]
    assert conservative["what_it_involves"]["speaker_sides"] == {"35": "clinician"}
    surgery = decision["decision_overview"]["options_considered"][0]
    assert surgery["what_it_involves"]["turn_indices"] == [43]


def main():
    test_failed_pass_does_not_count()
    test_missing_status_keeps_discussed_and_drops_not_detected()
    test_ok_pass_counts_real_gaps()
    test_not_assessed_leaves_gap_stats()
    test_patient_mention_stays_not_discussed()
    test_speaker_sides_split_patient_and_clinician()
    test_named_conservative_option_picks_up_the_clinician_mention()
    print("OK: pass status stays out of the not-discussed counts")


if __name__ == "__main__":
    main()
