const assert = require('assert');
const {
    detectMissingCoreRiskHit,
    coreRiskRailTone,
    clinicianBehaviorKept,
    patientBehaviorKept,
    quoteInTurn,
    gatePatientBehavior,
    riskDetectionStatus,
} = require('../static/ccq_scoring.js');

const twoMissing = [
    { risk_name: 'Infection', detection_status: 'Not detected' },
    { risk_name: 'Nerve injury', detection_status: 'Not detected' },
];
const decision = { decision_label: 'Knee replacement' };

assert.strictEqual(
    detectMissingCoreRiskHit({ ...decision, pipeline_status: { pass_c: 'failed' } }, twoMissing),
    null
);
assert.strictEqual(
    detectMissingCoreRiskHit({ ...decision, pipeline_status: { pass_c: 'fallback' } }, twoMissing),
    null
);
assert.strictEqual(detectMissingCoreRiskHit(decision, twoMissing), null);

const hit = detectMissingCoreRiskHit(
    { ...decision, pipeline_status: { pass_c: 'ok' } },
    twoMissing
);
assert.strictEqual(hit.rule, 5);
assert.strictEqual(hit.priority, 'Medium');

const unassessed = twoMissing.map(risk => ({ ...risk, detection_status: 'Not assessed' }));
assert.strictEqual(
    detectMissingCoreRiskHit({ ...decision, pipeline_status: { pass_c: 'ok' } }, unassessed),
    null
);
assert.strictEqual(coreRiskRailTone({ pipeline_status: { pass_c: 'failed' } }, { detection_status: 'Not assessed' }), 'is-unscored');
assert.strictEqual(coreRiskRailTone({ pipeline_status: { pass_c: 'ok' } }, { detection_status: 'Not detected' }), 'is-gap');

const question = gatePatientBehavior({
    speaker: 'PATIENT',
    quote: 'What about infection?',
    turnText: 'What about infection?',
    firstNoul: 0.42,
    assertionNoul: 0.2,
    jevAvailable: true,
    kind: 'risk',
});
assert.strictEqual(question.kept, false);
assert.strictEqual(question.discussed, false);
assert.strictEqual(riskDetectionStatus(question.discussed), 'Not detected');

const stated = gatePatientBehavior({
    speaker: 'PATIENT',
    quote: 'Surgery could get infected.',
    turnText: 'Surgery could get infected.',
    firstNoul: 0.86,
    assertionNoul: 0.91,
    jevAvailable: true,
    kind: 'risk',
});
assert.strictEqual(stated.kept, true);
assert.strictEqual(stated.patient, true);
assert.strictEqual(stated.discussed, false);
assert.strictEqual(riskDetectionStatus(stated.discussed), 'Not detected');

assert.strictEqual(clinicianBehaviorKept(0.55), true);
assert.strictEqual(gatePatientBehavior({ speaker: 'SURGEON', noul: 0.55, kind: 'benefit' }).kept, true);

assert.strictEqual(patientBehaviorKept(0.8, 0.4), false);
assert.strictEqual(gatePatientBehavior({
    speaker: 'Patient',
    quote: 'Surgery could get infected.',
    turnText: 'Surgery could get infected.',
    firstNoul: 0.8,
    assertionNoul: 0.4,
    jevAvailable: true,
    kind: 'risk',
}).kept, false);

assert.strictEqual(quoteInTurn('Surgery could get infected.', 'Yeah, the right hip is the problem.'), false);
assert.strictEqual(gatePatientBehavior({
    speaker: 'PATIENT',
    quote: 'Surgery could get infected.',
    turnText: 'Yeah, the right hip is the problem.',
    firstNoul: 0.9,
    assertionNoul: 0.9,
    jevAvailable: true,
    kind: 'risk',
}).kept, false);

const echo = gatePatientBehavior({
    speaker: 'PATIENT',
    quote: "so you're saying infection is a risk",
    turnText: "So you're saying infection is a risk?",
    firstNoul: 0.8,
    assertionNoul: 0.35,
    jevAvailable: true,
    kind: 'risk',
});
assert.strictEqual(echo.kept, false);
assert.strictEqual(echo.discussed, false);

console.log('OK: rule 5 ignores a failed pass and a missing status');
