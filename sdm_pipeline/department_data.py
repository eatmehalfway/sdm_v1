"""Synthetic department-level CCQ episode data for aggregate jitter-plot demos."""
from __future__ import annotations

import copy
import hashlib
import random
import re
from typing import Any

DEPARTMENT_NAME = "Spine & Orthopedics"

CLINICIANS = [
    {"id": "clin_chen", "name": "Dr. Chen", "color": "#1769e0"},
    {"id": "clin_patel", "name": "Dr. Patel", "color": "#08a3b7"},
    {"id": "clin_okonkwo", "name": "Dr. Okonkwo", "color": "#5968cf"},
    {"id": "clin_rivera", "name": "Dr. Rivera", "color": "#338bc4"},
    {"id": "clin_kim", "name": "Dr. Kim", "color": "#1451a4"},
]

FRAMING_LEVELS = [
    "Alternatives explicitly presented",
    "Multiple options mentioned, but choice framing unclear",
    "Single option presented",
]

STATUSES = ["Resolved", "Deferred", "Unresolved"]

PROCEDURES = [
    "Lumbar decompression with possible fusion",
    "Lumbar laminectomy",
    "Posterior lumbar fusion",
]

_COLOR_THEMES = [
    {"bg": "#e6f2ff", "border": "#2e7de1", "tag": "#1769e0"},
    {"bg": "#e7f8fb", "border": "#23a7bf", "tag": "#137f9a"},
    {"bg": "#eef0ff", "border": "#6578d8", "tag": "#4459bd"},
]


def _rng(seed: str) -> random.Random:
    digest = hashlib.md5(seed.encode()).hexdigest()
    return random.Random(int(digest[:8], 16))


TRADEOFF_LEVELS = [
    "Not compared",
    "Limited comparison",
    "Meaningful comparison",
]


def _episode_score(rng: random.Random, clinician_bias: float) -> dict[str, Any]:
    """Build plausible plot metrics: tradeoff quality + % core risks discussed."""
    base = max(18.0, min(92.0, rng.gauss(58 + clinician_bias, 14)))
    framing_idx = 0 if base > 70 else (1 if base > 45 else 2)
    # Tradeoff quality biased by clinician, but sampled categorically for the X axis
    tradeoff_roll = rng.gauss(0.55 + clinician_bias / 40.0, 0.28)
    if tradeoff_roll >= 0.62:
        tradeoff_level = "Meaningful comparison"
        tradeoff_pct = max(65, min(100, int(70 + rng.uniform(0, 30))))
    elif tradeoff_roll >= 0.28:
        tradeoff_level = "Limited comparison"
        tradeoff_pct = max(35, min(64, int(40 + rng.uniform(0, 24))))
    else:
        tradeoff_level = "Not compared"
        tradeoff_pct = max(0, min(34, int(rng.uniform(0, 34))))
    # Core-risk % is related but intentionally noisy so the scatter isn't a straight line
    core_risk_pct = max(0, min(100, int(base + rng.uniform(-30, 18) + (tradeoff_pct - 50) * 0.15)))
    engagement = max(0, min(100, int(base + rng.uniform(-22, 15))))
    teachback = base > 62 and rng.random() > 0.45
    composite = round(
        0.25 * (100 - framing_idx * 28)
        + 0.25 * tradeoff_pct
        + 0.25 * engagement
        + 0.25 * core_risk_pct,
        1,
    )
    return {
        "ccq_score": composite,
        "decision_framing": FRAMING_LEVELS[framing_idx],
        "tradeoff_level": tradeoff_level,
        "tradeoff_pct": tradeoff_pct,
        "engagement_pct": engagement,
        "core_risk_pct": core_risk_pct,
        "teachback": teachback,
        "status": STATUSES[0 if composite > 55 else (1 if rng.random() > 0.4 else 2)],
    }


def _mock_turns(episode_id: str, clinician_name: str) -> list[dict]:
    return [
        {
            "index": 0,
            "encounter": f"{episode_id}_consult.txt",
            "speaker_line": "DOCTOR",
            "text_lines": [
                f"({clinician_name}) We can continue therapy, try an injection, or consider surgery for your stenosis."
            ],
        },
        {
            "index": 1,
            "encounter": f"{episode_id}_consult.txt",
            "speaker_line": "PATIENT",
            "text_lines": ["I'd rather try the injection before surgery if that's reasonable."],
        },
        {
            "index": 2,
            "encounter": f"{episode_id}_consult.txt",
            "speaker_line": "DOCTOR",
            "text_lines": [
                "Surgery may provide more durable relief, but recovery is usually longer than an injection."
            ],
        },
        {
            "index": 3,
            "encounter": f"{episode_id}_consult.txt",
            "speaker_line": "PATIENT",
            "text_lines": ["What questions should I be asking?"],
        },
        {
            "index": 4,
            "encounter": f"{episode_id}_consult.txt",
            "speaker_line": "DOCTOR",
            "text_lines": ["What questions do you have about these options?"],
        },
    ]


def _grounded_text(text: str, qualifiers: list[str] | None = None, turn: int | None = 2) -> dict[str, Any]:
    return {
        "text": text,
        "qualifying_language": qualifiers or [],
        "quote": text if text else "",
        "turn_indices": [turn] if text and turn is not None else [],
    }


def _mock_region(metrics: dict[str, Any], episode_id: str, procedure: str | None = None) -> dict[str, Any]:
    framing = metrics["decision_framing"]
    status = metrics["status"]
    procedure = procedure or PROCEDURES[0]
    selected = "Proceed with surgery" if status == "Resolved" else ("Watchful waiting" if status == "Deferred" else None)
    selected_intervention = procedure if status == "Resolved" else None
    tradeoff_level = metrics.get("tradeoff_level") or (
        "Meaningful comparison"
        if metrics["tradeoff_pct"] >= 65
        else ("Limited comparison" if metrics["tradeoff_pct"] >= 35 else "Not compared")
    )
    understanding = (
        "Active understanding check detected"
        if metrics["teachback"]
        else "No active understanding check detected"
    )
    core_discussed = metrics["core_risk_pct"] >= 50
    return {
        "decision_id": f"{episode_id}_d1",
        "decision_label": "Timing of surgical management",
        "parent_decision_id": f"{episode_id}_treatment",
        "status": status,
        "selected_option": selected,
        "selected_intervention": selected_intervention,
        "option_names": ["Proceed with surgery", "Watchful waiting"],
        "encounter_ids": [f"{episode_id}_consult.txt"],
        "relevant_turn_indices": [0, 1, 2, 3, 4],
        "colorTheme": _COLOR_THEMES[0],
        "linked_interventions": [procedure],
        "decision_overview": {
            "options_considered": [
                {
                    "option_name": "Surgery",
                    "named_only": False,
                    "what_it_involves": _grounded_text("Decompression of the affected nerve roots"),
                    "benefits": _grounded_text("May provide more durable leg pain relief", ["May"]),
                    "risks": _grounded_text("Infection and nerve injury discussed" if core_discussed else "", ["Rare", "Small risk"] if core_discussed else []),
                    "burdens": _grounded_text("Recovery usually four to six weeks", ["Usually 4–6 weeks"]),
                },
                {
                    "option_name": "Epidural injection",
                    "named_only": False,
                    "what_it_involves": _grounded_text("Image-guided steroid injection", turn=0),
                    "benefits": _grounded_text("Less invasive; relief may be temporary", ["May be temporary"], 2),
                    "risks": _grounded_text("Named only in brief", turn=0),
                    "burdens": _grounded_text("Outpatient procedure", turn=0),
                },
                {
                    "option_name": "Physical therapy",
                    "named_only": framing != "Alternatives explicitly presented",
                    "what_it_involves": _grounded_text("", turn=None),
                    "benefits": _grounded_text("", turn=None),
                    "risks": _grounded_text("", turn=None),
                    "burdens": _grounded_text("", turn=None),
                },
            ],
            "clinician_recommendation": {
                "recommended_option": "Surgery" if metrics["ccq_score"] > 50 else "Injection",
                "rationale": "Based on symptom severity and imaging",
                "qualification": "Either approach would be reasonable",
                "quote": "Surgery may provide more durable relief",
                "turn_indices": [2],
            },
            "patient_considerations": {
                "goals_priorities": [{"text": "Return to work as soon as possible", "quote": "I'd like to get back to work", "turn_indices": [1]}],
                "preferences": [{"text": "Prefer injection before surgery", "quote": "I'd rather try the injection before surgery", "turn_indices": [1]}],
                "questions": [
                    {
                        "question": "If I wait, could things get worse?",
                        "response": "Progressive weakness would push us toward surgery sooner.",
                        "response_status": "Answered",
                        "turn_indices": [3],
                    }
                ],
            },
        },
        "communication_analysis": {
            "decision_framing": framing,
            "tradeoff_comparisons": [
                {
                    "option_a": "Surgery",
                    "option_b": "Injection",
                    "level": tradeoff_level,
                    "evidence_quote": "Surgery may provide more durable relief, but recovery is usually longer than an injection.",
                    "turn_indices": [2],
                },
                {
                    "option_a": "Surgery",
                    "option_b": "Physical therapy",
                    "level": "Limited comparison" if metrics["tradeoff_pct"] > 40 else "Not compared",
                    "evidence_quote": "Therapy was mentioned as a prior/ongoing path.",
                    "turn_indices": [0],
                },
            ],
            "patient_engagement": {
                "goals_priorities_elicited": metrics["engagement_pct"] > 40,
                "goals_priorities_evidence": "Patient stated need to return to work",
                "preferences_elicited": metrics["engagement_pct"] > 50,
                "preferences_elicited_evidence": "Patient preferred injection first",
                "questions_invited": metrics["engagement_pct"] > 55,
                "questions_invited_evidence": "What questions do you have about these options?",
            },
            "clinician_response": {
                "questions_answered_count": 1,
                "questions_total_count": 1,
                "recommendation_explained": "Explained" if metrics["ccq_score"] > 45 else "Not explained",
            },
            "understanding_verification": understanding,
        },
        "informed_consent_analysis": {
            "interventions": [
                {
                    "intervention_name": procedure,
                    "core_risks": [
                        {
                            "risk_name": "Dural tear / CSF leak",
                            "detection_status": "Discussed" if core_discussed else "Not detected",
                            "details_communicated": {
                                "likelihood": "Small risk" if core_discussed else "",
                                "impact": "May prolong recovery" if core_discussed else "",
                                "patient_specific_relevance": "",
                                "management_or_response": "",
                            },
                            "quote": "Dural tear can happen" if core_discussed else "",
                            "turn_indices": [2] if core_discussed else [],
                        },
                        {
                            "risk_name": "Infection",
                            "detection_status": "Discussed" if metrics["core_risk_pct"] > 60 else "Not detected",
                            "details_communicated": {
                                "likelihood": "Uncommon",
                                "impact": "",
                                "patient_specific_relevance": "",
                                "management_or_response": "",
                            },
                            "quote": "Infection is uncommon" if metrics["core_risk_pct"] > 60 else "",
                            "turn_indices": [2] if metrics["core_risk_pct"] > 60 else [],
                        },
                        {
                            "risk_name": "Nerve injury",
                            "detection_status": "Discussed" if metrics["core_risk_pct"] > 70 else "Not detected",
                            "details_communicated": {
                                "likelihood": "Rare",
                                "impact": "Can be serious",
                                "patient_specific_relevance": "",
                                "management_or_response": "",
                            },
                            "quote": "Nerve injury is rare but can be serious" if metrics["core_risk_pct"] > 70 else "",
                            "turn_indices": [2] if metrics["core_risk_pct"] > 70 else [],
                        },
                    ],
                    "relevant_risks": [],
                    "context_dependent_risks": [],
                    "risk_communication_summary": {
                        "core_discussed": (
                            ["Dural tear / CSF leak"] if core_discussed else []
                        ),
                        "core_not_detected": (
                            [] if core_discussed else ["Dural tear / CSF leak"]
                        ),
                        "relevant_discussed": [],
                        "relevant_not_detected": [],
                        "context_dependent_warrant_review": [],
                    },
                }
            ]
        },
    }


# Per-clinician score bias so the plot shows visible between-clinician differences
_CLINICIAN_BIAS = {
    "clin_chen": 12,
    "clin_patel": 4,
    "clin_okonkwo": -2,
    "clin_rivera": -8,
    "clin_kim": 8,
}


def build_demo_episodes(n_per_clinician: int = 10) -> list[dict[str, Any]]:
    episodes = []
    episode_num = 1
    for clin in CLINICIANS:
        bias = _CLINICIAN_BIAS.get(clin["id"], 0)
        for i in range(n_per_clinician):
            episode_id = f"demo_{clin['id']}_{i + 1:02d}"
            rng = _rng(episode_id)
            metrics = _episode_score(rng, bias)
            # Guarantee every clinician contributes examples to the full category
            # range so empty lanes do not obscure the intended comparison model.
            if i == 0:
                metrics.update({
                    "status": "Resolved",
                    "decision_framing": "Single option presented",
                    "tradeoff_level": "Not compared",
                    "tradeoff_pct": 0,
                })
            elif i == 1:
                metrics.update({
                    "status": "Resolved",
                    "decision_framing": "Alternatives explicitly presented",
                    "tradeoff_level": "Not compared",
                    "tradeoff_pct": 20,
                })
            has_index_decision = i != n_per_clinician - 1 and metrics["status"] == "Resolved"
            procedure = rng.choice(PROCEDURES)
            transcribed_encounters = 1 + int(rng.random() > 0.82)
            total_encounters = transcribed_encounters + int(rng.random() > 0.72)
            patient_label = f"Patient {1000 + episode_num}"
            episodes.append(
                {
                    "episode_id": episode_id,
                    "source": "demo",
                    "run_id": None,
                    "department": DEPARTMENT_NAME,
                    "clinician_id": clin["id"],
                    "clinician_name": clin["name"],
                    "clinician_color": clin["color"],
                    "patient_label": patient_label,
                    "decision_label": "Timing of surgical management" if has_index_decision else "No chosen surgery",
                    "index_decision_id": f"{episode_id}_d1" if has_index_decision else None,
                    "has_index_decision": has_index_decision,
                    "procedure": procedure if has_index_decision else None,
                    "status": metrics["status"],
                    "ccq_score": metrics["ccq_score"],
                    "decision_framing": metrics["decision_framing"] if has_index_decision else None,
                    "tradeoff_level": metrics["tradeoff_level"] if has_index_decision else None,
                    "tradeoff_pct": metrics["tradeoff_pct"],
                    "engagement_pct": metrics["engagement_pct"],
                    "core_risk_pct": metrics["core_risk_pct"] if has_index_decision else None,
                    "teachback": metrics["teachback"],
                    "transcribed_encounters": transcribed_encounters,
                    "total_encounters": total_encounters,
                    "completeness_pct": round(100 * transcribed_encounters / total_encounters),
                    "core_risk_items": (
                        [
                            {"risk_name": "Dural tear / CSF leak", "detection_status": "Discussed" if metrics["core_risk_pct"] >= 50 else "Not detected"},
                            {"risk_name": "Infection", "detection_status": "Discussed" if metrics["core_risk_pct"] > 60 else "Not detected"},
                            {"risk_name": "Nerve injury", "detection_status": "Discussed" if metrics["core_risk_pct"] > 70 else "Not detected"},
                        ] if has_index_decision else []
                    ),
                    "patient_questions": (
                        [{"question": "If I wait, could things get worse?", "response_status": "Answered"}]
                        if has_index_decision else []
                    ),
                    "recommendation_explained": has_index_decision and metrics["ccq_score"] > 45,
                    "questions_answered_count": 1 if has_index_decision else 0,
                    "questions_total_count": 1 if has_index_decision else 0,
                    "run_date": f"2026-0{(i % 6) + 1}-{10 + (i % 18):02d}",
                }
            )
            episode_num += 1
    return episodes


_EPISODE_CACHE: dict[str, dict[str, Any]] | None = None
_DETAIL_CACHE: dict[str, dict[str, Any]] = {}


def get_demo_episodes() -> list[dict[str, Any]]:
    global _EPISODE_CACHE
    if _EPISODE_CACHE is None:
        eps = build_demo_episodes(30)
        _EPISODE_CACHE = {e["episode_id"]: e for e in eps}
    return list(_EPISODE_CACHE.values())


def get_demo_episode_detail(episode_id: str) -> dict[str, Any] | None:
    episodes = get_demo_episodes()
    meta = next((e for e in episodes if e["episode_id"] == episode_id), None)
    if not meta:
        return None
    if episode_id in _DETAIL_CACHE:
        return _DETAIL_CACHE[episode_id]

    metrics = {
        "ccq_score": meta["ccq_score"] or 50,
        "decision_framing": meta["decision_framing"] or "Single option presented",
        "tradeoff_level": meta.get("tradeoff_level") or "Not compared",
        "tradeoff_pct": meta["tradeoff_pct"] or 0,
        "engagement_pct": meta["engagement_pct"] or 0,
        "core_risk_pct": meta["core_risk_pct"] or 0,
        "teachback": meta["teachback"],
        "status": meta["status"],
    }
    procedure = meta.get("procedure")
    region = _mock_region(metrics, episode_id, procedure=procedure)
    treatment_parent = copy.deepcopy(region)
    treatment_parent["decision_id"] = f"{episode_id}_treatment"
    treatment_parent["parent_decision_id"] = None
    treatment_parent["decision_label"] = "Management of lumbar stenosis"
    treatment_parent["status"] = "Resolved" if meta.get("has_index_decision") else meta["status"]
    treatment_parent["selected_option"] = "Surgical management" if meta.get("has_index_decision") else "Nonsurgical management"
    treatment_parent["selected_intervention"] = None
    treatment_parent["option_names"] = ["Nonsurgical management", "Surgical management"]
    treatment_parent["linked_interventions"] = []
    treatment_parent["informed_consent_analysis"] = None
    if not meta.get("has_index_decision"):
        region["decision_label"] = meta["decision_label"]
        region["selected_intervention"] = None
        region["linked_interventions"] = []
        region["informed_consent_analysis"] = None
    decisions = [treatment_parent, region]
    # Exercise the multiple-qualifying-decision tie-break in demo data.
    if episode_id.endswith("_09") and region.get("informed_consent_analysis"):
        secondary = copy.deepcopy(region)
        secondary["decision_id"] = f"{episode_id}_d2"
        secondary["decision_label"] = "Choice of anesthesia"
        secondary["parent_decision_id"] = region["decision_id"]
        secondary["selected_option"] = "Regional anesthesia"
        secondary["selected_intervention"] = "Regional anesthesia"
        secondary["linked_interventions"] = ["Regional anesthesia"]
        secondary["informed_consent_analysis"]["interventions"][0]["intervention_name"] = "Regional anesthesia"
        decisions.append(secondary)
    turns = _mock_turns(episode_id, meta["clinician_name"])
    detail = {
        "episode": copy.deepcopy(meta),
        "turns": turns,
        "regions": {
            "schema_version": 2,
            "default_procedure": procedure or PROCEDURES[0],
            "decisions": decisions,
        },
        "schema_version": 2,
    }
    _DETAIL_CACHE[episode_id] = detail
    return detail


def _core_risk_count(decision: dict[str, Any]) -> int:
    return sum(
        len(intervention.get("core_risks") or [])
        for intervention in _chosen_interventions(decision)
    )


def _selected_intervention_name(decision: dict[str, Any]) -> str | None:
    """Return the chosen surgery, with a narrow fallback for pre-field v2 runs."""
    if decision.get("status") != "Resolved":
        return None
    selected = decision.get("selected_intervention")
    if selected:
        return str(selected)
    interventions = (decision.get("informed_consent_analysis") or {}).get("interventions") or []
    selected_option = str(decision.get("selected_option") or "").casefold()
    for intervention in interventions:
        name = str(intervention.get("intervention_name") or "")
        if name and (name.casefold() in selected_option or selected_option in name.casefold()):
            return name
    if (
        len(interventions) == 1
        and len(decision.get("linked_interventions") or []) == 1
        and re.search(
            r"surg|decompress|fusion|arthro|replacement|repair|procedure",
            selected_option,
        )
        and not re.search(
            r"watch|wait|defer|non.?surg|conservative|therapy|injection",
            selected_option,
        )
    ):
        return str(interventions[0].get("intervention_name") or "") or None
    return None


def _chosen_interventions(decision: dict[str, Any]) -> list[dict[str, Any]]:
    selected = _selected_intervention_name(decision)
    if not selected:
        return []
    return [
        intervention
        for intervention in (decision.get("informed_consent_analysis") or {}).get("interventions") or []
        if str(intervention.get("intervention_name") or "").casefold() == selected.casefold()
    ]


def select_index_decision(
    decisions: list[dict[str, Any]], default_procedure: str | None = None
) -> dict[str, Any] | None:
    """Select the consent-relevant decision used by every department-level view."""
    qualifying = [
        decision
        for decision in decisions
        if _selected_intervention_name(decision)
        and _chosen_interventions(decision)
    ]
    if not qualifying:
        return None
    if len(qualifying) == 1:
        return qualifying[0]
    matching = [
        decision
        for decision in qualifying
        if default_procedure
        and any(
            str(intervention.get("intervention_name") or "").casefold()
            == default_procedure.casefold()
            for intervention in _chosen_interventions(decision)
        )
    ]
    return max(matching or qualifying, key=_core_risk_count)


def metrics_from_regions(regions_payload: Any) -> dict[str, Any]:
    """Derive department metrics from one consent-relevant index decision."""
    if isinstance(regions_payload, dict) and "decisions" in regions_payload:
        decisions = regions_payload.get("decisions") or []
    elif isinstance(regions_payload, list):
        decisions = regions_payload
    else:
        decisions = []

    # Skip legacy AHRQ-only payloads
    ccq_decisions = [
        d for d in decisions
        if isinstance(d, dict) and d.get("decision_overview") and not d.get("ahrq_consent_checklist")
    ]
    if not ccq_decisions:
        return {}

    default_procedure = regions_payload.get("default_procedure") if isinstance(regions_payload, dict) else None
    decision = select_index_decision(ccq_decisions, default_procedure)
    if not decision:
        return {
            "has_index_decision": False,
            "index_decision_id": None,
            "decision_label": "No consent-relevant decision",
            "status": ccq_decisions[0].get("status") or "Unresolved",
            "procedure": None,
            "ccq_score": None,
            "decision_framing": None,
            "tradeoff_level": None,
            "tradeoff_pct": None,
            "engagement_pct": None,
            "core_risk_pct": None,
            "teachback": False,
            "core_risk_items": [],
            "patient_questions": [],
            "recommendation_explained": False,
            "questions_answered_count": 0,
            "questions_total_count": 0,
        }

    framing_scores = {
        "Alternatives explicitly presented": 100,
        "Multiple options mentioned, but choice framing unclear": 55,
        "Single option presented": 25,
    }
    comm = decision.get("communication_analysis") or {}
    framing_label = comm.get("decision_framing")
    framing_pct = framing_scores.get(framing_label, 40)
    tradeoff_scores = []
    tradeoff_level_rank = {"Not compared": 0, "Limited comparison": 1, "Meaningful comparison": 2}
    best_tradeoff_level = "Not compared"
    engagement_scores = []
    core_discussed = 0
    core_total = 0
    teachback = False
    comps = comm.get("tradeoff_comparisons") or []
    level_map = {"Meaningful comparison": 100, "Limited comparison": 50, "Not compared": 0}
    if comps:
        tradeoff_scores.append(sum(level_map.get(c.get("level"), 0) for c in comps) / len(comps))
        best_tradeoff_level = max(
            (c.get("level") or "Not compared" for c in comps),
            key=lambda level: tradeoff_level_rank.get(level, 0),
        )
    pe = comm.get("patient_engagement") or {}
    flags = [pe.get("goals_priorities_elicited"), pe.get("preferences_elicited"), pe.get("questions_invited")]
    engagement_scores.append(100 * sum(1 for flag in flags if flag) / 3)
    teachback = comm.get("understanding_verification") == "Active understanding check detected"
    core_risk_items = []
    for intervention in _chosen_interventions(decision):
        for risk in intervention.get("core_risks") or []:
            core_risk_items.append({
                "risk_name": risk.get("risk_name") or "Unnamed risk",
                "detection_status": risk.get("detection_status") or "Not detected",
            })
            core_total += 1
            if risk.get("detection_status") == "Discussed":
                core_discussed += 1

    tradeoff_pct = sum(tradeoff_scores) / len(tradeoff_scores) if tradeoff_scores else 30
    engagement_pct = sum(engagement_scores) / len(engagement_scores) if engagement_scores else 30
    core_risk_pct = (100 * core_discussed / core_total) if core_total else None
    composite = round(0.25 * framing_pct + 0.25 * tradeoff_pct + 0.25 * engagement_pct + 0.25 * (core_risk_pct or 0), 1)

    clinician_response = comm.get("clinician_response") or {}
    questions = (
        (decision.get("decision_overview") or {})
        .get("patient_considerations", {})
        .get("questions", [])
    )

    return {
        "has_index_decision": True,
        "index_decision_id": decision.get("decision_id"),
        "procedure": _selected_intervention_name(decision),
        "ccq_score": composite,
        "decision_framing": framing_label,
        "tradeoff_level": best_tradeoff_level,
        "tradeoff_pct": round(tradeoff_pct),
        "engagement_pct": round(engagement_pct),
        "core_risk_pct": round(core_risk_pct) if core_risk_pct is not None else None,
        "teachback": teachback,
        "status": decision.get("status") or "Unresolved",
        "decision_label": decision.get("decision_label") or "Clinical decision",
        "core_risk_items": core_risk_items,
        "patient_questions": questions,
        "recommendation_explained": clinician_response.get("recommendation_explained") == "Explained",
        "questions_answered_count": clinician_response.get("questions_answered_count") or 0,
        "questions_total_count": clinician_response.get("questions_total_count") or 0,
    }
