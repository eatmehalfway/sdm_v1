#!/usr/bin/env python3
"""Lightweight validation of CCQ v2 region shape (no API calls)."""
import json
import copy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from department_data import metrics_from_regions

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
        intervention_names = {
            intv.get("intervention_name") for intv in ica.get("interventions") or []
        }
        selected = r.get("selected_intervention")
        if not selected:
            errors.append("consent analysis requires selected_intervention")
        elif selected not in intervention_names:
            errors.append("selected_intervention does not match consent intervention")
        if len(intervention_names) > 1:
            errors.append("consent analysis must contain only the chosen intervention")
        for intv in ica.get("interventions") or []:
            if "risk_communication_summary" not in intv:
                errors.append("intervention missing risk_communication_summary")
    elif r.get("selected_intervention"):
        errors.append("selected_intervention has no informed_consent_analysis")
    if r.get("status") != "Resolved" and r.get("selected_intervention"):
        errors.append("unresolved/deferred decision cannot select an intervention")
    return errors


def main():
    fixture = Path(__file__).parent / "mock_ccq_region.json"
    payload = json.loads(fixture.read_text())
    decisions = payload.get("decisions") or []
    errors = []
    ids = {decision.get("decision_id") for decision in decisions}
    for region in decisions:
        errors.extend(
            f"{region.get('decision_id', '?')}: {error}"
            for error in validate_region(region)
        )
        parent = region.get("parent_decision_id")
        if parent and parent not in ids:
            errors.append(
                f"{region.get('decision_id', '?')}: missing parent decision {parent}"
            )
    if not any(region.get("parent_decision_id") for region in decisions):
        errors.append("fixture must include a nested decision")
    chosen = [
        region for region in decisions if region.get("selected_intervention")
    ]
    if not chosen or len(chosen[0].get("linked_interventions") or []) < 2:
        errors.append("fixture must include multiple candidates with one chosen surgery")
    metrics = metrics_from_regions(payload)
    if metrics.get("core_risk_pct") != 100 or len(metrics.get("core_risk_items") or []) != 1:
        errors.append("metrics must include only the chosen surgery's core risks")
    waiting_payload = copy.deepcopy(payload)
    waiting_decision = waiting_payload["decisions"][1]
    waiting_decision["status"] = "Deferred"
    waiting_decision["selected_option"] = "Watchful waiting"
    waiting_decision["selected_intervention"] = None
    waiting_decision["informed_consent_analysis"] = None
    waiting_metrics = metrics_from_regions(waiting_payload)
    if waiting_metrics.get("core_risk_pct") is not None:
        errors.append("watchful waiting must produce an N/A core-risk score")
    if errors:
        print("FAIL")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("OK: nested mock_ccq_region.json matches CCQ v2 expectations")
    print("Fixtures for manual multi-encounter run:")
    print(" -", Path(__file__).parent / "encounter_1_consult.txt")
    print(" -", Path(__file__).parent / "encounter_2_followup.txt")


if __name__ == "__main__":
    main()
