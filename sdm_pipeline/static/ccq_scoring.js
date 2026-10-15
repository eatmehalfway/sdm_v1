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

    const CLINICIAN_BEHAVIOR_NOUL = 0.5;
    const PATIENT_BEHAVIOR_NOUL = 0.7;

    function isPatientSpeaker(speaker) {
        return /patient|family|caregiver/i.test(String(speaker || ''));
    }

    function foldQuoteText(s) {
        return String(s || '')
            .toLowerCase()
            .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
            .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function quoteInTurn(quote, turnText) {
        const folded = foldQuoteText(quote);
        if (!folded) return false;
        return foldQuoteText(turnText).includes(folded);
    }

    function clinicianBehaviorKept(noul) {
        const n = Number(noul);
        return Number.isFinite(n) && n >= CLINICIAN_BEHAVIOR_NOUL;
    }

    function patientBehaviorKept(firstNoul, assertionNoul) {
        const first = Number(firstNoul);
        const assertion = Number(assertionNoul);
        return Number.isFinite(first) && Number.isFinite(assertion)
            && first >= PATIENT_BEHAVIOR_NOUL
            && assertion >= PATIENT_BEHAVIOR_NOUL;
    }

    function patientAssertionKept(assertionNoul) {
        const n = Number(assertionNoul);
        return Number.isFinite(n) && n >= PATIENT_BEHAVIOR_NOUL;
    }

    function riskDetectionStatus(clinicianSupported) {
        return clinicianSupported ? 'Discussed' : 'Not detected';
    }

    function gatePatientBehavior(spec) {
        const patient = isPatientSpeaker(spec?.speaker);
        if (!patient) {
            const kept = clinicianBehaviorKept(spec?.noul);
            return {
                kept,
                patient: false,
                discussed: spec?.kind === 'risk' && kept,
                patientCheck: null,
            };
        }
        if (!quoteInTurn(spec?.quote, spec?.turnText)) {
            return { kept: false, patient: true, discussed: false, patientCheck: null };
        }
        if (!spec?.jevAvailable) {
            return { kept: true, patient: true, discussed: false, patientCheck: 'quote_only' };
        }
        const kept = spec.firstNoul == null
            ? patientAssertionKept(spec.assertionNoul)
            : patientBehaviorKept(spec.firstNoul, spec.assertionNoul);
        return {
            kept,
            patient: true,
            discussed: false,
            patientCheck: kept ? 'confirmed' : null,
        };
    }

    return {
        passCScoresGaps,
        detectMissingCoreRiskHit,
        riskGapBucket,
        coreRiskRailTone,
        CLINICIAN_BEHAVIOR_NOUL,
        PATIENT_BEHAVIOR_NOUL,
        isPatientSpeaker,
        quoteInTurn,
        clinicianBehaviorKept,
        patientBehaviorKept,
        patientAssertionKept,
        riskDetectionStatus,
        gatePatientBehavior,
    };
});
