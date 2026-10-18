import { typescaleStyles } from './m3_components.js';

if (typescaleStyles?.styleSheet) {
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
}

const BEHAVIORS = [
    { key: 'option', label: 'Option', icon: 'alt_route' },
    { key: 'benefit', label: 'Benefit', icon: 'trending_up' },
    { key: 'burden', label: 'Burden', icon: 'balance' },
    { key: 'risk', label: 'Risk', icon: 'warning' },
    { key: 'recommendation', label: 'Recommendation', icon: 'recommend' },
    { key: 'preference', label: 'Preference', icon: 'favorite' },
    { key: 'question', label: 'Question', icon: 'help' },
];
const NAMES = ['Elena Vasquez', 'James Okonkwo', 'Priya Shah', 'Marcus Hale', 'Sofia Alvarez', 'Daniel Cho', 'Amara Bennett', 'Luis Ortega'];
const THEME_KEY = 'm3-cockpit-theme';

const COLUMNS = [
    { key: 'option', label: 'Option', short: 'Opt' },
    { key: 'benefit', label: 'Benefit', short: 'Ben' },
    { key: 'burden', label: 'Burden', short: 'Bur' },
    { key: 'risk', label: 'Risk', short: 'Rsk' },
    { key: 'recommendation', label: 'Recommendation', short: 'Rec' },
    { key: 'preference', label: 'Preference', short: 'Prf' },
    { key: 'question', label: 'Question', short: 'Qst' },
];
const LABEL_W = 40;
const COL_W = 28;
const TICK_W = 14;
const TRACK_W = LABEL_W + COLUMNS.length * COL_W;
const HEADER_H = 74;
const HEDGE_REC = /either would be reasonable|second opinion is reasonable|both (are|would be) (reasonable|options)|is reasonable if you/i;

const state = {
    decisionId: null,
    turn: null,
    behaviorKey: null,
    eventId: null,
    riskName: null,
};

let payload = { decisions: [], turns: [] };

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
}

function hashString(s) {
    let h = 0;
    String(s || '').split('').forEach(ch => { h = ((h << 5) - h) + ch.charCodeAt(0); h |= 0; });
    return Math.abs(h);
}

function identity(episodeId) {
    const h = hashString(episodeId);
    const start = new Date(2026, 2, 4);
    const end = new Date(start.getTime() + ((h % 10) + 7) * 86400000);
    const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
        clinician: 'Dr. Maya Chen',
        patient: NAMES[h % NAMES.length],
        startDate: fmt(start),
        endDate: fmt(end),
        mrn: String(1000000 + (h % 9000000)),
    };
}

function speakerSide(speaker) {
    const line = String(speaker || '').trim();
    if (!line || /metadata/i.test(line)) return null;
    return isPatientSpeaker(line) ? 'patient' : 'clinician';
}

function behaviorMeta(key) {
    return BEHAVIORS.find(item => item.key === key) || BEHAVIORS[0];
}

function decisionsFrom(raw) {
    if (raw && !Array.isArray(raw) && Array.isArray(raw.decisions)) return raw.decisions;
    return Array.isArray(raw) ? raw : [];
}

function currentDecision() {
    return payload.decisions.find(item => item.decision_id === state.decisionId) || payload.decisions[0] || null;
}

function consentIntervention(decision) {
    const interventions = decision?.informed_consent_analysis?.interventions || [];
    const chosen = String(decision?.selected_intervention || '').trim().toLowerCase();
    if (chosen) {
        const match = interventions.find(item => String(item.intervention_name || '').trim().toLowerCase() === chosen);
        if (match) return match;
    }
    return interventions.find(item => (item.core_risks || []).length) || interventions[0] || null;
}

function coreRisks(decision) {
    return consentIntervention(decision)?.core_risks || [];
}

function turnList(field) {
    return (field?.turn_indices || []).map(Number).filter(turn => Number.isInteger(turn));
}

function patientTurn(field, turn) {
    const sides = field?.speaker_sides || {};
    if (sides[turn] === 'patient' || sides[String(turn)] === 'patient') return true;
    const checks = field?.patient_checks || {};
    return checks[turn] != null || checks[String(turn)] != null;
}

function optionIsConservative(name) {
    return /nonsurgical|conservative|watchful|physical therapy|injection|waiting|epidural|structured pt/i.test(name || '');
}

function optionIsChosen(decision, name) {
    const needle = String(name || '').toLowerCase().trim();
    if (!needle) return false;
    const selected = String(decision?.selected_option || '').toLowerCase().trim();
    const intervention = String(decision?.selected_intervention || '').toLowerCase().trim();
    if (selected && (selected.includes(needle) || needle.includes(selected))) return true;
    return !!(intervention && needle.includes(intervention));
}

function explicitRecommendation(rec) {
    if (!rec || !rec.recommended_option) return false;
    const blob = `${rec.recommended_option} ${rec.rationale || ''} ${rec.qualification || ''}`;
    if (HEDGE_REC.test(blob) && !rec.rationale) return false;
    if (HEDGE_REC.test(rec.qualification || '') && !rec.rationale) return false;
    return true;
}

function inferAnswerTurn(asked) {
    if (asked == null) return null;
    const after = payload.turns.filter(turn => Number(turn.index) > Number(asked));
    const clinician = after.find(turn => /doctor|clinician|physician|surgeon|attending/i.test(turn.speaker_line || ''));
    if (clinician) return Number(clinician.index);
    return after[0] != null ? Number(after[0].index) : null;
}

function questionTurns(question) {
    const askedTurns = turnList(question);
    const asked = askedTurns[0];
    let answers = (question?.response_turn_indices || []).map(Number).filter(turn => Number.isInteger(turn));
    if (!answers.length) answers = askedTurns.slice(1);
    if (!answers.length && (String(question?.response || '').trim() || String(question?.response_status || '').toLowerCase().includes('answer'))) {
        const inferred = inferAnswerTurn(asked);
        if (inferred != null) answers = [inferred];
    }
    return { asked: asked ?? null, answers };
}

function groupId(event) {
    if (event.key === 'option' || event.key === 'benefit' || event.key === 'burden') return `${event.key}:${event.optionName || event.label}`;
    if (event.key === 'risk') return `risk:${event.riskName || event.label}`;
    if (event.key === 'question') return `question:${event.label || event.turn}`;
    if (event.key === 'recommendation') return `recommendation:${event.optionName || event.label}`;
    return `${event.key}:${event.turn}:${event.label}`;
}

function groupedKey(key) {
    return key === 'option' || key === 'benefit' || key === 'burden' || key === 'risk' || key === 'question';
}

function linkedKey(key) {
    return key === 'option' || key === 'benefit' || key === 'burden';
}

function mapEvents(decision) {
    if (!decision) return [];
    const events = [];
    const push = (event) => {
        if (!Number.isInteger(event.turn)) return;
        const spec = event.riskName || event.optionName || event.label || '';
        event.id = `${decision.decision_id}::${event.key}::${event.turn}::${spec}::${event.patient ? 'patient' : 'clinician'}::${event.isAnswer ? 'answer' : 'mark'}`;
        events.push(event);
    };
    (decision.decision_overview?.options_considered || []).forEach(option => {
        const name = option.option_name || 'Option';
        const involve = turnList(option.what_it_involves);
        const optionTurns = involve.length
            ? involve
            : turnList(option.what_it_involves).concat(turnList(option.benefits), turnList(option.risks), turnList(option.burdens)).slice(0, 1);
        optionTurns.forEach(turn => push({
            key: 'option', turn, label: `Option considered: ${name}`, optionName: name,
            quote: option.what_it_involves?.quote || option.what_it_involves?.text || '',
            patient: patientTurn(option.what_it_involves, turn),
            conservative: optionIsConservative(name),
            chosen: optionIsChosen(decision, name),
        }));
        turnList(option.benefits).forEach(turn => push({
            key: 'benefit', turn, label: `Benefit: ${name}`, optionName: name,
            quote: option.benefits?.quote || option.benefits?.text || '',
            patient: patientTurn(option.benefits, turn),
        }));
        turnList(option.burdens).forEach(turn => push({
            key: 'burden', turn, label: `Burden: ${name}`, optionName: name,
            quote: option.burdens?.quote || option.burdens?.text || '',
            patient: patientTurn(option.burdens, turn),
        }));
        turnList(option.risks).forEach(turn => push({
            key: 'risk', turn, label: `Risk: ${name}`, optionName: name,
            quote: option.risks?.quote || option.risks?.text || '',
            patient: patientTurn(option.risks, turn),
        }));
    });
    const recommendation = decision.decision_overview?.clinician_recommendation;
    if (explicitRecommendation(recommendation)) {
        turnList(recommendation).forEach(turn => push({
            key: 'recommendation', turn,
            label: `Recommended: ${recommendation.recommended_option || '—'}`,
            optionName: recommendation.recommended_option,
            quote: recommendation.quote || '',
            patient: false,
        }));
    }
    const considerations = decision.decision_overview?.patient_considerations || {};
    [...(considerations.goals_priorities || []), ...(considerations.preferences || [])].forEach(item => {
        turnList(item).forEach(turn => push({
            key: 'preference', turn, label: item.text || 'Preference',
            quote: item.quote || '', patient: true,
        }));
    });
    (considerations.questions || []).forEach(question => {
        const { asked, answers } = questionTurns(question);
        if (asked == null) return;
        const label = question.question || 'Question';
        push({
            key: 'question', turn: asked, label, quote: question.quote || label,
            patient: true, isAnswer: false,
        });
        answers.forEach(turn => {
            if (Number(turn) === Number(asked)) return;
            push({
                key: 'question', turn, label, quote: question.response_quote || question.response || '',
                patient: false, isAnswer: true,
            });
        });
    });
    const intervention = consentIntervention(decision);
    ['core_risks', 'relevant_risks', 'context_dependent_risks'].forEach(tier => {
        (intervention?.[tier] || []).forEach(risk => {
            const name = risk.risk_name || 'Risk';
            if (risk.detection_status === 'Discussed') {
                turnList(risk).forEach(turn => push({
                    key: 'risk', turn, label: name, riskName: name,
                    quote: risk.quote || '', patient: patientTurn(risk, turn),
                }));
            }
            (risk.patient_turn_indices || []).forEach(turn => push({
                key: 'risk', turn: Number(turn), label: name, riskName: name,
                quote: risk.quote || '', patient: true,
            }));
        });
    });
    return events.sort((a, b) => a.turn - b.turn || a.key.localeCompare(b.key));
}

function primaryEvents(events) {
    const seen = new Set();
    const out = [];
    [...events].sort((a, b) => a.turn - b.turn).forEach(event => {
        if (groupedKey(event.key)) {
            const id = groupId(event);
            if (seen.has(id)) return;
            seen.add(id);
        }
        out.push(event);
    });
    return out;
}

function relatedNames(event, decision) {
    const names = new Set();
    if (event.optionName) names.add(event.optionName);
    if (event.key === 'risk' && event.riskName) {
        const needle = event.riskName.toLowerCase();
        (decision.decision_overview?.options_considered || []).forEach(option => {
            const text = `${option.risks?.text || ''} ${option.risks?.quote || ''}`.toLowerCase();
            const turns = turnList(option.risks);
            if ((needle && text.includes(needle)) || turns.includes(Number(event.turn))) {
                if (option.option_name) names.add(option.option_name);
            }
        });
    }
    return names;
}

function quoteInText(quote, text) {
    const left = String(quote || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const right = String(text || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (left.length < 12 || !right) return false;
    return right.includes(left.slice(0, 80));
}

function preferredRiskEvent(events, turn, hintQuote) {
    const named = events.filter(event => event.key === 'risk' && event.riskName && event.turn === Number(turn));
    if (!named.length) return null;
    if (state.riskName) {
        const current = named.find(event => event.riskName === state.riskName && !event.patient)
            || named.find(event => event.riskName === state.riskName);
        if (current) return current;
    }
    const turnText = turnBody(turnRow(turn));
    const score = event => {
        const quote = event.quote || '';
        let value = event.patient ? 0 : 1;
        if (quoteInText(quote, turnText)) value += 4;
        if (quoteInText(quote, hintQuote) || quoteInText(hintQuote, quote)) value += 2;
        return value;
    };
    return [...named].sort((a, b) => score(b) - score(a) || String(a.riskName).localeCompare(String(b.riskName)))[0];
}

function mapBudget() {
    const pane = document.querySelector('.map-pane');
    if (pane && pane.clientHeight > 200) return pane.clientHeight - 28;
    return Math.max(400, Math.min(720, window.innerHeight - 320));
}

function gridMetrics(events, extraTurns) {
    const behaviorTurns = [...new Set(events.map(event => event.turn))].filter(turn => Number.isInteger(turn)).sort((a, b) => a - b);
    const hasBehavior = new Set(behaviorTurns);
    const span = behaviorTurns.concat((extraTurns || []).filter(turn => Number.isInteger(turn)));
    if (!span.length) return { turns: [], hasBehavior, hB: 0, hE: 0, bodyH: 0 };
    const lo = Math.min(...span);
    const hi = Math.max(...span);
    const turns = [];
    for (let turn = lo; turn <= hi; turn += 1) turns.push(turn);
    const nB = behaviorTurns.filter(turn => turn >= lo && turn <= hi).length;
    const nE = turns.length - nB;
    const maxBody = Math.max(80, mapBudget() - HEADER_H);
    const units = nB * 10 + nE;
    const unit = Math.min(1.2, maxBody / Math.max(units, 1));
    return { turns, hasBehavior, hB: 10 * unit, hE: unit, bodyH: nB * 10 * unit + nE * unit };
}

function choiceExtras(decision) {
    const choice = Number(decision?.choice_made?.turn_index);
    if (!Number.isInteger(choice) || choice < 0) return [];
    const extra = [choice, choice + 1];
    const relevant = (decision.relevant_turn_indices || []).map(Number).filter(turn => Number.isInteger(turn));
    if (relevant.length) extra.push(Math.min(...relevant), Math.max(...relevant));
    return extra;
}

function centuryMarks(first, last) {
    const marks = [];
    if (!Number.isFinite(first) || !Number.isFinite(last)) return marks;
    for (let mark = Math.max(100, Math.ceil(first / 100) * 100); mark <= last; mark += 100) marks.push(mark);
    return marks;
}

function centuryY(rows, century) {
    const exact = rows.find(row => row.turn === century);
    if (exact) return exact.y0 + exact.rowH / 2;
    const next = rows.find(row => row.turn >= century);
    if (next) return next.y0;
    for (let i = rows.length - 1; i >= 0; i -= 1) {
        if (rows[i].turn < century) return rows[i].y0 + rows[i].rowH;
    }
    return null;
}

function renderTickGrid(decision) {
    if (!decision) return '<p class="md-typescale-body-medium">No decision on this run.</p>';
    const events = mapEvents(decision);
    const selected = events.find(event => event.id === state.eventId)
        || events.find(event => event.key === state.behaviorKey && event.turn === state.turn)
        || null;
    const visible = events.filter(event => {
        if (!event.isAnswer) return true;
        return selected?.key === 'question' && event.label === selected.label;
    });
    const metrics = gridMetrics(visible, choiceExtras(decision));
    if (!metrics.turns.length) return '<p class="md-typescale-body-medium">No coded behaviors on this decision.</p>';
    const primaries = primaryEvents(events);
    const selectedGroup = selected && groupedKey(selected.key) ? groupId(selected) : null;
    const selectedOption = selected && linkedKey(selected.key) ? selected.optionName : null;
    const selectedRec = selected?.key === 'recommendation' ? groupId(selected) : null;
    const earliest = selectedGroup
        ? Math.min(...events.filter(event => groupId(event) === selectedGroup).map(event => event.turn))
        : null;
    const cells = new Map();
    const ghosts = new Set();
    primaries.forEach(event => {
        const key = `${event.key}:${event.turn}`;
        if (!cells.has(key)) cells.set(key, { event, labels: [event.label] });
        else cells.get(key).labels.push(event.label);
    });
    if (selectedGroup) {
        events.forEach(event => {
            if (groupId(event) !== selectedGroup) return;
            const key = `${event.key}:${event.turn}`;
            if (!cells.has(key)) cells.set(key, { event, labels: [event.label] });
            else if (!cells.get(key).labels.includes(event.label)) cells.get(key).labels.push(event.label);
            if (event.turn !== earliest) ghosts.add(key);
        });
    }
    if (selectedOption) {
        events.forEach(event => {
            if (!relatedNames(event, decision).has(selectedOption)) return;
            const key = `${event.key}:${event.turn}`;
            if (!cells.has(key)) cells.set(key, { event, labels: [event.label] });
        });
    }
    cells.forEach(cell => {
        if (cell.event.key !== 'risk') return;
        const preferred = preferredRiskEvent(events, cell.event.turn, cell.event.quote);
        if (!preferred || preferred.id === cell.event.id) return;
        cell.labels = [preferred.label, ...cell.labels.filter(label => label !== preferred.label)];
        cell.event = preferred;
    });
    const first = metrics.turns[0];
    const last = metrics.turns[metrics.turns.length - 1];
    const cols = COLUMNS.map(col => `<span class="tick-col col-${col.key}" title="${esc(col.label)}">${esc(col.short)}</span>`).join('');
    let y = 0;
    const rowMeta = [];
    const joins = [];
    const rows = metrics.turns.map(turn => {
        const has = metrics.hasBehavior.has(turn);
        const rowH = has ? metrics.hB : metrics.hE;
        const y0 = y;
        y += rowH;
        rowMeta.push({ turn, y0, rowH });
        if (has && metrics.hasBehavior.has(turn + 1)) {
            COLUMNS.forEach((col, index) => {
                if (!cells.has(`${col.key}:${turn}`) || !cells.has(`${col.key}:${turn + 1}`)) return;
                const cx = LABEL_W + index * COL_W + COL_W / 2;
                joins.push(`<line class="tick-join" x1="${cx - TICK_W / 2}" y1="${y}" x2="${cx + TICK_W / 2}" y2="${y}" stroke-width="1" shape-rendering="crispEdges"></line>`);
            });
        }
        const ticks = has ? COLUMNS.map((col, index) => {
            const cellKey = `${col.key}:${turn}`;
            const cell = cells.get(cellKey);
            if (!cell) return '';
            const event = cell.event;
            const cx = LABEL_W + index * COL_W + COL_W / 2;
            const active = state.behaviorKey === col.key && state.turn === turn;
            const ghost = ghosts.has(cellKey);
            const linked = !!(selectedOption && relatedNames(event, decision).has(selectedOption));
            const sameRec = !!(selectedRec && groupId(event) === selectedRec && !active);
            const associated = linked || sameRec;
            const faded = !!(state.behaviorKey && !active && !ghost && !associated);
            const opacity = active ? 1 : ghost ? 0.28 : associated ? 0.95 : faded ? 0.22 : 0.85;
            const note = ghost ? (event.isAnswer ? ' · answer' : ' · later mention') : '';
            const title = `${behaviorMeta(col.key).label}: ${cell.labels.join('; ')} · turn ${turn}${note}`;
            const hatch = event.key === 'option' && (event.conservative || optionIsConservative(event.optionName));
            const boxed = event.key === 'option' && (event.chosen || optionIsChosen(decision, event.optionName));
            return `<g class="tick-mark" role="button" tabindex="0" data-id="${esc(event.id)}" data-key="${esc(col.key)}" data-turn="${turn}" aria-label="${esc(title)}" aria-pressed="${active ? 'true' : 'false'}">
                <title>${esc(title)}</title>
                <rect x="${cx - 12}" y="${y0}" width="24" height="${rowH}" fill="transparent"></rect>
                <rect class="tick-fill tick-${col.key}" x="${cx - TICK_W / 2}" y="${y0}" width="${TICK_W}" height="${rowH}" fill-opacity="${opacity}"></rect>
                ${hatch ? `<rect x="${cx - TICK_W / 2}" y="${y0}" width="${TICK_W}" height="${rowH}" fill="url(#map-hatch)"></rect>` : ''}
                ${boxed ? `<rect class="tick-box" x="${cx - TICK_W / 2}" y="${y0}" width="${TICK_W}" height="${rowH}" stroke-width="1.5"></rect>` : ''}
                ${associated && !active && !ghost ? `<rect class="tick-link" x="${cx - TICK_W / 2}" y="${y0}" width="${TICK_W}" height="${rowH}" stroke-width="2"></rect>` : ''}
            </g>`;
        }).join('') : '';
        const empty = has ? '' : ' · no coded behavior';
        return `<g class="tick-row${state.turn === turn ? ' is-playhead' : ''}" data-turn="${turn}">
            <title>Turn ${turn}${empty}</title>
            <rect class="row-bg" x="0" y="${y0}" width="${TRACK_W}" height="${rowH}"></rect>
            ${ticks}
        </g>`;
    }).join('');
    const centuries = centuryMarks(first, last).map(mark => {
        const line = centuryY(rowMeta, mark);
        if (line == null) return '';
        return `<line class="century-line" x1="0" y1="${line}" x2="${TRACK_W}" y2="${line}" stroke-width="1" shape-rendering="crispEdges"></line>`;
    }).join('');
    const choiceTurn = Number(decision.choice_made?.turn_index);
    const choiceRow = Number.isInteger(choiceTurn) ? rowMeta.find(row => row.turn === choiceTurn) : null;
    const choiceY = choiceRow ? choiceRow.y0 + choiceRow.rowH : null;
    const choiceFill = choiceY == null ? '' : `<rect class="choice-fill" x="0" y="${choiceY}" width="${TRACK_W}" height="${Math.max(0, metrics.bodyH - choiceY)}"></rect>`;
    const choiceName = decision.choice_made?.option_name ? ` · ${decision.choice_made.option_name}` : '';
    const choiceLine = choiceY == null ? '' : `<g><title>Choice made · turn ${choiceTurn}${esc(choiceName)}</title><line class="choice-line" x1="0" y1="${choiceY}" x2="${TRACK_W}" y2="${choiceY}" stroke-width="1.5" stroke-dasharray="1.5 3.5" stroke-linecap="round"></line></g>`;
    const ends = metrics.bodyH >= 22
        ? `<text class="tick-turn" x="${LABEL_W - 4}" y="11" text-anchor="end">${first}</text>${last === first ? '' : `<text class="tick-turn" x="${LABEL_W - 4}" y="${metrics.bodyH - 2}" text-anchor="end">${last}</text>`}`
        : '';
    return `<div class="tick-grid">
        <div class="tick-grid-cols"><span class="tick-col-gutter"></span>${cols}</div>
        <div class="tick-grid-body">
            <svg viewBox="0 0 ${TRACK_W} ${metrics.bodyH}" width="${TRACK_W}" height="${metrics.bodyH}" role="group" aria-label="Behavior map">
                <defs>
                    <pattern id="map-hatch" patternUnits="userSpaceOnUse" width="5" height="5">
                        <path d="M-1,1 L1,-1 M0,5 L5,0 M4,6 L6,4" fill="none" stroke="var(--md-sys-color-on-surface)" stroke-width="1.6"></path>
                        <path d="M-1,4 L1,6 M0,0 L5,5 M4,-1 L6,1" fill="none" stroke="var(--md-sys-color-on-surface)" stroke-width="1.6"></path>
                    </pattern>
                </defs>
                ${choiceFill}${rows}${joins.join('')}${centuries}${choiceLine}${ends}
            </svg>
        </div>
    </div>`;
}

function turnRow(index) {
    return payload.turns.find(turn => Number(turn.index) === Number(index));
}

function turnBody(turn) {
    return (turn?.text_lines || []).join(' ').trim();
}

function speakerIcon(side, filled, slot = 'start') {
    if (!side) return '<span class="turn-icon-slot" aria-hidden="true"></span>';
    const name = side === 'patient' ? 'person' : 'stethoscope';
    const label = side === 'patient' ? 'Patient' : 'Clinician';
    return `<md-icon class="${side}${filled ? ' filled' : ''}" slot="${slot}" aria-label="${label}">${name}</md-icon>`;
}

function card(title, body, extra = '', note = '') {
    const heading = `<h2 class="md-typescale-title-medium">${esc(title)}</h2>`;
    const head = note ? `<div class="card-head">${heading}${note}</div>` : heading;
    return `<article class="card">${head}<p class="md-typescale-body-medium">${esc(body)}</p>${extra}</article>`;
}

function plainText(field) {
    if (!field) return '';
    if (typeof field === 'string') return field.trim();
    return String(field.text || '').trim();
}

function discussedText(value) {
    const text = String(value || '').trim();
    if (!text || text === 'Not discussed' || text === 'Named only' || text === 'Not discussed here') return false;
    return !/^named(\s+as|\s+only)/i.test(text);
}

function discussedBefore(field, choiceTurn, treated) {
    const discussed = treated != null ? treated : discussedText(plainText(field));
    if (!discussed) return false;
    const turns = turnList(field);
    if (!turns.length) return true;
    return turns.some(turn => turn < choiceTurn);
}

function discussedOnlyAfter(field, choiceTurn) {
    if (!discussedText(plainText(field))) return false;
    const turns = turnList(field);
    if (!turns.length) return false;
    return turns.every(turn => turn >= choiceTurn);
}

const LIMITED_BENEFIT = /may not help|limited (relief|benefit)|temporary|not (likely|expected) to|unlikely to (help|relieve)|no (real |lasting )?benefit/i;

function optionMentionTurns(option) {
    return [...new Set(turnList(option.what_it_involves).concat(turnList(option.benefits), turnList(option.risks), turnList(option.burdens)))];
}

function presentedBefore(option, choiceTurn) {
    const turns = optionMentionTurns(option);
    if (!turns.length) return true;
    return turns.some(turn => turn < choiceTurn);
}

function outcomeBefore(option, choiceTurn) {
    const benefitLimited = LIMITED_BENEFIT.test(plainText(option.benefits));
    const benefitBefore = discussedBefore(option.benefits, choiceTurn) && !benefitLimited;
    const burdenBefore = discussedBefore(option.burdens, choiceTurn) || discussedBefore(option.benefits, choiceTurn, benefitLimited);
    return benefitBefore || burdenBefore || discussedBefore(option.risks, choiceTurn);
}

function firstItemTurn(item) {
    const turns = turnList(item);
    return turns.length ? Math.min(...turns) : null;
}

function answerTurn(item) {
    if (String(item?.response_status || '').trim() !== 'Answered') return null;
    const turns = (item.response_turn_indices || []).map(Number).filter(turn => Number.isInteger(turn));
    return turns.length ? turns[0] : null;
}

function choiceTurnOn(decision) {
    const raw = decision?.choice_made?.turn_index;
    if (raw == null || raw === '') return null;
    const turn = Number(raw);
    return Number.isInteger(turn) && turn >= 0 ? turn : null;
}

function detectAltWithoutOutcome(decision, choiceTurn) {
    const options = decision?.decision_overview?.options_considered || [];
    const presented = options.filter(option => option.option_name && !optionIsChosen(decision, option.option_name) && presentedBefore(option, choiceTurn));
    if (!presented.length || presented.some(option => outcomeBefore(option, choiceTurn))) return null;
    return {
        rule: 1,
        priority: 'High',
        type: 'Alternative presented without expected outcome discussion',
        text: 'An alternative was presented before selection without a recorded benefit, burden, or risk.',
    };
}

function detectNoPreferenceBeforeSelection(decision, choiceTurn) {
    const options = decision?.decision_overview?.options_considered || [];
    if (options.filter(option => presentedBefore(option, choiceTurn)).length < 2) return null;
    const considerations = decision.decision_overview?.patient_considerations || {};
    const engagement = decision.communication_analysis?.patient_engagement || {};
    const before = [...(considerations.preferences || []), ...(considerations.goals_priorities || [])]
        .some(item => {
            const turn = firstItemTurn(item);
            return turn != null && turn < choiceTurn;
        });
    if (before || engagement.preferences_elicited || engagement.goals_priorities_elicited) return null;
    return {
        rule: 2,
        priority: 'Medium',
        type: 'No patient preference identified before treatment selection',
        text: 'Two or more options were presented before selection, with no recorded patient preference or elicitation attempt.',
    };
}

function detectPriorityConcernTiming(decision, choiceTurn) {
    const considerations = decision.decision_overview?.patient_considerations || {};
    const items = [];
    (considerations.questions || []).forEach(question => {
        const expressed = firstItemTurn(question);
        if (expressed == null) return;
        items.push({ expressed, addressed: answerTurn(question) });
    });
    [...(considerations.preferences || []), ...(considerations.goals_priorities || [])].forEach(item => {
        const expressed = firstItemTurn(item);
        if (expressed == null || (item?.response_status == null && item?.response_turn_indices == null)) return;
        items.push({ expressed, addressed: answerTurn(item) });
    });
    if (!items.length) return null;
    const hit = (priority, type, text) => ({ rule: 3, priority, type, text });
    if (items.some(item => item.expressed < choiceTurn && item.addressed == null)) {
        return hit('High', 'Patient priority or concern not subsequently addressed', 'A patient priority or concern was raised before selection and was not subsequently addressed.');
    }
    if (items.some(item => item.expressed < choiceTurn && item.addressed != null && item.addressed >= choiceTurn)) {
        return hit('Medium', 'Patient priority or concern addressed after treatment selection', 'A patient priority or concern was raised before selection and addressed only afterward.');
    }
    if (items.some(item => item.expressed >= choiceTurn && item.addressed == null)) {
        return hit('Medium', 'Patient priority or concern not subsequently addressed', 'A patient priority or concern was raised after selection and was not subsequently addressed.');
    }
    return null;
}

function detectNewInfoAfterSelection(decision, choiceTurn) {
    const options = decision?.decision_overview?.options_considered || [];
    const chosen = options.find(option => optionIsChosen(decision, option.option_name))
        || options.find(option => optionIsChosen(decision, decision.selected_intervention));
    const benefitBurdenAfter = chosen
        && (discussedOnlyAfter(chosen.benefits, choiceTurn) || discussedOnlyAfter(chosen.burdens, choiceTurn));
    const newCore = coreRisks(decision).filter(risk => {
        if (risk.detection_status !== 'Discussed') return false;
        const turns = turnList(risk);
        return turns.length && Math.min(...turns) >= choiceTurn;
    });
    if (benefitBurdenAfter || newCore.length >= 2) {
        return {
            rule: 4,
            priority: 'High',
            type: 'New decision information introduced after treatment selection',
            text: benefitBurdenAfter
                ? 'A benefit or burden of the selected option was first recorded after selection.'
                : 'Two or more core risks of the selected option were first recorded after selection.',
        };
    }
    if (newCore.length === 1) {
        return {
            rule: 4,
            priority: 'Medium',
            type: 'New decision information introduced after treatment selection',
            text: 'A core risk of the selected option was first recorded after selection.',
        };
    }
    return null;
}

function communicationHits(decision) {
    if (!decision) return [];
    const hits = [];
    const choiceTurn = choiceTurnOn(decision);
    const choiceStatus = decision.pipeline_status?.pass_c2;
    const choiceScored = choiceTurn != null && choiceStatus !== 'no_choice' && choiceStatus !== 'failed';
    if (choiceScored) {
        [detectAltWithoutOutcome, detectNoPreferenceBeforeSelection, detectPriorityConcernTiming, detectNewInfoAfterSelection]
            .forEach(detect => {
                const hit = detect(decision, choiceTurn);
                if (hit) hits.push(hit);
            });
    }
    const missing = detectMissingCoreRiskHit(decision, coreRisks(decision));
    if (missing) hits.push(missing);
    const order = { 1: 0, 3: 1, 4: 2, 5: 3, 2: 4 };
    return hits.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === 'High' ? -1 : 1;
        return (order[a.rule] ?? 9) - (order[b.rule] ?? 9);
    });
}

function renderCockpit(decision) {
    const idn = identity(episodeKey || decision?.decision_id || 'episode');
    const summary = decision?.generative_layer?.decision_summary
        || decision?.decision_label
        || 'No decision summary for this run.';
    const fact = (label, value) => `<p class="md-typescale-label-medium">${esc(label)}</p><p class="md-typescale-title-medium">${esc(value)}</p>`;
    const decisions = payload.decisions.length > 1
        ? `<md-chip-set id="decisionFilters" aria-label="Decisions">${payload.decisions.map(item =>
            `<md-filter-chip label="${esc(item.decision_label || 'Decision')}" data-decision="${esc(item.decision_id)}" ${item.decision_id === decision?.decision_id ? 'selected' : ''}></md-filter-chip>`
        ).join('')}</md-chip-set>`
        : '';
    const hits = communicationHits(decision);
    const opportunities = hits.length ? `<section class="opportunities" aria-label="Communication opportunities">
        <h2 class="md-typescale-headline-small">Communication opportunities</h2>
        <div class="opportunity-row">${hits.map(hit => `<article class="card">
            <h3 class="md-typescale-title-small">${esc(hit.type)}</h3>
            <p class="md-typescale-body-medium">${esc(hit.text)}</p>
            ${hit.rule === 5 ? '<div class="actions"><md-filled-button id="reviewRisks">Review missing risks</md-filled-button></div>' : ''}
        </article>`).join('')}</div>
    </section>` : '';
    const legend = COLUMNS.map(col =>
        `<span class="md-typescale-label-medium"><i class="map-swatch" style="background:var(--app-map-${col.key})"></i>${esc(col.label)}</span>`
    ).join('');
    const riskChip = risk => {
        const status = risk.detection_status || 'Not assessed';
        const gap = status !== 'Discussed';
        const icon = status === 'Discussed' ? 'check_circle' : status === 'Not detected' ? 'error' : 'help';
        const on = state.riskName === risk.risk_name;
        const name = risk.risk_name || 'Unnamed risk';
        return `<button type="button" class="risk-chip${gap ? ' is-gap' : ''}${on ? ' is-selected' : ''}" data-risk="${esc(name)}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${esc(`${name}, ${status}`)}">
            <md-icon aria-hidden="true">${icon}</md-icon>
            <span class="md-typescale-label-medium">${esc(name)}</span>
        </button>`;
    };
    const riskList = coreRisks(decision);
    const observedRisks = riskList.filter(risk => risk.detection_status === 'Discussed');
    const missingRisks = riskList.filter(risk => risk.detection_status !== 'Discussed');
    const riskGroup = (label, items, tone) => items.length
        ? `<div class="risk-group ${tone}" style="flex-grow: ${items.length}"><h2 class="md-typescale-title-small">${label}</h2><div class="risk-names">${items.map(riskChip).join('')}</div></div>`
        : '';
    const risks = observedRisks.length || missingRisks.length
        ? `${riskGroup('Core risks observed', observedRisks, 'is-observed')}${riskGroup('Core risks not observed', missingRisks, 'is-missing')}`
        : '<div class="risk-names"><span class="risk-chip is-note"><span class="md-typescale-label-medium">No core risks on this decision.</span></span></div>';
    const transcriptRows = payload.turns.map(turn => {
        const side = speakerSide(turn.speaker_line);
        const selected = state.turn === Number(turn.index);
        const who = String(turn.speaker_line || '').trim() || (side === 'patient' ? 'Patient' : side === 'clinician' ? 'Clinician' : 'Note');
        return `<button type="button" class="turn-line" data-turn="${Number(turn.index)}">
            <span class="turn-index">${Number(turn.index)}</span>
            <span class="turn-speaker">${speakerIcon(side, selected)}<span class="turn-who md-typescale-label-small">${esc(who)}</span></span>
            <span class="turn-text md-typescale-body-medium">${esc(turnBody(turn) || ' ')}</span>
        </button>`;
    }).join('');
    return `<div class="stack">
        <div class="top-band">
            <section class="identity" aria-label="Episode">
                <div>${fact('Clinician', idn.clinician)}${fact('Patient', idn.patient)}</div>
                <div>${fact('Start date', idn.startDate)}${fact('End date', idn.endDate)}</div>
                <div class="identity-mrn">${fact('Medical record number', idn.mrn)}</div>
            </section>
            <div class="summary-col">
                ${card(decision?.decision_label || 'Decision', summary, '', String(decision?.selected_option || '').trim() ? `<p class="summary-selected md-typescale-label-large">Option selected · ${esc(decision.selected_option)}</p>` : '')}
            </div>
        </div>
        ${decisions}
        <div class="map-head">
            <div class="map-legend" aria-label="Map legend">${legend}</div>
        </div>
        <div class="workspace">
            <section class="map-pane" aria-label="Behavior map">
                <div id="episodeMap">${renderTickGrid(decision)}</div>
            </section>
            <aside class="transcript-pane" aria-label="Transcript">
                <div class="transcript-head">
                    <section id="coreRisks" class="risk-groups" aria-label="Core risks">
                        ${risks || '<p class="md-typescale-body-medium">No core risks on this decision.</p>'}
                    </section>
                </div>
                <div class="transcript-scroll">
                    <div id="transcriptList">${transcriptRows || '<p class="md-typescale-body-medium">This run has no turns.</p>'}</div>
                </div>
            </aside>
        </div>
        ${opportunities}
    </div>`;
}

function render() {
    const decision = currentDecision();
    const main = document.getElementById('main');
    if (!main) return;
    const kept = document.querySelector('.transcript-scroll')?.scrollTop || 0;
    main.innerHTML = renderCockpit(decision);
    const pane = document.querySelector('.transcript-scroll');
    if (pane) pane.scrollTop = kept;
    bindMain(main);
    alignSpeakerColumn();
    document.fonts?.ready.then(alignSpeakerColumn);
    requestAnimationFrame(() => {
        if (!document.getElementById('episodeMap')) return;
        repaintMap();
        if (state.turn != null) scrollTranscript(state.turn);
    });
}

function alignSpeakerColumn() {
    const list = document.getElementById('transcriptList');
    const labels = [...document.querySelectorAll('#transcriptList .turn-who')];
    if (!list || !labels.length) return;
    const width = Math.ceil(Math.max(...labels.map(label => {
        const probe = label.cloneNode(true);
        probe.style.cssText = 'position:absolute;visibility:hidden;width:max-content;white-space:nowrap;';
        label.parentElement.appendChild(probe);
        const size = probe.getBoundingClientRect().width;
        probe.remove();
        return size;
    })));
    list.style.setProperty('--speaker-width', `${width}px`);
}

function clearSelection() {
    state.turn = null;
    state.behaviorKey = null;
    state.eventId = null;
    state.riskName = null;
}

function applySelection(event) {
    const restoreFocus = !!document.activeElement?.closest?.('.map-pane');
    if (!event) clearSelection();
    else {
        state.turn = event.turn;
        state.behaviorKey = event.key;
        state.eventId = event.id;
        state.riskName = event.riskName || null;
    }
    repaintMap();
    refreshSelection();
    if (restoreFocus && state.eventId) {
        document.querySelector(`.tick-mark[data-id="${CSS.escape(state.eventId)}"]`)?.focus();
    }
}

function repaintMap() {
    const map = document.getElementById('episodeMap');
    if (map) map.innerHTML = renderTickGrid(currentDecision());
    document.querySelectorAll('.risk-chip').forEach(chip => {
        const on = chip.dataset.risk === state.riskName;
        chip.classList.toggle('is-selected', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
}

function bindMain(main) {
    main.querySelector('#reviewRisks')?.addEventListener('click', () => {
        const missing = coreRisks(currentDecision()).find(risk => risk.detection_status === 'Not detected');
        document.getElementById('coreRisks')?.scrollIntoView({ block: 'nearest' });
        if (!missing) return;
        const match = mapEvents(currentDecision()).find(event => event.riskName === missing.risk_name && !event.patient);
        if (match) applySelection(match);
        else {
            clearSelection();
            state.riskName = missing.risk_name;
            repaintMap();
            refreshSelection();
        }
    });
    main.querySelector('#decisionFilters')?.addEventListener('click', event => {
        const chip = event.target.closest('md-filter-chip');
        if (!chip?.dataset.decision || chip.dataset.decision === state.decisionId) return;
        state.decisionId = chip.dataset.decision;
        clearSelection();
        render();
    });
    main.querySelector('#coreRisks')?.addEventListener('click', event => {
        const chip = event.target.closest('.risk-chip');
        if (!chip) return;
        const name = chip.dataset.risk;
        const events = mapEvents(currentDecision()).filter(item => item.riskName === name);
        const match = events.find(item => !item.patient) || events[0];
        if (match) applySelection(match);
        else {
            clearSelection();
            state.riskName = name;
            repaintMap();
            refreshSelection();
        }
    });
    main.querySelector('.map-pane')?.addEventListener('click', event => {
        const mark = event.target.closest('.tick-mark');
        if (mark) {
            const match = mapEvents(currentDecision()).find(item => item.id === mark.dataset.id);
            if (match) applySelection(match);
            return;
        }
        const row = event.target.closest('.tick-row');
        if (!row) return;
        clearSelection();
        state.turn = Number(row.dataset.turn);
        repaintMap();
        refreshSelection();
    });
    main.querySelector('.map-pane')?.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const mark = event.target.closest('.tick-mark');
        if (!mark) return;
        event.preventDefault();
        const match = mapEvents(currentDecision()).find(item => item.id === mark.dataset.id);
        if (match) applySelection(match);
    });
    main.querySelector('#transcriptList')?.addEventListener('click', event => {
        const item = event.target.closest('.turn-line[data-turn]');
        if (!item) return;
        const turn = Number(item.dataset.turn);
        const events = mapEvents(currentDecision()).filter(entry => entry.turn === turn);
        const match = events.find(entry => !entry.isAnswer) || events[0];
        if (match) applySelection(match);
        else {
            clearSelection();
            state.turn = turn;
            repaintMap();
            refreshSelection();
        }
    });
}

function refreshSelection() {
    document.querySelectorAll('#transcriptList .turn-line[data-turn]').forEach(item => {
        const on = Number(item.dataset.turn) === state.turn;
        item.querySelector('md-icon')?.classList.toggle('filled', on);
    });
    scrollTranscript(state.turn);
}

function scrollTranscript(index) {
    const pane = document.querySelector('.transcript-scroll');
    const item = document.querySelector(`#transcriptList .turn-line[data-turn="${index}"]`);
    if (!pane || !item) return;
    const paneTop = pane.getBoundingClientRect().top;
    const itemTop = item.getBoundingClientRect().top;
    pane.scrollTop += itemTop - paneTop - pane.clientHeight / 2 + item.clientHeight / 2;
}

let resizeTimer = 0;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (document.getElementById('episodeMap')) repaintMap();
    }, 150);
});

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
}

let episodeKey = '';

function requestedEpisode() {
    const params = new URLSearchParams(location.search);
    const episode = params.get('episode');
    if (episode) return episode;
    const run = document.body.dataset.run || params.get('run') || '';
    return run ? `run_${run}` : '';
}

async function load() {
    episodeKey = requestedEpisode();
    const bar = document.getElementById('loading');
    if (!episodeKey) {
        if (bar) bar.hidden = true;
        document.getElementById('main').innerHTML = card('Choose a saved run', 'Pick a run from the styles page to open this cockpit.');
        return;
    }
    const response = await fetch(`/api/department/episode/${encodeURIComponent(episodeKey)}`);
    if (!response.ok) throw new Error('This run could not be opened.');
    const data = await response.json();
    payload = { decisions: decisionsFrom(data.regions), turns: data.turns || [] };
    state.decisionId = payload.decisions[0]?.decision_id || null;
    if (bar) bar.hidden = true;
    render();
}

const stored = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(stored || (prefersDark ? 'dark' : 'light'));
window.addEventListener('storage', event => {
    if (event.key === THEME_KEY && event.newValue) applyTheme(event.newValue);
});
window.addEventListener('message', event => {
    if (event.origin !== location.origin) return;
    if (event.data?.type === 'v2-theme') applyTheme(event.data.theme);
});

load().catch(error => {
    const bar = document.getElementById('loading');
    if (bar) bar.hidden = true;
    document.getElementById('main').innerHTML = `<article class="card"><h2 class="md-typescale-title-medium">Could not open this run</h2><p class="md-typescale-body-medium">${esc(error.message)}</p></article>`;
});
