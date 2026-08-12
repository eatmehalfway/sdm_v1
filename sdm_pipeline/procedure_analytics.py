"""Procedure-level analytics: ordinal framing win-rates and risk-category gap/variation stats.

Implements the method Jacob specified for scoring how each procedure's
conversations tend to fall along a single-option <-> comparative-framing
spectrum, relative to its peer procedures:

    A. Calculate an ordinal win-rate for every pair of procedures.
    B. For each procedure, average its win-rates against all other procedures.
    C. Bootstrap encounters within procedures to calculate a 95% CI around
       the final score.
    D. Plot each procedure as a dot with its confidence interval and n,
       centered around a 50% peer-reference line.

No numpy dependency: rank-frequency counts keep the pairwise comparison
O(distinct ranks^2) instead of O(len(a) * len(b)), which keeps 1,000
bootstrap iterations fast in pure Python even with hundreds of encounters
per procedure.
"""
from __future__ import annotations

import math
import random
import statistics
from collections import Counter, defaultdict
from typing import Any

# Ordered from most single-option framing to most comparative framing —
# mirrors DISCUSSION_CATEGORIES / jitterCategory() in templates/index.html.
FRAMING_ORDER = [
    "Single option presented",
    "Not compared",
    "Limited comparison",
    "Meaningful comparison",
]
FRAMING_RANK = {category: index for index, category in enumerate(FRAMING_ORDER)}


def framing_category(decision_framing: str | None, tradeoff_level: str | None) -> str | None:
    """Python port of the frontend's jitterCategory(): collapses decision_framing
    + tradeoff_level onto the single 4-level ordinal framing scale."""
    if decision_framing == "Single option presented":
        return "Single option presented"
    return tradeoff_level


def framing_rank(decision_framing: str | None, tradeoff_level: str | None) -> int | None:
    return FRAMING_RANK.get(framing_category(decision_framing, tradeoff_level))


# --- Step A/B: ordinal win-rate ---------------------------------------------

def pairwise_win_rate(ranks_a: list[int], ranks_b: list[int]) -> float:
    """S(A,B) = [wins + 0.5 x ties] / total encounter pairs.

    Uses rank-frequency counts rather than iterating every (a, b) pair:
    mathematically identical, but O(distinct_ranks^2) instead of
    O(len(ranks_a) * len(ranks_b)).
    """
    return _pairwise_win_rate_from_counts(Counter(ranks_a), len(ranks_a), Counter(ranks_b), len(ranks_b))


def _pairwise_win_rate_from_counts(counts_a: Counter, n_a: int, counts_b: Counter, n_b: int) -> float:
    if not n_a or not n_b:
        return 0.5
    score = 0.0
    for rank_a, count_a in counts_a.items():
        for rank_b, count_b in counts_b.items():
            if rank_a > rank_b:
                outcome = 1.0
            elif rank_a == rank_b:
                outcome = 0.5
            else:
                outcome = 0.0
            score += count_a * count_b * outcome
    return score / (n_a * n_b)


def _final_scores_from_counts(counts_by_group: dict[str, Counter], n_by_group: dict[str, int]) -> dict[str, float]:
    groups = list(counts_by_group.keys())
    scores = {}
    for group in groups:
        peers = [peer for peer in groups if peer != group]
        if not peers:
            scores[group] = 0.5
            continue
        pairwise_scores = [
            _pairwise_win_rate_from_counts(counts_by_group[group], n_by_group[group], counts_by_group[peer], n_by_group[peer])
            for peer in peers
        ]
        scores[group] = sum(pairwise_scores) / len(pairwise_scores)
    return scores


def _percentile(sorted_values: list[float], pct: float) -> float:
    if not sorted_values:
        return 0.0
    if len(sorted_values) == 1:
        return sorted_values[0]
    rank = (len(sorted_values) - 1) * (pct / 100.0)
    lower = math.floor(rank)
    upper = math.ceil(rank)
    if lower == upper:
        return sorted_values[int(rank)]
    lower_weight = sorted_values[lower] * (upper - rank)
    upper_weight = sorted_values[upper] * (rank - lower)
    return lower_weight + upper_weight


def procedure_framing_scores(
    procedure_ranks: dict[str, list[int]],
    iterations: int = 1000,
    seed: int = 42,
    min_n: int = 5,
) -> list[dict[str, Any]]:
    """Steps A-D: pairwise win-rate -> per-procedure average -> bootstrap CI.

    `procedure_ranks` maps procedure name -> list of per-encounter framing
    ranks (0-3, see FRAMING_RANK). Procedures with fewer than `min_n`
    eligible encounters are excluded (too little signal for a meaningful
    peer comparison).
    """
    eligible = {proc: ranks for proc, ranks in procedure_ranks.items() if len(ranks) >= min_n}
    if len(eligible) < 2:
        return []

    counts_by_proc = {proc: Counter(ranks) for proc, ranks in eligible.items()}
    n_by_proc = {proc: len(ranks) for proc, ranks in eligible.items()}
    point_scores = _final_scores_from_counts(counts_by_proc, n_by_proc)

    rng = random.Random(seed)
    bootstrap_scores: dict[str, list[float]] = {proc: [] for proc in eligible}
    for _ in range(iterations):
        resampled_counts = {
            proc: Counter(rng.choices(ranks, k=len(ranks)))
            for proc, ranks in eligible.items()
        }
        iteration_scores = _final_scores_from_counts(resampled_counts, n_by_proc)
        for proc, score in iteration_scores.items():
            bootstrap_scores[proc].append(score)

    results = []
    for proc in eligible:
        distribution = sorted(bootstrap_scores[proc])
        results.append({
            "procedure": proc,
            "score": round(point_scores[proc] * 100, 1),
            "ci_low": round(_percentile(distribution, 2.5) * 100, 1),
            "ci_high": round(_percentile(distribution, 97.5) * 100, 1),
            "n": n_by_proc[proc],
        })
    results.sort(key=lambda row: row["score"])
    return results


# --- Risk-category gap rate + clinician/procedure variation -----------------

CAT_DEVICE_KEYWORDS = ("implant", "device", "hardware", "material", "cement", "stimulator")
CAT_INFECTION_KEYWORDS = ("infect",)
CAT_BLEEDING_KEYWORDS = ("bleed", "hemorrhage", "haemorrhage", "blood loss")
CAT_NEURO_KEYWORDS = ("nerve", "neuro", "sensory", "numb", "paraly", "spinal cord")
CAT_STRUCTURAL_KEYWORDS = ("dural", "tear", "fracture", "structural", "anatomic", "perforat")
CAT_REINTERVENTION_KEYWORDS = ("revision", "reintervention", "re-intervention", "additional treatment", "repeat", "further surgery")
CAT_TREATMENT_FAILURE_KEYWORDS = ("failure", "inadequate", "did not relieve", "recurrence", "non-union", "nonunion")
CAT_PAIN_KEYWORDS = ("pain", "symptom")

_INFERENCE_RULES = (
    ("Device / implant / material", CAT_DEVICE_KEYWORDS),
    ("Infection", CAT_INFECTION_KEYWORDS),
    ("Bleeding / hemorrhage", CAT_BLEEDING_KEYWORDS),
    ("Neurologic / sensory", CAT_NEURO_KEYWORDS),
    ("Structural / anatomic injury", CAT_STRUCTURAL_KEYWORDS),
    ("Additional treatment / reintervention", CAT_REINTERVENTION_KEYWORDS),
    ("Treatment failure / inadequate effect", CAT_TREATMENT_FAILURE_KEYWORDS),
    ("Pain / symptom worsening", CAT_PAIN_KEYWORDS),
)


def infer_risk_category(risk_name: str | None) -> str | None:
    """Best-effort keyword classifier for risk items that lack an explicit
    `risk_category` tag (e.g. real Gemini-analyzed runs with freeform risk
    names), so the gap/variation chart works for saved runs too."""
    text = (risk_name or "").casefold()
    if not text:
        return None
    for category, keywords in _INFERENCE_RULES:
        if any(keyword in text for keyword in keywords):
            return category
    return None


def resolve_risk_category(item: dict[str, Any]) -> str | None:
    return item.get("risk_category") or infer_risk_category(item.get("risk_name"))


def risk_category_gap_stats(
    episodes: list[dict[str, Any]],
    min_clinicians: int = 3,
    min_procedures: int = 2,
    min_episodes_per_group: int = 5,
) -> list[dict[str, Any]]:
    """Per risk-category: overall gap rate plus clinician- and
    procedure-level variation (standard deviation of each group's gap rate),
    per Jacob's revision: variation is only computed across groups with
    enough applicable episodes to be a meaningful rate estimate.
    """
    overall: dict[str, dict[str, int]] = defaultdict(lambda: {"gap": 0, "total": 0})
    by_clinician: dict[str, dict[str, dict[str, int]]] = defaultdict(lambda: defaultdict(lambda: {"gap": 0, "total": 0}))
    by_procedure: dict[str, dict[str, dict[str, int]]] = defaultdict(lambda: defaultdict(lambda: {"gap": 0, "total": 0}))

    for episode in episodes:
        clinician_id = episode.get("clinician_id")
        procedure = episode.get("procedure")
        for item in episode.get("core_risk_items") or []:
            category = resolve_risk_category(item)
            if not category:
                continue
            is_gap = item.get("detection_status") != "Discussed"

            bucket = overall[category]
            bucket["total"] += 1
            bucket["gap"] += int(is_gap)

            if clinician_id:
                bucket = by_clinician[category][clinician_id]
                bucket["total"] += 1
                bucket["gap"] += int(is_gap)

            if procedure:
                bucket = by_procedure[category][procedure]
                bucket["total"] += 1
                bucket["gap"] += int(is_gap)

    results = []
    for category, agg in overall.items():
        if not agg["total"]:
            continue
        clinician_rates = [
            group["gap"] / group["total"]
            for group in by_clinician[category].values()
            if group["total"] >= min_episodes_per_group
        ]
        procedure_rates = [
            group["gap"] / group["total"]
            for group in by_procedure[category].values()
            if group["total"] >= min_episodes_per_group
        ]
        # Full per-group breakdowns (not just the summary stdev above) so the
        # frontend's semantic-zoom drill-down on the bubble chart can split a
        # category bubble into per-clinician or per-procedure sub-bubbles.
        by_clinician_rows = sorted(
            (
                {
                    "clinician_id": clinician_id,
                    "gap_rate": round(100 * group["gap"] / group["total"], 1),
                    "n": group["total"],
                }
                for clinician_id, group in by_clinician[category].items()
                if group["total"] >= min_episodes_per_group
            ),
            key=lambda row: -row["gap_rate"],
        )
        by_procedure_rows = sorted(
            (
                {
                    "procedure": procedure,
                    "gap_rate": round(100 * group["gap"] / group["total"], 1),
                    "n": group["total"],
                }
                for procedure, group in by_procedure[category].items()
                if group["total"] >= min_episodes_per_group
            ),
            key=lambda row: -row["gap_rate"],
        )
        results.append({
            "risk_category": category,
            "gap_rate": round(100 * agg["gap"] / agg["total"], 1),
            "applicable_episodes": agg["total"],
            "clinician_count": len(clinician_rates),
            "clinician_variation": (
                round(100 * statistics.pstdev(clinician_rates), 1)
                if len(clinician_rates) >= min_clinicians else None
            ),
            "procedure_count": len(procedure_rates),
            "procedure_variation": (
                round(100 * statistics.pstdev(procedure_rates), 1)
                if len(procedure_rates) >= min_procedures else None
            ),
            "clinician_rate_range": (
                [round(100 * min(clinician_rates)), round(100 * max(clinician_rates))]
                if clinician_rates else None
            ),
            "by_clinician": by_clinician_rows,
            "by_procedure": by_procedure_rows,
        })
    results.sort(key=lambda row: -row["applicable_episodes"])
    return results


if __name__ == "__main__":
    # Quick sanity check against Jacob's worked example:
    #   S(Lumbar, Knee) = 42%, S(Lumbar, Hip) = 48%, S(Lumbar, Cataract) = 36%
    #   -> S(Lumbar) = (42 + 48 + 36) / 3 = 42%
    # We can't reproduce his exact source encounters, but we can confirm the
    # aggregation mechanics (pairwise average, bootstrap CI shape) behave as
    # specified using a small synthetic example.
    demo_ranks = {
        "Lumbar": [3, 3, 2, 3, 1, 3, 2, 3, 3, 1, 2, 3] * 8,   # skews comparative
        "Knee": [1, 2, 1, 0, 2, 1, 1, 0, 2, 1, 0, 1] * 8,      # skews single-option
        "Hip": [2, 2, 3, 1, 2, 2, 3, 1, 2, 2, 1, 2] * 6,
        "ECT": [0, 1, 0, 2, 0, 1] * 4,                         # small n -> wide CI
    }
    for row in procedure_framing_scores(demo_ranks, iterations=500):
        print(f"{row['procedure']:>6}: {row['score']}% (95% CI {row['ci_low']}-{row['ci_high']}%), n={row['n']}")
