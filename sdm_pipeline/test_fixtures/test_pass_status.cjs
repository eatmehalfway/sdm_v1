const assert = require('assert');
const { detectMissingCoreRiskHit, coreRiskRailTone } = require('../static/ccq_scoring.js');

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

console.log('OK: rule 5 ignores a failed pass and a missing status');
