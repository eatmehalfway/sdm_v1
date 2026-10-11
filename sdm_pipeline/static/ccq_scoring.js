// Shared scoring rules for Phase 1a. A core-risk gap counts only after Pass C
// succeeds. Not assessed, unverified, and a missing pass status do not.
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    Object.assign(root, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function passCScoresGaps(decision) {
        return decision?.pipeline_status?.pass_c === 'ok';
    }

    function detectMissingCoreRiskHit(decision, coreRisks) {
        if (!passCScoresGaps(decision)) return null;
        const missing = (coreRisks || []).filter(risk => risk.detection_status === 'Not detected');
        const label = decision.decision_label;
        if (missing.length >= 3) {
            return {
                rule: 5,
                priority: 'High',
                type: 'Some core risks were not discussed',
                text: 'Three or more core risks of the selected intervention were not discussed.',
                source_field: 'informed_consent_analysis.interventions.core_risks',
                decisionLabel: label,
            };
        }
        if (missing.length >= 2) {
            return {
                rule: 5,
                priority: 'Medium',
                type: 'Some core risks were not discussed',
                text: 'Two core risks of the selected intervention were not discussed.',
                source_field: 'informed_consent_analysis.interventions.core_risks',
                decisionLabel: label,
            };
        }
        return null;
    }

    function riskGapBucket(risk) {
        const status = risk?.detection_status;
        if (status === 'Discussed') return 'discussed';
        if (status === 'Not detected') return 'not_discussed';
        return null;
    }

    function coreRiskRailTone(decision, risk) {
        const status = risk?.detection_status;
        if (status === 'Discussed') return 'is-discussed';
        const pass = decision?.pipeline_status?.pass_c;
        if (status === 'Not assessed' || pass === 'failed' || pass === 'fallback') return 'is-unscored';
        if (status === 'Not detected') return 'is-gap';
        return 'is-unscored';
    }

    return { passCScoresGaps, detectMissingCoreRiskHit, riskGapBucket, coreRiskRailTone };
});
