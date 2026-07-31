#!/usr/bin/env python3
"""Lightweight validation of CCQ v2 region shape (no API calls)."""
import json
import sys
from pathlib import Path

REQUIRED_TOP = ["decision_id", "decision_label", "status", "decision_overview", "communication_analysis"]
VALID_STATUS = {"Resolved", "Deferred", "Unresolved"}


def validate_region(r):
    errors = []
    for key in REQUIRED_TOP:
        if key not in r:
            errors.append(f"missing top-level field: {key}")
    if r.get("status") not in VALID_STATUS:
        errors.append(f"invalid status: {r.get('status')}")
    ov = r.get("decision_overview") or {}
    if "options_considered" not in ov:
        errors.append("decision_overview.options_considered missing")
    comm = r.get("communication_analysis") or {}
    if "tradeoff_comparisons" not in comm:
        errors.append("communication_analysis.tradeoff_comparisons missing")
    if "understanding_verification" not in comm:
        errors.append("communication_analysis.understanding_verification missing")
    ica = r.get("informed_consent_analysis")
    if ica:
        for intv in ica.get("interventions") or []:
            if "risk_communication_summary" not in intv:
                errors.append("intervention missing risk_communication_summary")
    return errors


def main():
    fixture = Path(__file__).parent / "mock_ccq_region.json"
    region = json.loads(fixture.read_text())
    errors = validate_region(region)
    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("OK: mock_ccq_region.json matches CCQ v2 shape expectations")
    print("Fixtures for manual multi-encounter run:")
    print(" -", Path(__file__).parent / "encounter_1_consult.txt")
    print(" -", Path(__file__).parent / "encounter_2_followup.txt")


if __name__ == "__main__":
    main()
