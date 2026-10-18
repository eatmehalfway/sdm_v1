function escHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function escAttr(str) { return escHtml(str); }
function parkInlineEpisodeSlot() {}
function restoreInlineEpisodeIfOpen() {}
function showSpinePeek() {}
function hideSpinePeek() {}
function closeEpisodeOverlay() { window.v2CloseCockpit?.(); }
function openEpisodeOverlay(episodeId) { window.v2OpenCockpit?.(episodeId); }
let spinePeekTimer = null;
let CURRENT_REGIONS = null;

let DEPARTMENT_EPISODES = [];
let DEPARTMENT_CLINICIANS = [];
let DEPARTMENT_DATA = {};
let DEPARTMENT_PROCEDURE_DATA = { risk_categories: [], framing_scores: [] };
let COMPLETENESS_THRESHOLD = 0;
let SELECTED_PROCEDURES = new Set();
let PROCEDURE_DROPDOWN_OPEN = false;
let SANKEY_FOCUS_PROCEDURE = null;
// True until the user explicitly picks a "View" procedure — while true, the
// focus is recomputed from whatever episodes are currently eligible (so it
// tracks the top procedure/date filters instead of getting stuck on
// whichever procedure happened to be auto-picked before those filters changed).
let SANKEY_FOCUS_IS_AUTO = true;
let SANKEY_COMPARE_SCOPE = 'all';
let RISK_BUBBLE_Y_METRIC = 'procedure_variation';
const DEMO_PAGE = document.body?.dataset?.demoPage === 'true';
const COMPARE_PAGE = document.body?.dataset?.comparePage === 'true';
let COMPARE_VIEWS = {};
let GEMINI_RAW = [];
let JEV_RAW = [];
const DEMO_PROCEDURES = [
    'Lumbar laminectomy',
    'Lumbar decompression with possible fusion',
    'Lumbar microdiscectomy',
    'Cervical spinal fusion',
    'Posterior cervical decompression',
    'Spinal cord stimulator implant',
];
const DEMO_PROCEDURE_LABELS = {
    'Lumbar laminectomy': 'Lumbar decompression (no fusion planned)',
    'Lumbar decompression with possible fusion': 'Lumbar decompression ± fusion',
    'Lumbar microdiscectomy': 'Lumbar microdiscectomy',
    'Cervical spinal fusion': 'Anterior cervical discectomy and fusion (ACDF)',
    'Posterior cervical decompression': 'Posterior cervical decompression',
    'Spinal cord stimulator implant': 'Spinal cord stimulator implantation',
};
if (DEMO_PAGE) RISK_BUBBLE_Y_METRIC = 'procedure_variation';

function demoProcedureLabel(name) {
    if (!DEMO_PAGE) return name;
    return DEMO_PROCEDURE_LABELS[name] || name;
}

function isDemoProcedure(name) {
    const needle = String(name || '').toLowerCase();
    return DEMO_PROCEDURES.some(p => p.toLowerCase() === needle);
}

function isSavedRunIntervention(name) {
    const text = String(name || '');
    return /\bECT\b|electroconvulsive/i.test(text) || /lumbar/i.test(text);
}

function procedureTabList() {
    if (DEMO_PAGE) return DEMO_PROCEDURES.slice();
    return [...new Set(DEPARTMENT_EPISODES.map(e => e.procedure).filter(Boolean))]
        .filter(name => !isSavedRunIntervention(name))
        .sort();
}
function plotColor(role) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--md-sys-color-${role}`).trim();
    return value || 'currentColor';
}

function magentaByRate(rate) {
    const t = Math.max(0, Math.min(1, Number(rate) / 100));
    if (typeof d3 === 'undefined') return plotColor('tertiary');
    return d3.interpolateRgb(plotColor('tertiary-container'), plotColor('tertiary'))(t);
}
let DATE_RANGE_DAYS = DEMO_PAGE ? 90 : null;
let BOX_PLOT_EPISODES = [];
let BOX_PLOT_CLINICIANS = [];
let EPISODE_TABLE_SORT = 'core_risk';
let CURRENT_EPISODE_META = null;
let IGNORE_BUBBLE_BG_CLICK = false;

// Single navigation state for the persistent map. Every click writes here;
// navGoTo() is the only dispatcher.
let NAV = {
    grouping: 'all',
    clinicianId: null,
    procedure: null,
    bubbleCategory: null,
    bubbleSubGroup: null,
    isolateSource: null,
    boxCategory: null,
    boxClinicianId: null,
    episodeId: null,
    decisionId: null,
    optionName: null,
    dataSource: 'all',
    overlayOpen: false,
    runPanelOpen: false,
    episodeAnchor: null
};

function mapMode() {
    return RISK_BUBBLE_Y_METRIC === 'clinician_variation' ? 'clinician' : 'procedure';
}

function bubbleSplitBy() {
    return mapMode();
}

// Top unique-selector isolate. Independent from bubble-category zoom and
// from box-plot drill. When this is set the map is already terminal — a
// bubble click should open episodes, not expand another split.
function mapIsolate() {
    if (mapMode() === 'clinician' && NAV.clinicianId) {
        return { kind: 'clinician', id: NAV.clinicianId, label: clinicianName(NAV.clinicianId) };
    }
    if (mapMode() === 'procedure' && NAV.procedure) {
        return { kind: 'procedure', id: NAV.procedure, label: NAV.procedure };
    }
    return null;
}

function syncMapGrouping() {
    if (NAV.clinicianId) NAV.grouping = 'clinician';
    else if (NAV.procedure) NAV.grouping = 'procedure';
    else NAV.grouping = 'all';
}

function setMapIsolate(kind, id, source) {
    if (kind === 'clinician') {
        NAV.clinicianId = id || null;
        if (id) NAV.procedure = null;
    } else {
        NAV.procedure = id || null;
        if (id) {
            NAV.clinicianId = null;
            SANKEY_FOCUS_PROCEDURE = id;
            SANKEY_FOCUS_IS_AUTO = false;
        } else {
            SANKEY_FOCUS_IS_AUTO = true;
        }
    }
    NAV.bubbleSubGroup = null;
    NAV.isolateSource = id ? (source || 'chip') : null;
    syncMapGrouping();
}

function clinicianName(id) {
    return DEPARTMENT_CLINICIANS.find(c => c.id === id)?.name || id;
}

function navCrumbs() {
    const crumbs = [{ label: 'Department', kind: 'department', param: '' }];
    if (NAV.grouping === 'clinician' && NAV.clinicianId) {
        crumbs.push({ label: clinicianName(NAV.clinicianId), kind: 'clinician', param: NAV.clinicianId });
    } else if (NAV.grouping === 'procedure' && NAV.procedure) {
        crumbs.push({ label: NAV.procedure, kind: 'procedure', param: NAV.procedure });
    }
    if (NAV.bubbleCategory) {
        crumbs.push({ label: NAV.bubbleCategory, kind: 'bubble-category', param: NAV.bubbleCategory });
        if (NAV.bubbleSubGroup) {
            crumbs.push({
                label: bubbleSubGroupLabel(NAV.bubbleCategory, NAV.bubbleSubGroup),
                kind: 'bubble-subgroup',
                param: NAV.bubbleSubGroup
            });
        }
    }
    if (NAV.boxCategory && NAV.boxClinicianId) {
        crumbs.push({
            label: `${clinicianName(NAV.boxClinicianId)} — ${NAV.boxCategory}`,
            kind: 'box',
            param: `${NAV.boxCategory}|||${NAV.boxClinicianId}`
        });
    }
    if (NAV.episodeId && (CURRENT_EPISODE_META || NAV.episodeId)) {
        crumbs.push({
            label: CURRENT_EPISODE_META?.patient_label || NAV.episodeId,
            kind: 'episode',
            param: NAV.episodeId
        });
    }
    if (NAV.episodeId && NAV.decisionId && CURRENT_REGIONS) {
        const dec = CURRENT_REGIONS.find(r => r.decision_id === NAV.decisionId);
        if (dec) crumbs.push({ label: dec.decision_label, kind: 'decision', param: NAV.decisionId });
    }
    if (NAV.episodeId && NAV.optionName) {
        crumbs.push({ label: NAV.optionName, kind: 'option', param: NAV.optionName });
    }
    return crumbs;
}

function renderGlobalBreadcrumb() {
    const el = document.getElementById('globalBreadcrumb');
    if (el) el.innerHTML = renderBreadcrumbTrail(navCrumbs());
}

function applyDetailLayout() {
    const container = document.getElementById('appContainer');
    if (container) container.classList.toggle('is-detail', !!NAV.overlayOpen);
}

function navGoTo(kind, param) {
    if (kind === 'department') {
        NAV.grouping = 'all';
        NAV.clinicianId = null;
        NAV.procedure = null;
        NAV.bubbleCategory = null;
        NAV.bubbleSubGroup = null;
        NAV.isolateSource = null;
        NAV.boxCategory = null;
        NAV.boxClinicianId = null;
        NAV.episodeId = null;
        NAV.decisionId = null;
        NAV.optionName = null;
        closeEpisodeOverlay();
        refreshDepartmentDashboard();
        return;
    }
    if (kind === 'clinician') {
        setMapIsolate('clinician', NAV.clinicianId === param ? null : param, 'chip');
        closeEpisodeOverlay();
        refreshDepartmentDashboard();
        return;
    }
    if (kind === 'procedure') {
        setMapIsolate('procedure', NAV.procedure === param ? null : param, 'chip');
        closeEpisodeOverlay();
        refreshDepartmentDashboard();
        return;
    }
    if (kind === 'bubble-category') {
        NAV.bubbleCategory = NAV.bubbleCategory === param ? null : param;
        NAV.bubbleSubGroup = null;
        renderRiskGapBubbleChart();
        renderGlobalBreadcrumb();
        return;
    }
    if (kind === 'bubble-subgroup') {
        NAV.bubbleSubGroup = NAV.bubbleSubGroup === param ? null : param;
        renderRiskGapBubbleChart();
        renderGlobalBreadcrumb();
        return;
    }
    if (kind === 'box') {
        const [category, clinicianId] = String(param || '').split('|||');
        const same = NAV.boxCategory === category && NAV.boxClinicianId === clinicianId;
        if (same && NAV.boxCategory) {
            NAV.boxCategory = null;
            NAV.boxClinicianId = null;
        } else {
            NAV.boxCategory = category;
            NAV.boxClinicianId = clinicianId;
        }
        renderBoxPlot(baseFilteredEpisodes(), DEPARTMENT_CLINICIANS, NAV.clinicianId);
        renderGlobalBreadcrumb();
        return;
    }
    if (kind === 'episode') {
        openEpisodeOverlay(param);
        return;
    }
    if (kind === 'decision') {
        NAV.optionName = null;
        selectDecision(param);
        return;
    }
    if (kind === 'option') {
        NAV.optionName = param;
        renderGlobalBreadcrumb();
        if (CURRENT_REGIONS && CURRENT_TURNS) renderUI(CURRENT_REGIONS, CURRENT_TURNS, CURRENT_SCHEMA_VERSION, { keepSpine: true });
        return;
    }
    if (kind === 'data-source') {
        NAV.dataSource = param || 'all';
        closeEpisodeOverlay();
        refreshDepartmentDashboard();
        return;
    }
    if (kind === 'tile') {
        const el = document.getElementById(param);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
}
function setDepartmentSubview(view) { /* retired: grouping is driven by NAV */ }

function withinDateRange(ep) {
    if (!DATE_RANGE_DAYS || !ep.episode_date) return true;
    const days = (Date.now() - new Date(ep.episode_date).getTime()) / 86400000;
    return days <= DATE_RANGE_DAYS;
}

function matchesDataSource(ep) {
    if (NAV.dataSource === 'demo') return ep.source === 'demo';
    if (NAV.dataSource === 'saved') return ep.source === 'db';
    return true;
}

function passesListFilters(ep) {
    return (ep.completeness_pct ?? 100) >= COMPLETENESS_THRESHOLD
        && (!DEMO_PAGE || ep.source === 'db' || isDemoProcedure(ep.procedure))
        && (!SELECTED_PROCEDURES.size || SELECTED_PROCEDURES.has(ep.procedure))
        && withinDateRange(ep)
        && matchesDataSource(ep);
}

function scopeFilteredEpisodes() {
    return DEPARTMENT_EPISODES
        .filter(ep => ep.has_index_decision)
        .filter(ep => NAV.dataSource === 'saved' || ep.source !== 'db')
        .filter(passesListFilters);
}

function listEpisodes() {
    return DEPARTMENT_EPISODES
        .filter(ep => ep.source === 'db' || ep.has_index_decision)
        .filter(passesListFilters)
        .filter(ep => !NAV.clinicianId || ep.clinician_id === NAV.clinicianId);
}

function baseFilteredEpisodes() {
    const isolate = mapIsolate();
    const scope = scopeFilteredEpisodes();
    if (isolate?.kind === 'procedure') return scope.filter(ep => ep.procedure === isolate.id);
    return scope;
}

function setDateRange(value) {
    DATE_RANGE_DAYS = value === 'all' ? null : Number(value);
    refreshDepartmentDashboard();
}

function setDataSource(value) {
    navGoTo('data-source', value);
}

function filteredDepartmentEpisodes() {
    const base = baseFilteredEpisodes();
    return NAV.clinicianId ? base.filter(ep => ep.clinician_id === NAV.clinicianId) : base;
}

function setCompletenessThreshold(value) {
    COMPLETENESS_THRESHOLD = Number(value);
    const label = document.getElementById('completenessSliderValue');
    if (label) label.textContent = COMPLETENESS_THRESHOLD;
    refreshDepartmentDashboard();
}

function toggleClinicianFilter(id) {
    navGoTo('clinician', id);
}

function toggleProcedureFilter(name) {
    if (SELECTED_PROCEDURES.has(name)) SELECTED_PROCEDURES.delete(name);
    else SELECTED_PROCEDURES.add(name);
    PROCEDURE_DROPDOWN_OPEN = true;
    if (SELECTED_PROCEDURES.size === 1) {
        NAV.procedure = [...SELECTED_PROCEDURES][0];
        NAV.grouping = 'procedure';
        NAV.clinicianId = null;
        SANKEY_FOCUS_PROCEDURE = NAV.procedure;
        SANKEY_FOCUS_IS_AUTO = false;
        syncMapGrouping();
    } else if (NAV.grouping === 'procedure' && (!NAV.procedure || !SELECTED_PROCEDURES.has(NAV.procedure))) {
        NAV.procedure = null;
        NAV.grouping = 'all';
        SANKEY_FOCUS_IS_AUTO = true;
    }
    refreshDepartmentDashboard();
}

function toggleProcedureDropdown() {
    PROCEDURE_DROPDOWN_OPEN = !PROCEDURE_DROPDOWN_OPEN;
    const el = document.getElementById('procedureFilterWrap');
    if (el) el.classList.toggle('open', PROCEDURE_DROPDOWN_OPEN);
}

function refreshDepartmentDashboard() {
    if (window.__v2PaintingPlots) {
        paintPlots();
        return;
    }
    if (typeof window.v2Rerender === 'function') window.v2Rerender();
    else paintPlots();
}

function paintPlots() {
    syncPlotPalette();
    const host = document.getElementById('plotHost');
    if (!host || !DEPARTMENT_DATA) return;
    const episodes = filteredDepartmentEpisodes();
    const base = baseFilteredEpisodes();
    const wrap = document.createElement('div');
    wrap.innerHTML = renderDepartmentShell(DEPARTMENT_DATA, episodes);
    host.replaceChildren();
    ['.map-mode-bar', '.legend-block', '.map-charts', '.analytics-grid'].forEach(sel => {
        wrap.querySelectorAll(sel).forEach(node => host.appendChild(node));
    });
    renderSankeyDelta(sankeyEligibleEpisodes());
    renderRiskGapBubbleChart();
    const framingScores = DEMO_PAGE
        ? (DEPARTMENT_PROCEDURE_DATA.framing_scores || [])
            .filter(row => isDemoProcedure(row.procedure))
            .sort((a, b) => DEMO_PROCEDURES.indexOf(a.procedure) - DEMO_PROCEDURES.indexOf(b.procedure))
        : (DEPARTMENT_PROCEDURE_DATA.framing_scores || []);
    renderFramingDotPlot(framingScores);
    renderBoxPlot(base, DEPARTMENT_CLINICIANS, NAV.clinicianId);
    bindEpisodePeeks();
}

function sankeyEligibleEpisodes() {
    return baseFilteredEpisodes();
}

function renderDepartmentShell(data, episodes) {
    const legend = (data.clinicians || []).map(c => {
        const selected = NAV.clinicianId === c.id ? 'selected' : '';
        return `<md-filter-chip data-group="legend-clinician" data-value="${escAttr(c.id)}" label="${escAttr(c.name)}" ${selected}></md-filter-chip>`;
    }).join('');
    const allProcedures = procedureTabList();
    const procedureLabel = SELECTED_PROCEDURES.size === 0
        ? 'All procedures'
        : (SELECTED_PROCEDURES.size === 1 ? [...SELECTED_PROCEDURES][0] : `${SELECTED_PROCEDURES.size} procedures selected`);
    const sortedEpisodes = episodes.slice().sort((a, b) => {
        if (EPISODE_TABLE_SORT === 'completeness') return (b.completeness_pct ?? 0) - (a.completeness_pct ?? 0);
        return (b.core_risk_pct ?? -1) - (a.core_risk_pct ?? -1);
    });
    const rows = sortedEpisodes.map(ep => `
        <tr class="decision-row episode-peek-row" onclick="openEpisodeFromRow(event,'${escAttr(ep.episode_id)}')"
            data-episode-id="${escAttr(ep.episode_id)}"
            data-peek-clinician="${escAttr(ep.clinician_name || '')}"
            data-peek-core="${ep.core_risk_pct == null ? 'N/A' : `${ep.core_risk_pct}%`}"
            data-peek-category="${escAttr(jitterCategory(ep) || 'N/A')}">
            <td><strong>${escHtml(ep.patient_label)}</strong>${ep.source === 'demo' ? ' <span class="badge">demo</span>' : ' <span class="badge" style="background:#2980b9;color:#fff;">saved</span>'}</td>
            <td><span style="color:${ep.clinician_color};font-weight:600;">${escHtml(ep.clinician_name)}</span></td>
            <td>${ep.core_risk_pct == null ? 'N/A' : `${ep.core_risk_pct}%`}</td>
            <td>${ep.completeness_pct ?? 100}% <small>(${ep.transcribed_encounters || 1}/${ep.total_encounters || 1})</small></td>
            <td style="font-size:0.85rem;">${escHtml(jitterCategory(ep) || 'N/A')}</td>
            <td class="status-${ep.status}">${escHtml(ep.status)}</td>
            <td class="view-link" data-episode-id="${escAttr(ep.episode_id)}">Open →</td>
        </tr>`).join('');
    const procedureTabs = allProcedures.map(p => {
        const cls = NAV.procedure ? (NAV.procedure === p ? 'is-active' : 'is-muted') : '';
        const label = demoProcedureLabel(p);
        return `<span class="${cls}" onclick="navGoTo('procedure','${escAttr(p)}')" title="Click to isolate ${escAttr(label)}">${escHtml(label)}</span>`;
    }).join('') || '<span style="color:var(--muted);">No procedures yet</span>';
    const episodeTable = `
    <h3 id="episode-table-heading">Episodes</h3>
    <div class="episode-table-wrap">
        <table class="history-table" style="margin-top:0;">
            <thead><tr><th>Episode</th><th>Clinician</th><th>Core risks %</th><th>Completeness</th><th>Discussion category</th><th>Status</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    </div>`;

    if (DEMO_PAGE) {
        return `
    <div class="demo-dept-title">
        <h2>Spinal center</h2>
        <select class="control-select demo-date-select" onchange="setDateRange(this.value)" title="Filter episodes by when they occurred">
            <option value="all" ${DATE_RANGE_DAYS === null ? 'selected' : ''}>All time</option>
            <option value="30" ${DATE_RANGE_DAYS === 30 ? 'selected' : ''}>Last 30 days</option>
            <option value="60" ${DATE_RANGE_DAYS === 60 ? 'selected' : ''}>Last 60 days</option>
            <option value="90" ${DATE_RANGE_DAYS === 90 ? 'selected' : ''}>Last 90 days</option>
        </select>
    </div>
    <div class="legend-block">
        <div class="legend-bar clinician-legend" aria-label="Filter charts by procedure">${procedureTabs}</div>
    </div>
    <div class="map-charts" data-mode="procedure">
        ${renderMapCharts()}
    </div>
    ${episodeTable}`;
    }

    return `
    <div class="dept-header">
        <div>
            <h2 style="margin:0;">${escHtml(data.department || 'Department')}</h2>
            <div class="dept-meta">${data.demo_count || 0} demo episodes · ${data.db_count || 0} saved analyses · one quality view across every clinician</div>
        </div>
        <button class="run-btn" type="button" onclick="loadDepartmentOverview()">Refresh</button>
    </div>
    <div class="summary-bar">
        <div class="summary-stat is-hero is-clickable" style="border-top-color:#e74c3c;" onclick="navGoTo('tile','risk-bubble-heading')"><div class="summary-stat-value" style="color:#e74c3c;">${avgCoreRisk(episodes)}</div><div class="summary-stat-label">Mean Core Risks Discussed</div></div>
        <div class="summary-stat is-secondary is-clickable" style="border-top-color:var(--success);" onclick="navGoTo('tile','flow-heading')"><div class="summary-stat-value" style="color:var(--success);">${pctMeaningful(episodes)}</div><div class="summary-stat-label">Meaningful Comparisons</div></div>
        <div class="summary-stat is-secondary is-clickable" onclick="jumpToEpisodeTable('completeness')"><div class="summary-stat-value">${avgCompleteness(episodes)}</div><div class="summary-stat-label">Avg. Transcript Completeness</div></div>
        <div class="summary-stat is-secondary is-clickable" onclick="navGoTo('tile','framing-dot-heading')"><div class="summary-stat-value">${recommendationExplainedPct(episodes)}</div><div class="summary-stat-label">Recommendations Explained</div></div>
        <div class="summary-stat is-secondary is-clickable" onclick="navGoTo('tile','questions-heading')"><div class="summary-stat-value">${questionsAnswered(episodes)}</div><div class="summary-stat-label">Questions Answered</div></div>
    </div>
    <div class="dept-controls-row">
        <select class="control-select" title="More departments coming soon"><option>${escHtml(data.department || 'Department')}</option></select>
        <div class="procedure-filter${PROCEDURE_DROPDOWN_OPEN ? ' open' : ''}" id="procedureFilterWrap">
            <button type="button" class="procedure-filter-btn" onclick="toggleProcedureDropdown()">${escHtml(procedureLabel)}</button>
            <div class="procedure-filter-panel">
                ${allProcedures.length ? allProcedures.map(p => `<label class="procedure-filter-option"><input type="checkbox" ${SELECTED_PROCEDURES.has(p) ? 'checked' : ''} onchange="toggleProcedureFilter('${escAttr(p)}')"> ${escHtml(p)}</label>`).join('') : '<span style="color:var(--muted);font-size:0.8rem;">No procedures yet</span>'}
            </div>
        </div>
        <select class="control-select" onchange="setDateRange(this.value)" title="Filter episodes by when they occurred">
            <option value="all" ${DATE_RANGE_DAYS === null ? 'selected' : ''}>All time</option>
            <option value="30" ${DATE_RANGE_DAYS === 30 ? 'selected' : ''}>Last 30 days</option>
            <option value="60" ${DATE_RANGE_DAYS === 60 ? 'selected' : ''}>Last 60 days</option>
            <option value="90" ${DATE_RANGE_DAYS === 90 ? 'selected' : ''}>Last 90 days</option>
        </select>
        <select class="control-select" onchange="setDataSource(this.value)" title="Filter by data source">
            <option value="all" ${NAV.dataSource === 'all' ? 'selected' : ''}>All sources</option>
            <option value="demo" ${NAV.dataSource === 'demo' ? 'selected' : ''}>Demo</option>
            <option value="saved" ${NAV.dataSource === 'saved' ? 'selected' : ''}>Saved runs</option>
        </select>
        <div class="dept-stats-inline">${episodes.length} episode${episodes.length === 1 ? '' : 's'} shown · ${(data.clinicians || []).length} clinician${(data.clinicians || []).length === 1 ? '' : 's'}</div>
    </div>
    <div class="map-mode-bar">
        <span class="chart-control-label">Compare variation</span>
        <div class="axis-toggle">
            <button type="button" class="${RISK_BUBBLE_Y_METRIC === 'procedure_variation' ? 'active' : ''}" onclick="setRiskBubbleYMetric('procedure_variation')">Intervention variation</button>
            <button type="button" class="${RISK_BUBBLE_Y_METRIC === 'clinician_variation' ? 'active' : ''}" onclick="setRiskBubbleYMetric('clinician_variation')">Clinician variation</button>
        </div>
        <button type="button" class="info-icon" data-action="new-analysis" data-tip="${RISK_BUBBLE_Y_METRIC === 'procedure_variation'
            ? 'Intervention mode: episode flow, framing, and risk bubbles split by intervention. Use the Intervention filter above to isolate one intervention across the map.'
            : 'Clinician mode: risk bubbles split by clinician, with the quality map below. Use the clinician filter below to isolate someone across that map.'}">i</button>
    </div>
    ${RISK_BUBBLE_Y_METRIC === 'clinician_variation' ? `
    <div class="legend-block">
        <div class="filter-row">
            <h2 class="md-typescale-label-large">Filter by clinician</h2>
            <span class="info-icon" tabindex="0" data-tip="This is the master filter for the clinician quality map below. Click a name to isolate that clinician — other clinicians stay visible but dimmed in the box plot. Click again to clear.">i</span>
            <md-chip-set aria-label="Filter box plot and charts by clinician">${legend}</md-chip-set>
        </div>
    </div>` : ''}
    <div class="map-charts" data-mode="${escAttr(mapMode())}">
        ${renderMapCharts()}
    </div>
    <div class="analytics-grid">
        <div class="analytics-card">
            <p class="section-kicker">Risk follow-up</p>
            <div class="chart-heading-row"><h3 class="chart-heading" style="font-size:1.05rem;">Most Frequent Core Risks Not Discussed</h3><span class="info-icon" tabindex="0" data-tip="Core risks — the risks every patient should hear about for their chosen intervention — ranked by how often they were skipped across the episodes currently shown.">i</span></div>
            ${renderRiskFrequencyChart(data.risk_frequency || [], episodes)}
        </div>
        <div class="analytics-card" id="questions-heading">
            <p class="section-kicker">Patient voice</p>
            <div class="chart-heading-row"><h3 class="chart-heading" style="font-size:1.05rem;">Common Patient Questions & Concerns</h3><span class="info-icon" tabindex="0" data-tip="Patient questions from the transcript, grouped into topics by keyword. Longer bars mean that topic came up more often across the episodes currently shown.">i</span></div>
            ${renderQuestionRollup(data.question_rollup || [], episodes)}
        </div>
    </div>
    ${episodeTable}`;
}

function jumpToEpisodeTable(sort) {
    EPISODE_TABLE_SORT = sort || 'core_risk';
    refreshDepartmentDashboard();
    requestAnimationFrame(() => {
        const el = document.getElementById('episode-table-heading');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

function renderMapCharts() {
    const flowSection = `
        <section class="story-step is-procedure-only" aria-labelledby="flow-heading">
            <div class="analytics-card">
                <div class="flow-stage">
                    <div class="flow-caption">
                        <p class="section-kicker">Alternatives discussion flow</p>
                        <div class="chart-heading-row">
                            <h3 class="chart-heading" id="flow-heading">${DEMO_PAGE ? 'Episode flow' : 'Whether alternatives to the proposed intervention were presented and how they were compared'}</h3>
                            <span class="info-icon" tabindex="0" data-tip="Follows one intervention's episodes from left to right: whether a single option was presented, and if alternatives came up, how thoroughly they were compared.">i</span>
                        </div>
                        ${DEMO_PAGE
                            ? '<p class="demo-chart-desc">Whether alternatives to the proposed intervention were presented and how they were compared</p>'
                            : '<p class="jitter-hint">Pick an intervention to trace.</p>'}
                        <div class="chart-controls-row" id="sankeyControls"></div>
                    </div>
                    <div id="sankeyPlot"></div>
                </div>
            </div>
        </section>`;
    const bubbleSection = `
        <section class="story-step" aria-labelledby="risk-bubble-heading">
            <div class="analytics-card">
                <p class="section-kicker">Risk discussion coverage</p>
                <div class="chart-heading-row">
                    <h3 class="chart-heading" id="risk-bubble-heading">${DEMO_PAGE ? 'How often risk categories are not discussed' : 'How often risk categories are not discussed'}</h3>
                    <span class="info-icon" tabindex="0" data-tip="Each bubble is a core-risk category. Horizontal position = how often it's missed across applicable episodes. Vertical position = how much interventions (or clinicians, via the Compare variation toggle above) vary in how often they miss it. Bubble size = number of applicable episodes. If an intervention or clinician is already selected above, click a bubble to see those episodes. Otherwise click a bubble to split it, then click a sub-bubble — or click empty space to contract.">i</span>
                </div>
                <p class="jitter-hint">Click any bubble to split by ${bubbleSplitBy() === 'procedure' ? 'intervention' : 'clinician'}.</p>
                <div class="chart-controls-row" id="riskBubbleControls"></div>
                <div id="riskBubbleLegend"></div>
                <div id="riskBubblePlot"></div>
                <div id="riskBubbleZoomPanel"></div>
            </div>
        </section>`;
    const framingSection = `
        <section class="story-step is-procedure-only" aria-labelledby="framing-dot-heading">
            <div class="analytics-card">
                <p class="section-kicker">Alternatives discussion comparison</p>
                <div class="chart-heading-row">
                    <h3 class="chart-heading" id="framing-dot-heading">${DEMO_PAGE ? 'How discussion of alternatives varies across procedures' : 'How discussion of alternatives varies across procedures'}</h3>
                    <span class="info-icon" tabindex="0" data-tip="Ordinal win-rate vs. peer interventions (50% = typical), with a 95% bootstrap confidence interval. This is descriptive only — it does not imply that more comparative framing is always more clinically appropriate.">i</span>
                </div>
                <div id="framingDotPlot"></div>
            </div>
        </section>`;
    const clinicianSection = `
        <section class="story-step is-clinician-only" aria-labelledby="quality-map-heading">
            <div class="jitter-wrap">
                <p class="section-kicker">Secondary analysis</p>
                <div class="chart-heading-row">
                    <h3 class="chart-heading" id="quality-map-heading">Communication Quality by Clinician</h3>
                    <span class="info-icon" tabindex="0" data-tip="Each box summarizes one clinician's episodes in one discussion category: the line is the median % of core risks discussed, the box spans the middle 50% of episodes (IQR), and the whiskers extend to the most typical range. Dots beyond the whiskers are outlier episodes. n= is the number of episodes behind that box.">i</span>
                </div>
                <p class="jitter-hint">Every clinician's distribution is shown side by side in each category lane. The filter above dims other clinicians without removing them. Click a box to see its episodes — that drill-in is separate from the filter, and deselecting the box restores full visibility.</p>
                <div class="plot-stage">
                    <div id="boxPlot"></div>
                </div>
                <div id="boxPlotZoomPanel"></div>
            </div>
        </section>`;
    return `
    <div class="visual-story">
        ${DEMO_PAGE ? `${flowSection}${framingSection}${bubbleSection}` : `${flowSection}${framingSection}${bubbleSection}${clinicianSection}`}
    </div>`;
}

function avgCoreRisk(episodes) {
    const eligible = (episodes || []).filter(e => e.core_risk_pct != null);
    if (!eligible.length) return '—';
    return (eligible.reduce((a, e) => a + e.core_risk_pct, 0) / eligible.length).toFixed(0) + '%';
}

function pctMeaningful(episodes) {
    if (!episodes || !episodes.length) return '—';
    const n = episodes.filter(e => e.tradeoff_level === 'Meaningful comparison').length;
    const eligible = episodes.filter(e => e.has_index_decision);
    return eligible.length ? Math.round(100 * n / eligible.length) + '%' : '—';
}

function avgCompleteness(episodes) {
    return episodes.length ? Math.round(episodes.reduce((sum, ep) => sum + (ep.completeness_pct ?? 100), 0) / episodes.length) + '%' : '—';
}

function recommendationExplainedPct(episodes) {
    const eligible = episodes.filter(ep => ep.has_index_decision);
    return eligible.length ? Math.round(100 * eligible.filter(ep => ep.recommendation_explained).length / eligible.length) + '%' : '—';
}

function questionsAnswered(episodes) {
    const answered = episodes.reduce((sum, ep) => sum + (ep.questions_answered_count || 0), 0);
    const total = episodes.reduce((sum, ep) => sum + (ep.questions_total_count || 0), 0);
    return `${answered}/${total}`;
}

const DISCUSSION_CATEGORIES = ['Single option', 'Minimally compared', 'Meaningfully compared'];
const DEMO_DISCUSSION_CATEGORIES = ['Single option', 'Limited comparison', 'Meaningful comparison'];
const CHART_LANE_MARGIN = { left: 68, right: 32, inset: 50 };

function discussionCategories() {
    return DEMO_PAGE ? DEMO_DISCUSSION_CATEGORIES : DISCUSSION_CATEGORIES;
}

function chartLaneScale(width) {
    return d3.scalePoint()
        .domain(discussionCategories())
        .range([CHART_LANE_MARGIN.left + CHART_LANE_MARGIN.inset, width - CHART_LANE_MARGIN.right - CHART_LANE_MARGIN.inset])
        .padding(0.25);
}

function jitterCategory(ep) {
    if (DEMO_PAGE) {
        if (ep.decision_framing === 'Single option presented' || ep.tradeoff_level === 'Not compared') return 'Single option';
        if (ep.tradeoff_level === 'Limited comparison' || ep.tradeoff_level === 'Meaningful comparison') return ep.tradeoff_level;
        return null;
    }
    const level = ep.tradeoff_level || ep.decision_framing || '';
    if (level === 'Single option' || level === 'Single option presented') return 'Single option';
    if (level === 'Minimally compared' || level === 'Not compared' || level === 'Limited comparison') return 'Minimally compared';
    if (level === 'Meaningfully compared' || level === 'Meaningful comparison') return 'Meaningfully compared';
    return null;
}

function renderRiskFrequencyChart(rows, episodes) {
    const counts = new Map();
    episodes.flatMap(ep => ep.core_risk_items || []).forEach(risk => {
        const bucket = riskGapBucket(risk);
        if (!bucket) return;
        const value = counts.get(risk.risk_name) || {risk_name:risk.risk_name, not_discussed_count:0, discussed_count:0};
        if (bucket === 'discussed') value.discussed_count++; else value.not_discussed_count++;
        counts.set(risk.risk_name, value);
    });
    const filtered = [...counts.values()].filter(row => row.not_discussed_count > 0).map(row => {
        const total = row.not_discussed_count + row.discussed_count;
        return {...row, pct_not_discussed: total ? Math.round(100 * row.not_discussed_count / total) : 0};
    }).sort((a,b) => b.not_discussed_count - a.not_discussed_count);
    const max = Math.max(1, ...filtered.map(row => row.not_discussed_count));
    return filtered.length ? filtered.slice(0, 8).map(row => `<div class="rank-row"><strong>${escHtml(row.risk_name)}</strong><div class="rank-track"><div class="rank-fill" style="width:${100 * row.not_discussed_count / max}%"></div></div><span>${row.not_discussed_count} missed · ${row.pct_not_discussed}%</span></div>`).join('') : '<p>No missed core risks in the selected episodes.</p>';
}

const ORTHO_QUESTION_CATEGORIES = [
    ['Recovery & rehabilitation', 69],
    ['Expected benefits', 46],
    ['Risks & complications', 43],
    ['Alternatives & timing', 24],
    ['Procedure details', 22],
];

function renderQuestionRollup(rows, episodes) {
    const grouped = new Map();
    episodes.flatMap(ep => ep.patient_questions || []).forEach(item => {
        const question = typeof item === 'string' ? item : item.question;
        if (!question) return;
        const normalized = question.toLowerCase();
        let topic = 'Other questions';
        if (/(heal|recovery|work|drive|activity)/.test(normalized)) topic = 'Recovery and return to activities';
        else if (/(wait|worse|progress|delay)/.test(normalized)) topic = 'Risks of waiting';
        else if (/(pain|relief|symptom)/.test(normalized)) topic = 'Pain and symptom relief';
        else if (/(risk|safe|complication)/.test(normalized)) topic = 'Intervention risks';
        const value = grouped.get(topic) || {topic, count:0, example:question};
        value.count++;
        grouped.set(topic, value);
    });
    const filtered = [...grouped.values()].sort((a,b) => b.count - a.count);
    if (!filtered.length && NAV.dataSource !== 'saved') {
        const bars = ORTHO_QUESTION_CATEGORIES.map(([topic, pct]) => `<div class="rank-row"><strong>${escHtml(topic)}</strong><div class="rank-track"><div class="rank-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>`).join('');
        return `${bars}<p class="jitter-hint">Share of 240 episodes in which the patient raised at least one question or concern. Categories can overlap.</p>`;
    }
    const max = Math.max(1, ...filtered.map(row => row.count));
    return filtered.length ? filtered.slice(0, 8).map(row => `<div class="rank-row" title="${escAttr(row.example)}"><strong>${escHtml(row.topic)}</strong><div class="rank-track"><div class="rank-fill" style="width:${100 * row.count / max}%"></div></div><span>${row.count}</span></div>`).join('') : '<p>No patient questions in the selected episodes.</p>';
}

function buildSankeyData(episodes) {
    const categories = discussionCategories();
    const counts = new Map(categories.map(category => [category, 0]));
    episodes.forEach(ep => {
        const category = jitterCategory(ep);
        if (category) counts.set(category, (counts.get(category) || 0) + 1);
    });
    const links = DEMO_PAGE
        ? [
            {source:'all',target:'Single option',value:counts.get('Single option') || 0},
            {source:'all',target:'alternatives',value:(counts.get('Limited comparison') || 0)+(counts.get('Meaningful comparison') || 0)},
            {source:'alternatives',target:'Limited comparison',value:counts.get('Limited comparison') || 0},
            {source:'alternatives',target:'Meaningful comparison',value:counts.get('Meaningful comparison') || 0}
        ]
        : [
            {source:'all',target:'Single option',value:counts.get('Single option') || 0},
            {source:'all',target:'alternatives',value:(counts.get('Minimally compared') || 0)+(counts.get('Meaningfully compared') || 0)},
            {source:'alternatives',target:'Minimally compared',value:counts.get('Minimally compared') || 0},
            {source:'alternatives',target:'Meaningfully compared',value:counts.get('Meaningfully compared') || 0}
        ];
    return {counts, links: links.filter(link => link.value > 0)};
}

// Percent of episodes in each Sankey node's bucket, keyed by node id
// ('alternatives' plus the discussion-category leaves).
function categoryPercents(episodes) {
    const { counts } = buildSankeyData(episodes);
    const total = episodes.length || 1;
    const alternativesCount = DEMO_PAGE
        ? (counts.get('Limited comparison') || 0) + (counts.get('Meaningful comparison') || 0)
        : (counts.get('Minimally compared') || 0) + (counts.get('Meaningfully compared') || 0);
    const percents = new Map();
    discussionCategories().forEach(cat => percents.set(cat, 100 * (counts.get(cat) || 0) / total));
    percents.set('alternatives', 100 * alternativesCount / total);
    return { counts, percents };
}

function setSankeyFocus(name) {
    navGoTo('procedure', name);
}

function setSankeyCompare(scope) {
    SANKEY_COMPARE_SCOPE = scope;
    renderSankeyDelta(sankeyEligibleEpisodes());
}

function renderSankeyControls(allProcedures) {
    const el = document.getElementById('sankeyControls');
    if (!el) return;
    el.innerHTML = `
        <label class="chart-control">View
            <select class="control-select" onchange="setSankeyFocus(this.value)">
                ${allProcedures.map(p => `<option value="${escAttr(p)}" ${p === SANKEY_FOCUS_PROCEDURE ? 'selected' : ''}>${escHtml(p)}</option>`).join('')}
            </select>
        </label>`;
}

// Sankey with benchmark deltas: shows one procedure's discussion-framing
// flow, with each node annotated by how it compares (in percentage points)
// to a chosen benchmark (all other procedures, or one specific peer).
function renderSankeyDelta(episodes) {
    const el = document.getElementById('sankeyPlot');
    if (!el || typeof d3 === 'undefined') return;

    const allProcedures = [...new Set(episodes.map(ep => ep.procedure).filter(Boolean))].sort();
    if (!allProcedures.length) {
        el.innerHTML = '<p class="jitter-hint">No intervention-level episodes yet.</p>';
        return;
    }
    const demoAll = DEMO_PAGE && !NAV.procedure;
    if (!demoAll && (!SANKEY_FOCUS_PROCEDURE || SANKEY_FOCUS_IS_AUTO || !allProcedures.includes(SANKEY_FOCUS_PROCEDURE))) {
        const volumeByProc = new Map();
        episodes.forEach(ep => ep.procedure && volumeByProc.set(ep.procedure, (volumeByProc.get(ep.procedure) || 0) + 1));
        SANKEY_FOCUS_PROCEDURE = [...volumeByProc.entries()].sort((a, b) => b[1] - a[1])[0][0];
        SANKEY_FOCUS_IS_AUTO = true;
    }
    if (SANKEY_COMPARE_SCOPE !== 'all' && (SANKEY_COMPARE_SCOPE === SANKEY_FOCUS_PROCEDURE || !allProcedures.includes(SANKEY_COMPARE_SCOPE))) SANKEY_COMPARE_SCOPE = 'all';

    if (!DEMO_PAGE) renderSankeyControls(allProcedures);

    const focusEpisodes = demoAll ? episodes : episodes.filter(ep => ep.procedure === SANKEY_FOCUS_PROCEDURE);

    el.innerHTML = '';
    if (!focusEpisodes.length) {
        el.innerHTML = '<p class="jitter-hint">No eligible episodes for this intervention yet.</p>';
        return;
    }

    const width = Math.max(el.clientWidth || 1000, 760), height = 610;
    const { counts, links } = buildSankeyData(focusEpisodes);
    const categories = discussionCategories();
    const altLaneCats = DEMO_PAGE ? ['Limited comparison', 'Meaningful comparison'] : ['Minimally compared', 'Meaningfully compared'];
    const rootLabel = demoAll
        ? `All interventions (${focusEpisodes.length} episodes)`
        : `${demoProcedureLabel(SANKEY_FOCUS_PROCEDURE)} (${focusEpisodes.length} episodes)`;

    const laneX = chartLaneScale(width);
    const nodes = new Map();
    nodes.set('all', {id:'all', name:rootLabel, x:width / 2, y:55, value:focusEpisodes.length, kind:'root'});
    nodes.set('alternatives', {id:'alternatives', name:'Alternatives presented', x:d3.mean(altLaneCats, laneX), y:245, value:links.find(l => l.target === 'alternatives')?.value || 0, kind:'branch'});
    categories.forEach(category => nodes.set(category, {id:category, name:category, x:laneX(category), y:475, value:counts.get(category) || 0, kind:'terminal'}));
    const maxValue = Math.max(1, focusEpisodes.length);
    const maxBarWidth = Math.min(width * 0.42, 420);
    const widthUnit = maxBarWidth / maxValue;
    const flowWidth = value => Math.max(1, value * widthUnit);
    const barWidth = value => flowWidth(value);
    const outgoingOffset = new Map();
    const incomingOffset = new Map();
    nodes.forEach((_, nodeId) => {
        let offset = 0;
        links.filter(link => link.source === nodeId)
            .sort((a, b) => nodes.get(a.target).x - nodes.get(b.target).x)
            .forEach(link => {
                outgoingOffset.set(link, offset);
                offset += flowWidth(link.value);
            });
        offset = 0;
        links.filter(link => link.target === nodeId)
            .sort((a, b) => nodes.get(a.source).x - nodes.get(b.source).x)
            .forEach(link => {
                incomingOffset.set(link, offset);
                offset += flowWidth(link.value);
            });
    });
    const ribbonPath = link => {
        const source = nodes.get(link.source), target = nodes.get(link.target);
        const ribbonWidth = flowWidth(link.value);
        const sourceLeft = source.x - barWidth(source.value) / 2;
        const targetLeft = target.x - barWidth(target.value) / 2;
        const sourceCenter = sourceLeft + (outgoingOffset.get(link) || 0) + ribbonWidth / 2;
        const targetCenter = targetLeft + (incomingOffset.get(link) || 0) + ribbonWidth / 2;
        const sourceY = source.y + 10;
        const targetY = target.y - 10;
        const midY = (sourceY + targetY) / 2;
        return [
            `M${sourceCenter - ribbonWidth / 2},${sourceY}`,
            `C${sourceCenter - ribbonWidth / 2},${midY} ${targetCenter - ribbonWidth / 2},${midY} ${targetCenter - ribbonWidth / 2},${targetY}`,
            `L${targetCenter + ribbonWidth / 2},${targetY}`,
            `C${targetCenter + ribbonWidth / 2},${midY} ${sourceCenter + ribbonWidth / 2},${midY} ${sourceCenter + ribbonWidth / 2},${sourceY}`,
            'Z'
        ].join(' ');
    };
    const svg = d3.select(el).append('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label',`Flow of treatment option discussion quality for ${rootLabel}`);
    svg.append('g').selectAll('path').data(links).join('path')
        .attr('d',ribbonPath).attr('fill',plotColor('primary')).attr('fill-opacity',.28)
        .append('title').text(d=>`${nodes.get(d.source).name} → ${nodes.get(d.target).name}: ${d.value} episodes`);
    const visibleNodes = [...nodes.values()].filter(node => node.kind !== 'terminal' || node.value > 0);
    const node = svg.append('g').selectAll('g').data(visibleNodes).join('g');
    node.append('rect').attr('x',d=>d.x-barWidth(d.value)/2).attr('y',d=>d.y-10).attr('width',d=>barWidth(d.value)).attr('height',20).attr('rx',8)
        .attr('fill',d=>d.kind === 'root' ? plotColor('on-surface') : plotColor('primary'));
    node.append('text').attr('x',d=>d.x).attr('y',d=>d.y + (d.kind === 'terminal' ? 34 : -20)).attr('text-anchor','middle')
        .style('font-size','12px').style('font-weight',500).attr('fill', plotColor('on-surface')).text(d=> d.kind === 'root' ? d.name : `${d.name} (${d.value || 0})`);
}

const RISK_CATEGORY_COLORS = (typeof d3 !== 'undefined' ? d3.scaleOrdinal() : { domain(){return this;}, range(){return this;} })
    .domain([
        'Infection', 'Neurologic / sensory injury', 'Bleeding / vascular complication', 'Structural / anatomic injury',
        'Pain / stiffness / symptom worsening', 'Treatment failure / inadequate effect',
        'Additional treatment / revision', 'Device / implant / material', 'Thromboembolic / cardiopulmonary',
    ])
    .range(['#6750A4', '#7D5260', '#625B71', '#B3261E', '#21005D', '#31111D', '#1D192B', '#410E0B', '#0B6E4F']);

function syncPlotPalette() {
    if (!RISK_CATEGORY_COLORS.range) return;
    RISK_CATEGORY_COLORS.range([
        plotColor('primary'),
        plotColor('tertiary'),
        plotColor('secondary'),
        plotColor('error'),
        plotColor('on-primary-container'),
        plotColor('on-tertiary-container'),
        plotColor('on-secondary-container'),
        plotColor('on-error-container'),
        '#0B6E4F',
    ]);
}

function setRiskBubbleYMetric(metric) {
    if (DEMO_PAGE && metric !== 'procedure_variation') return;
    if (RISK_BUBBLE_Y_METRIC === metric) return;
    RISK_BUBBLE_Y_METRIC = metric;
    NAV.bubbleSubGroup = null;
    NAV.isolateSource = null;
    if (metric === 'procedure_variation') {
        NAV.clinicianId = null;
        NAV.boxCategory = null;
        NAV.boxClinicianId = null;
    } else {
        NAV.procedure = null;
    }
    syncMapGrouping();
    refreshDepartmentDashboard();
}

// --- Client-side mirror of procedure_analytics.py's category inference, so
// the semantic-zoom episode drill-down (below) can match episodes to a risk
// category even for saved runs whose core_risk_items lack an explicit
// risk_category tag. ---
const RISK_CATEGORY_INFERENCE_RULES = [
    ['Device / implant / material', ['implant', 'device', 'hardware', 'material', 'cement', 'stimulator']],
    ['Infection', ['infect']],
    ['Bleeding / hemorrhage', ['bleed', 'hemorrhage', 'haemorrhage', 'blood loss']],
    ['Neurologic / sensory', ['nerve', 'neuro', 'sensory', 'numb', 'paraly', 'spinal cord']],
    ['Structural / anatomic injury', ['dural', 'tear', 'fracture', 'structural', 'anatomic', 'perforat']],
    ['Additional treatment / reintervention', ['revision', 'reintervention', 're-intervention', 'additional treatment', 'repeat', 'further surgery']],
    ['Treatment failure / inadequate effect', ['failure', 'inadequate', 'did not relieve', 'recurrence', 'non-union', 'nonunion']],
    ['Pain / symptom worsening', ['pain', 'symptom']],
];

function inferRiskCategory(riskName) {
    const text = (riskName || '').toLowerCase();
    if (!text) return null;
    const rule = RISK_CATEGORY_INFERENCE_RULES.find(([, keywords]) => keywords.some(k => text.includes(k)));
    return rule ? rule[0] : null;
}

function resolveRiskCategory(item) {
    return item.risk_category || inferRiskCategory(item.risk_name);
}

// An episode is "applicable" to a risk category if at least one of its
// core-risk items resolves to it; it counts as a "gap" for that category if
// any matching item wasn't discussed.
function episodeRiskCategoryStatus(ep, category) {
    const items = (ep.core_risk_items || []).filter(item => resolveRiskCategory(item) === category && riskGapBucket(item));
    if (!items.length) return null;
    return items.some(item => riskGapBucket(item) === 'not_discussed') ? 'Gap' : 'Discussed';
}

function populationStdev(values) {
    if (!values || values.length < 2) return null;
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
}

// Client-side mirror of procedure_analytics.risk_category_gap_stats, so the
// bubble chart can follow the same clinician/procedure isolate as the rest
// of the map instead of staying locked to the department-wide payload.
function riskCategoryGapStats(episodes, minClinicians = 3, minProcedures = 2, minEpisodesPerGroup = 5) {
    const overall = new Map();
    const byClinician = new Map();
    const byProcedure = new Map();
    const ensure = (map, key, factory) => {
        if (!map.has(key)) map.set(key, factory());
        return map.get(key);
    };
    const bump = (bucket, isGap) => {
        bucket.total += 1;
        bucket.gap += isGap ? 1 : 0;
    };

    (episodes || []).forEach(ep => {
        (ep.core_risk_items || []).forEach(item => {
            const category = resolveRiskCategory(item);
            if (!category) return;
            const bucket = riskGapBucket(item);
            if (!bucket) return;
            const isGap = bucket === 'not_discussed';
            bump(ensure(overall, category, () => ({ gap: 0, total: 0 })), isGap);
            if (ep.clinician_id) {
                bump(ensure(ensure(byClinician, category, () => new Map()), ep.clinician_id, () => ({ gap: 0, total: 0 })), isGap);
            }
            if (ep.procedure) {
                bump(ensure(ensure(byProcedure, category, () => new Map()), ep.procedure, () => ({ gap: 0, total: 0 })), isGap);
            }
        });
    });

    const fallback = DEPARTMENT_PROCEDURE_DATA.risk_categories || [];
    const results = [];
    overall.forEach((agg, category) => {
        if (!agg.total) return;
        const fb = fallback.find(row => row.risk_category === category);
        const clinicianRates = [...(byClinician.get(category)?.values() || [])]
            .filter(group => group.total >= minEpisodesPerGroup)
            .map(group => group.gap / group.total);
        const procedureRates = [...(byProcedure.get(category)?.values() || [])]
            .filter(group => group.total >= minEpisodesPerGroup)
            .map(group => group.gap / group.total);
        const clinVar = clinicianRates.length >= minClinicians
            ? Math.round(1000 * populationStdev(clinicianRates)) / 10
            : null;
        const procVar = procedureRates.length >= minProcedures
            ? Math.round(1000 * populationStdev(procedureRates)) / 10
            : null;
        results.push({
            risk_category: category,
            gap_rate: Math.round(1000 * agg.gap / agg.total) / 10,
            applicable_episodes: agg.total,
            clinician_count: clinicianRates.length,
            clinician_variation: clinVar ?? fb?.clinician_variation ?? null,
            procedure_count: procedureRates.length,
            procedure_variation: procVar ?? fb?.procedure_variation ?? null,
            clinician_rate_range: clinicianRates.length
                ? [Math.round(100 * Math.min(...clinicianRates)), Math.round(100 * Math.max(...clinicianRates))]
                : (fb?.clinician_rate_range ?? null),
            by_clinician: [...(byClinician.get(category)?.entries() || [])]
                .filter(([, group]) => group.total >= minEpisodesPerGroup)
                .map(([clinician_id, group]) => ({
                    clinician_id,
                    gap_rate: Math.round(1000 * group.gap / group.total) / 10,
                    n: group.total,
                }))
                .sort((a, b) => b.gap_rate - a.gap_rate),
            by_procedure: [...(byProcedure.get(category)?.entries() || [])]
                .filter(([, group]) => group.total >= minEpisodesPerGroup)
                .map(([procedure, group]) => ({
                    procedure,
                    gap_rate: Math.round(1000 * group.gap / group.total) / 10,
                    n: group.total,
                }))
                .sort((a, b) => b.gap_rate - a.gap_rate),
        });
    });
    results.sort((a, b) => b.applicable_episodes - a.applicable_episodes);
    return results;
}

function bubbleChartRows() {
    const isolate = mapIsolate();
    const rows = riskCategoryGapStats(scopeFilteredEpisodes());
    if (!isolate) return rows;
    return rows.map(row => {
        const sub = isolate.kind === 'procedure'
            ? (row.by_procedure || []).find(s => s.procedure === isolate.id)
            : (row.by_clinician || []).find(s => s.clinician_id === isolate.id);
        if (!sub) return null;
        return { ...row, gap_rate: sub.gap_rate, applicable_episodes: sub.n };
    }).filter(Boolean);
}

function bubbleSubGroupLabel(category, subGroup) {
    if (bubbleSplitBy() === 'clinician') {
        const clin = DEPARTMENT_CLINICIANS.find(c => c.id === subGroup);
        return clin ? clin.name : subGroup;
    }
    return demoProcedureLabel(subGroup);
}

// Breaks a sub-bubble label (clinician or procedure name) into up to two
// lines so long procedure names ("Vertebroplasty / kyphoplasty") take less
// horizontal room and don't crash into their neighbors' labels.
function wrapBubbleLabel(text) {
    if (!text || text.length <= 14) return [text || ''];
    const slashIdx = text.indexOf(' / ');
    if (slashIdx !== -1) return [text.slice(0, slashIdx), text.slice(slashIdx + 3)];
    const mid = text.length / 2;
    let bestSpace = -1, bestDist = Infinity;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
            const dist = Math.abs(i - mid);
            if (dist < bestDist) { bestDist = dist; bestSpace = i; }
        }
    }
    return bestSpace === -1 ? [text] : [text.slice(0, bestSpace), text.slice(bestSpace + 1)];
}

function wrapCategoryLabel(text) {
    if (!text) return [''];
    if (text.includes(' / ')) {
        const parts = text.split(' / ');
        return parts.map((part, index) => index < parts.length - 1 ? `${part} /` : part);
    }
    return wrapBubbleLabel(text);
}

function placeRiskBubbleLabels(labelRows, allRows, x, y, r, yField, bounds) {
    const CHAR_W = 6.45;
    const LINE_H = 13;
    const BASELINE = 10;
    const LABEL_PAD = 4;
    const BUBBLE_PAD = 5;
    const LEADER_DIST = 22;
    const EDGE_GAP = 9;

    const bubbles = allRows.map(row => ({
        id: row.risk_category,
        cx: x(row.gap_rate),
        cy: y(row[yField]),
        radius: r(row.applicable_episodes),
    }));

    const items = labelRows.map(row => {
        const lines = wrapCategoryLabel(row.risk_category);
        return {
            id: row.risk_category,
            row,
            lines,
            cx: x(row.gap_rate),
            cy: y(row[yField]),
            radius: r(row.applicable_episodes),
            labelW: Math.max(...lines.map(line => line.length)) * CHAR_W + 6,
            labelH: lines.length * LINE_H + 2,
        };
    });

    const nearby = item => bubbles.filter(b => b.id !== item.id
        && Math.hypot(b.cx - item.cx, b.cy - item.cy) < b.radius + item.radius + 90).length;
    items.sort((a, b) => nearby(a) - nearby(b));

    const occupied = [
        { x0: bounds.left, y0: bounds.top, x1: bounds.left + 118, y1: bounds.top + 16 },
        { x0: bounds.right - 168, y0: bounds.top, x1: bounds.right, y1: bounds.top + 16 },
        { x0: bounds.left, y0: bounds.bottom - 16, x1: bounds.left + 128, y1: bounds.bottom },
        { x0: bounds.right - 138, y0: bounds.bottom - 16, x1: bounds.right, y1: bounds.bottom },
    ];

    const boxesOverlap = (a, b) =>
        a.x0 < b.x1 + LABEL_PAD && a.x1 > b.x0 - LABEL_PAD &&
        a.y0 < b.y1 + LABEL_PAD && a.y1 > b.y0 - LABEL_PAD;

    const boxHitsBubble = (box, bubble) => {
        const nx = Math.max(box.x0, Math.min(bubble.cx, box.x1));
        const ny = Math.max(box.y0, Math.min(bubble.cy, box.y1));
        const pad = bubble.radius + BUBBLE_PAD;
        return (nx - bubble.cx) ** 2 + (ny - bubble.cy) ** 2 < pad * pad;
    };

    const inBounds = box =>
        box.x0 >= bounds.left && box.x1 <= bounds.right &&
        box.y0 >= bounds.top && box.y1 <= bounds.bottom;

    const makeBox = (item, side, nudge, extra) => {
        const w = item.labelW, h = item.labelH;
        const gap = EDGE_GAP + extra;
        const cx = item.cx, cy = item.cy, rad = item.radius;
        let x0, y0, anchor, lx;
        if (side === 'n' || side === 's') {
            x0 = cx - w / 2 + nudge;
            y0 = side === 'n' ? cy - rad - gap - h : cy + rad + gap;
            anchor = 'middle';
            lx = x0 + w / 2;
        } else if (side === 'e') {
            x0 = cx + rad + gap;
            y0 = cy - h / 2 + nudge;
            anchor = 'start';
            lx = x0;
        } else if (side === 'w') {
            x0 = cx - rad - gap - w;
            y0 = cy - h / 2 + nudge;
            anchor = 'end';
            lx = x0 + w;
        } else if (side === 'ne' || side === 'se') {
            x0 = cx + rad * 0.4 + extra;
            y0 = side === 'ne' ? cy - rad - gap - h : cy + rad + gap;
            anchor = 'start';
            lx = x0;
        } else {
            x0 = cx - rad * 0.4 - extra - w;
            y0 = side === 'nw' ? cy - rad - gap - h : cy + rad + gap;
            anchor = 'end';
            lx = x0 + w;
        }
        return { x0, y0, x1: x0 + w, y1: y0 + h, anchor, lx, ly: y0 + BASELINE, side };
    };

    const trials = [];
    const northNudges = [0, -26, 26, -52, 52, -78, 78];
    const sideNudges = [0, -16, 16, -32, 32];
    [0, 8, 18, 30, 46, 64].forEach(extra => {
        northNudges.forEach(nudge => trials.push({ side: 'n', nudge, extra }));
        trials.push({ side: 'nw', nudge: 0, extra }, { side: 'ne', nudge: 0, extra });
        sideNudges.forEach(nudge => {
            trials.push({ side: 'w', nudge, extra }, { side: 'e', nudge, extra });
        });
        northNudges.forEach(nudge => trials.push({ side: 's', nudge, extra }));
        trials.push({ side: 'sw', nudge: 0, extra }, { side: 'se', nudge: 0, extra });
    });

    const placed = [];
    items.forEach(item => {
        const def = makeBox(item, 'n', 0, 0);
        let clear = null;
        let fallback = null;
        trials.forEach(trial => {
            const box = makeBox(item, trial.side, trial.nudge, trial.extra);
            if (!inBounds(box) || occupied.some(other => boxesOverlap(box, other))) return;
            const hits = bubbles.reduce((n, bubble) => n + (boxHitsBubble(box, bubble) ? 1 : 0), 0);
            const dist = Math.hypot(box.lx - def.lx, box.ly - def.ly);
            const score = trial.extra * 0.25 + Math.abs(trial.nudge) * 0.04 + dist * 0.05
                + (trial.side === 'n' ? 0 : trial.side === 's' ? 6 : 3);
            if (hits === 0 && !clear) clear = { ...box, score };
            if (!fallback || score + hits * 40 < fallback.score) fallback = { ...box, score: score + hits * 40 };
        });
        const chosen = clear || fallback || def;
        occupied.push(chosen);

        const nx = Math.max(chosen.x0 + 2, Math.min(item.cx, chosen.x1 - 2));
        const ny = Math.max(chosen.y0 + 2, Math.min(item.cy, chosen.y1 - 2));
        let dx = nx - item.cx, dy = ny - item.cy;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const moveDist = Math.hypot(chosen.lx - def.lx, chosen.ly - def.ly);
        const leaderX1 = item.cx + dx * (item.radius + 3);
        const leaderY1 = item.cy + dy * (item.radius + 3);
        const leaderLen = Math.hypot(nx - leaderX1, ny - leaderY1);
        placed.push({
            ...item,
            ...chosen,
            leader: moveDist >= LEADER_DIST && leaderLen >= 8,
            leaderX1,
            leaderY1,
            leaderX2: nx,
            leaderY2: ny,
        });
    });
    return placed;
}

// Single dispatcher for every breadcrumb crumb (top bubble-chart bar, box-plot
// zoom selections, and the episode overlay's own trail) — keeps navigation
// state changes in one place so "click a crumb" always lands on a real,
// consistent map state instead of a dead end.
function breadcrumbGoTo(kind, param) {
    navGoTo(kind, param);
}

function renderBreadcrumbTrail(crumbs) {
    return crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        const sep = i > 0 ? '<span class="crumb-sep">&rsaquo;</span>' : '';
        if (isLast) return `${sep}<span class="crumb is-current">${escHtml(c.label)}</span>`;
        return `${sep}<button type="button" class="crumb" onclick="navGoTo('${escAttr(c.kind)}','${escAttr(c.param)}')">${escHtml(c.label)}</button>`;
    }).join('');
}

function bindEpisodePeeks() {
    const tip = document.getElementById('peekTooltip');
    document.querySelectorAll('.episode-peek-row').forEach(row => {
        const episodeId = row.dataset.episodeId;
        if (!episodeId) return;
        row.addEventListener('mouseenter', () => {
            if (tip) tip.style.opacity = 0;
            const slot = document.getElementById('episodeInlineDetail');
            if (NAV.episodeId === episodeId && slot && !slot.hidden) return;
            clearTimeout(spinePeekTimer);
            spinePeekTimer = setTimeout(() => showSpinePeek(episodeId, row), 180);
        });
        row.addEventListener('mouseleave', () => {
            clearTimeout(spinePeekTimer);
            spinePeekTimer = null;
            hideSpinePeek();
        });
    });
}

function formatEpisodeDate(ep) {
    if (!ep.episode_date) return 'N/A';
    const d = new Date(ep.episode_date);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Compact chips showing exactly which core-risk items in this category were
// discussed vs. missed for one episode — the specific evidence behind its
// Gap/Discussed status, visible without opening the episode.
function renderRiskItemChips(ep, category) {
    const items = (ep.core_risk_items || []).filter(item => resolveRiskCategory(item) === category);
    if (!items.length) return '<span style="color:var(--muted);">—</span>';
    return items.filter(item => riskGapBucket(item)).map(item =>
        `<span class="risk-item-chip ${riskGapBucket(item) === 'discussed' ? 'is-discussed' : 'is-gap'}">${escHtml(item.risk_name)}</span>`
    ).join('') || '<span style="color:var(--muted);">—</span>';
}

// Shared drill-down episode list for both semantic-zoom entry points (risk
// bubble sub-groups and box-plot glyphs): a dense, sortable-by-relevance
// table instead of a single-line list, plus quick summary stats so the
// department-wide pattern for this slice is visible before opening any
// individual episode. `opts.riskCategory` adds a per-episode risk-item chip
// column; `opts.statusColumn` adds a context-specific status column + sort.
function renderEpisodeListPanel(title, episodes, opts = {}) {
    const { riskCategory, statusColumn } = opts;
    if (!episodes.length) {
        return `<div class="zoom-episode-panel"><h4>${escHtml(title)}</h4><p class="jitter-hint" style="margin:0;">No episodes match this selection yet.</p></div>`;
    }
    const sorted = episodes.slice().sort((a, b) => {
        if (statusColumn?.sortKey) {
            const diff = statusColumn.sortKey(a) - statusColumn.sortKey(b);
            if (diff) return diff;
        }
        return (a.core_risk_pct ?? 999) - (b.core_risk_pct ?? 999);
    });
    const shown = sorted.slice(0, 60);
    const clinicianCount = new Set(episodes.map(ep => ep.clinician_id)).size;
    const withCoreRisk = episodes.filter(ep => ep.core_risk_pct != null);
    const avgCoreRisk = withCoreRisk.length ? Math.round(withCoreRisk.reduce((sum, ep) => sum + ep.core_risk_pct, 0) / withCoreRisk.length) : null;
    const statusSummary = statusColumn?.summary ? statusColumn.summary(episodes) : null;

    const rows = shown.map(ep => `
        <tr class="zoom-episode-row episode-peek-row" onclick="openEpisodeFromRow(event,'${escAttr(ep.episode_id)}')"
            data-episode-id="${escAttr(ep.episode_id)}"
            data-peek-clinician="${escAttr(ep.clinician_name || '')}"
            data-peek-core="${ep.core_risk_pct == null ? 'N/A' : `${ep.core_risk_pct}%`}"
            data-peek-category="${escAttr(jitterCategory(ep) || 'N/A')}">
            <td><span class="zoom-episode-swatch" style="background:${ep.clinician_color || '#7f8c8d'}"></span><strong>${escHtml(ep.patient_label)}</strong>${ep.source === 'demo' ? ' <span class="badge">demo</span>' : ''}</td>
            <td style="color:${ep.clinician_color || 'inherit'};font-weight:600;">${escHtml(ep.clinician_name || 'N/A')}</td>
            <td>${escHtml(ep.procedure || 'N/A')}</td>
            <td style="white-space:nowrap;">${ep.core_risk_pct == null ? 'N/A' : `${ep.core_risk_pct}%`}</td>
            <td style="white-space:nowrap;">${ep.completeness_pct ?? 100}%</td>
            <td>${escHtml(jitterCategory(ep) || 'N/A')}</td>
            <td style="white-space:nowrap;">${formatEpisodeDate(ep)}</td>
            ${riskCategory ? `<td>${renderRiskItemChips(ep, riskCategory)}</td>` : ''}
            ${statusColumn ? `<td style="white-space:nowrap;">${statusColumn.render(ep)}</td>` : ''}
            <td class="view-link" data-episode-id="${escAttr(ep.episode_id)}" style="white-space:nowrap;">Open &rarr;</td>
        </tr>`).join('');
    const moreNote = episodes.length > shown.length
        ? `<p class="jitter-hint" style="margin:8px 0 0;">Showing the first ${shown.length} of ${episodes.length} episodes.</p>` : '';

    return `<div class="zoom-episode-panel">
        <div class="zoom-panel-header">
            <h4>${escHtml(title)} <span style="color:var(--muted);font-weight:600;">(${episodes.length} episode${episodes.length === 1 ? '' : 's'})</span></h4>
            <div class="zoom-panel-stats">
                ${avgCoreRisk != null ? `<span class="zoom-stat"><strong>${avgCoreRisk}%</strong>avg core risks discussed</span>` : ''}
                <span class="zoom-stat"><strong>${clinicianCount}</strong>clinician${clinicianCount === 1 ? '' : 's'}</span>
                ${statusSummary ? `<span class="zoom-stat"><strong>${statusSummary.value}</strong>${statusSummary.label}</span>` : ''}
            </div>
        </div>
        <div class="zoom-episode-table-wrap">
            <table class="zoom-episode-table">
                <thead><tr>
                    <th>Patient</th><th>Clinician</th><th>Intervention</th><th>Core risks %</th><th>Completeness</th><th>Discussion category</th><th>Date</th>
                    ${riskCategory ? `<th>${escHtml(riskCategory)} items</th>` : ''}
                    ${statusColumn ? `<th>${escHtml(statusColumn.label)}</th>` : ''}
                    <th></th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        ${moreNote}
    </div>`;
}

function selectBubbleCategory(category, defaultSplitBy) {
    navGoTo('bubble-category', category);
}

function selectBubbleSubGroup(subGroup) {
    navGoTo('bubble-subgroup', subGroup);
}

function setBubbleSplitBy(mode) {
    if (mode === 'clinician' && NAV.clinicianId) navGoTo('clinician', NAV.clinicianId);
    else if (mode === 'procedure' && NAV.procedure) navGoTo('procedure', NAV.procedure);
    else if (mode === 'clinician') {
        NAV.grouping = 'clinician';
        renderRiskGapBubbleChart();
        renderGlobalBreadcrumb();
    } else {
        NAV.grouping = 'procedure';
        renderRiskGapBubbleChart();
        renderGlobalBreadcrumb();
    }
}

function renderBubbleSizeLegend(usable, r) {
    const el = document.getElementById('riskBubbleLegend');
    if (!el) return;
    const maxN = Math.max(1, ...usable.map(row => row.applicable_episodes));
    const refs = [...new Set([Math.max(5, Math.round(maxN * 0.15)), Math.round(maxN * 0.5), maxN])];
    el.innerHTML = `<div class="bubble-legend"><span class="bubble-legend-title">${DEMO_PAGE ? 'Bubble size = # of applicable episodes' : 'Bubble size = applicable episodes'}</span>${refs.map(n => `
        <div class="bubble-legend-item">
            <span class="bubble-legend-swatch" style="width:${Math.round(r(n) * 2)}px;height:${Math.round(r(n) * 2)}px;"></span>
            <span class="bubble-legend-label">n=${n}</span>
        </div>`).join('')}</div>`;
}

function renderRiskBubbleZoomPanel() {
    parkInlineEpisodeSlot();
    const panel = document.getElementById('riskBubbleZoomPanel');
    if (!panel) return;
    const category = NAV.bubbleCategory;
    const isolate = mapIsolate();
    const subGroup = NAV.bubbleSubGroup;
    const splitBy = bubbleSplitBy();
    if (!category || (!isolate && !subGroup)) {
        panel.innerHTML = '';
        restoreInlineEpisodeIfOpen();
        return;
    }
    const drillKey = isolate ? isolate.id : subGroup;
    const drillLabel = isolate ? isolate.label : bubbleSubGroupLabel(category, subGroup);
    const episodes = (isolate ? filteredDepartmentEpisodes() : scopeFilteredEpisodes()).filter(ep => {
        if (!episodeRiskCategoryStatus(ep, category)) return false;
        if (isolate) return true;
        return splitBy === 'clinician' ? ep.clinician_id === drillKey : ep.procedure === drillKey;
    });
    const title = `${category} — ${drillLabel}`;
    panel.innerHTML = renderEpisodeListPanel(title, episodes, {
        riskCategory: category,
        statusColumn: {
            label: 'Status',
            render: ep => {
                const status = episodeRiskCategoryStatus(ep, category);
                return `<span class="${status === 'Gap' ? 'status-Not-detected' : 'status-Discussed'}">${status}</span>`;
            },
            sortKey: ep => episodeRiskCategoryStatus(ep, category) === 'Gap' ? 0 : 1,
            summary: eps => {
                const gaps = eps.filter(ep => episodeRiskCategoryStatus(ep, category) === 'Gap').length;
                return { value: `${Math.round(100 * gaps / eps.length)}%`, label: 'gap rate' };
            }
        }
    });
    bindEpisodePeeks();
    restoreInlineEpisodeIfOpen();
}

// "Danger zone" bubble chart: x = how often a core-risk category is missed,
// y (toggle) = how much clinicians or procedures vary in missing it,
// bubble size = applicable episodes. Y is stdev of gap rates (Jacob's
// revision), not "% of clinicians with >=1 gap", so a clinician who is
// simply thorough/lax across every category doesn't dominate every bubble.
//
// Semantic zoom (Milestone D): click a bubble to fade its siblings and split
// it into per-clinician/per-procedure sub-bubbles; click a sub-bubble to
// drill into the matching episode list. Mirrors the "overview -> zoom+filter
// -> details-on-demand" flow used everywhere else in this redesign.
function renderRiskGapBubbleChart(rows) {
    const el = document.getElementById('riskBubblePlot');
    const controlsEl = document.getElementById('riskBubbleControls');
    if (!el || typeof d3 === 'undefined') return;

    rows = rows || bubbleChartRows();
    const yField = RISK_BUBBLE_Y_METRIC;
    const yLabel = yField === 'procedure_variation' ? 'Variation across interventions' : 'Variation across clinicians';
    const zoomed = NAV.bubbleCategory;
    const isolate = mapIsolate();
    const filterLabel = isolate ? isolate.label : null;
    const selectedSub = NAV.bubbleSubGroup;
    const expand = Boolean(zoomed && !isolate);
    const prevZoomed = el.dataset.zoomedCategory || '';
    const sameZoom = prevZoomed === (zoomed || '');
    const wasExpanded = el.dataset.expanded === '1';
    const collapsing = wasExpanded && !expand;

    if (controlsEl) controlsEl.innerHTML = '';

    const usable = (rows || []).filter(row => row[yField] != null);
    if (!usable.length) {
        el.innerHTML = filterLabel
            ? `<p class="jitter-hint">Not enough comparable gap data for ${escHtml(filterLabel)} yet.</p>`
            : '<p class="jitter-hint">Not enough clinicians or interventions with comparable data yet for this view.</p>';
        renderRiskBubbleZoomPanel();
        return;
    }

    const width = Math.max(el.clientWidth || 1000, 760), height = 540;
    const margin = { top: 44, right: 40, bottom: 64, left: 68 };
    const niceCeiling = (value, cap) => {
        const padded = Math.max(value * 1.18, 1);
        const step = padded <= 10 ? 2 : padded <= 40 ? 5 : padded <= 80 ? 10 : 20;
        return Math.min(cap, Math.max(step, Math.ceil(padded / step) * step));
    };
    const maxGap = Math.max(...usable.map(row => row.gap_rate));
    const maxY = Math.max(...usable.map(row => row[yField]));
    const axisY = height - margin.bottom;
    const r = d3.scaleSqrt().domain([0, Math.max(1, ...usable.map(row => row.applicable_episodes))]).range([8, 36]);
    const x = d3.scaleLinear().domain([0, niceCeiling(maxGap, 100)]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, niceCeiling(maxY, 100)]).range([axisY, margin.top]);
    const clearance = Math.max(0, ...usable.map(row => r(row.applicable_episodes) + 18 - (axisY - y(row[yField]))));
    if (clearance > 0) y.range([axisY - clearance, margin.top]);
    const medianY = d3.median(usable, row => row[yField]) || 0;
    const dur = el.querySelector('svg') && (sameZoom || collapsing || wasExpanded || zoomed) ? 420 : 0;

    let svg = d3.select(el).select('svg');
    let tooltip = d3.select(el).select('.beeswarm-tooltip');
    if (svg.empty()) {
        el.innerHTML = '';
        tooltip = d3.select(el).append('div').attr('class', 'beeswarm-tooltip');
        svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img')
            .attr('aria-label', 'Core risk disclosure gap frequency vs variation');
        svg.append('g').attr('class', 'static-layer');
        svg.append('g').attr('class', 'bubble-layer');
        svg.append('g').attr('class', 'sub-layer');
        svg.append('g').attr('class', 'label-layer');
    } else {
        svg.attr('viewBox', `0 0 ${width} ${height}`);
        if (tooltip.empty()) tooltip = d3.select(el).append('div').attr('class', 'beeswarm-tooltip');
        if (svg.select('g.static-layer').empty()) svg.insert('g', ':first-child').attr('class', 'static-layer');
        if (svg.select('g.bubble-layer').empty()) svg.append('g').attr('class', 'bubble-layer');
        if (svg.select('g.sub-layer').empty()) svg.append('g').attr('class', 'sub-layer');
        if (svg.select('g.label-layer').empty()) svg.append('g').attr('class', 'label-layer');
    }

    const staticG = svg.select('g.static-layer');
    const bubbleG = svg.select('g.bubble-layer');
    const subG = svg.select('g.sub-layer');
    const labelG = svg.select('g.label-layer');
    staticG.lower();
    labelG.raise();

    renderBubbleSizeLegend(usable, r);
    staticG.selectAll('*').remove();
    staticG.append('rect').attr('class', 'plot-bg').attr('x', 0).attr('y', 0)
        .attr('width', width).attr('height', height).attr('fill', 'transparent')
        .style('cursor', zoomed ? 'pointer' : 'default')
        .on('click', () => {
            if (IGNORE_BUBBLE_BG_CLICK) return;
            if (zoomed) selectBubbleCategory(zoomed);
        });
    staticG.append('g').attr('transform', `translate(0,${axisY})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`))
        .call(g => g.select('.domain').attr('stroke', plotColor('outline-variant')))
        .selectAll('text').attr('fill', plotColor('on-surface-variant')).style('font-size', '11px');
    staticG.append('g').attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.select('.domain').attr('stroke', plotColor('outline-variant')))
        .selectAll('text').attr('fill', plotColor('on-surface-variant')).style('font-size', '11px');
    if (y(0) < axisY - 0.5) {
        staticG.append('line').attr('x1', margin.left).attr('x2', margin.left).attr('y1', y(0)).attr('y2', axisY)
            .attr('stroke', plotColor('outline-variant'));
    }
    const gapGuide = d3.median(usable, row => row.gap_rate) || 0;
    if (gapGuide > x.domain()[0] && gapGuide < x.domain()[1]) {
        staticG.append('line').attr('x1', x(gapGuide)).attr('x2', x(gapGuide)).attr('y1', margin.top).attr('y2', height - margin.bottom)
            .attr('stroke', plotColor('outline-variant')).attr('stroke-dasharray', '4,4');
    }
    staticG.append('line').attr('x1', margin.left).attr('x2', width - margin.right).attr('y1', y(medianY)).attr('y2', y(medianY))
        .attr('stroke', plotColor('outline-variant')).attr('stroke-dasharray', '4,4');
    const quadrantLabel = (tx, ty, anchor, text) => staticG.append('text').attr('x', tx).attr('y', ty).attr('text-anchor', anchor)
        .style('font-size', '11px').style('font-weight', 700).style('font-style', 'italic').attr('fill', plotColor('outline')).text(text);
    quadrantLabel(margin.left + 8, margin.top + 16, 'start', 'Isolated variation');
    quadrantLabel(width - margin.right - 8, margin.top + 16, 'end', 'Concentrated recurring gap');
    quadrantLabel(margin.left + 8, height - margin.bottom - 12, 'start', 'Consistently low gap');
    quadrantLabel(width - margin.right - 8, height - margin.bottom - 12, 'end', 'Broad recurring gap');
    staticG.append('text').attr('x', (margin.left + width - margin.right) / 2).attr('y', height - 16).attr('text-anchor', 'middle')
        .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.14em').attr('fill', plotColor('on-surface-variant'))
        .text(DEMO_PAGE ? 'RISK DISCUSSION GAP RATE' : 'NOT DISCUSSED (% OF APPLICABLE EPISODES)');
    staticG.append('text').attr('transform', 'rotate(-90)').attr('x', -(margin.top + height - margin.bottom) / 2).attr('y', 16).attr('text-anchor', 'middle')
        .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.14em').attr('fill', plotColor('on-surface-variant'))
        .text(yLabel.toUpperCase());

    const selectedRow = zoomed ? usable.find(row => row.risk_category === zoomed) : null;
    const parentOf = row => row ? [x(row.gap_rate), y(row[yField])] : [0, 0];

    if (collapsing) {
        const prevRow = usable.find(row => row.risk_category === prevZoomed);
        const [px, py] = parentOf(prevRow);
        const outgoing = subG.classed('sub-layer', false).attr('class', 'sub-layer-out');
        outgoing.selectAll('g.sub-bubble').transition().duration(dur)
            .attr('transform', `translate(${px},${py})`).style('opacity', 0);
        outgoing.selectAll('line, path.sub-leader').transition().duration(dur).attr('stroke-opacity', 0);
        outgoing.transition().duration(dur).on('end', function() { d3.select(this).remove(); });
        svg.insert('g', 'g.label-layer').attr('class', 'sub-layer');
    }

    el.dataset.zoomedCategory = zoomed || '';
    el.dataset.expanded = expand ? '1' : '';
    const liveSub = svg.select('g.sub-layer');

    const bubbleSel = bubbleG.selectAll('circle.cat-bubble').data(usable, d => d.risk_category);
    bubbleSel.enter().append('circle').attr('class', 'cat-bubble')
        .attr('cx', row => x(row.gap_rate)).attr('cy', row => y(row[yField])).attr('r', 0)
        .attr('fill', row => RISK_CATEGORY_COLORS(row.risk_category))
        .style('cursor', 'pointer')
        .merge(bubbleSel)
        .on('mousemove', function(event, row) {
            const rect = el.getBoundingClientRect();
            const rangeText = row.clinician_rate_range ? `${row.clinician_rate_range[0]}–${row.clinician_rate_range[1]}%` : 'n/a';
            tooltip.html(
                `<strong>${escHtml(row.risk_category)}</strong>${filterLabel ? ` · ${escHtml(filterLabel)}` : ''}<br>` +
                `${row.gap_rate}% gap · ${row.applicable_episodes} episodes<br>` +
                `Clinician rates: ${rangeText}<br>` +
                `<em>${isolate ? 'Click to see episodes' : `Click to split by ${splitBy}`}</em>`
            ).style('left', `${event.clientX - rect.left + 12}px`).style('top', `${event.clientY - rect.top - 18}px`).style('opacity', 1);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0))
        .on('click', (event, row) => { event.stopPropagation(); selectBubbleCategory(row.risk_category); })
        .transition().duration(dur)
        .attr('cx', row => x(row.gap_rate)).attr('cy', row => y(row[yField])).attr('r', row => r(row.applicable_episodes))
        .attr('fill', row => RISK_CATEGORY_COLORS(row.risk_category))
        .attr('fill-opacity', row => !zoomed ? 0.75 : (row.risk_category === zoomed ? 0.88 : 0.1))
        .attr('stroke', row => row.risk_category === zoomed ? 'var(--navy)' : plotColor('surface-container-lowest'))
        .attr('stroke-width', row => row.risk_category === zoomed ? 3 : 1.5)
        .on('end', () => {
            staticG.lower();
            if (zoomed) bubbleG.selectAll('circle.cat-bubble').filter(row => row.risk_category === zoomed).raise();
            labelG.raise();
        });
    bubbleSel.exit().transition().duration(200).attr('r', 0).remove();
    if (zoomed) bubbleG.selectAll('circle.cat-bubble').filter(row => row.risk_category === zoomed).raise();
    staticG.lower();
    labelG.raise();

    const placedLabels = placeRiskBubbleLabels(usable, usable, x, y, r, yField, {
        left: margin.left + 8,
        right: width - margin.right - 8,
        top: margin.top + 8,
        bottom: height - margin.bottom - 10,
    });

    labelG.selectAll(':scope > text.cat-label').remove();
    const labelSel = labelG.selectAll('g.cat-ann').data(placedLabels, d => d.id);
    labelSel.exit().remove();
    const labelEnter = labelSel.enter().append('g').attr('class', 'cat-ann').style('pointer-events', 'none');
    labelEnter.append('line').attr('class', 'cat-leader');
    labelEnter.append('text').attr('class', 'cat-label')
        .style('font-size', '11px').style('font-weight', 700)
        .attr('fill', plotColor('on-surface')).attr('stroke', plotColor('surface-container-lowest')).attr('stroke-width', 4)
        .style('paint-order', 'stroke');
    const labelAll = labelEnter.merge(labelSel);
    labelAll.style('opacity', d => !zoomed || d.id === zoomed ? 1 : 0);
    labelAll.select('line.cat-leader')
        .attr('stroke', plotColor('outline')).attr('stroke-width', 1)
        .attr('x1', d => d.leaderX1).attr('y1', d => d.leaderY1)
        .attr('x2', d => d.leaderX2).attr('y2', d => d.leaderY2)
        .attr('stroke-opacity', d => d.leader ? 0.8 : 0);
    labelAll.select('text.cat-label')
        .attr('text-anchor', d => d.anchor)
        .attr('x', d => d.lx).attr('y', d => d.ly)
        .attr('stroke', plotColor('surface-container-lowest')).attr('stroke-width', 4).style('paint-order', 'stroke')
        .each(function(d) {
            d3.select(this).selectAll('tspan').data(d.lines).join('tspan')
                .attr('x', d.lx)
                .attr('dy', (_, i) => i === 0 ? 0 : 13)
                .text(line => line);
        });
    labelG.raise();

    const drawSubCluster = (layer, fromParent) => {
        const subGroupKey = s => splitBy === 'clinician' ? s.clinician_id : s.procedure;
        const subRows = ((splitBy === 'clinician' ? selectedRow.by_clinician : selectedRow.by_procedure) || [])
            .slice()
            .sort((a, b) => (a.gap_rate ?? 0) - (b.gap_rate ?? 0) || String(subGroupKey(a)).localeCompare(String(subGroupKey(b))));
        const [parentX, parentY] = parentOf(selectedRow);
        const subGroupColor = s => splitBy === 'clinician'
            ? (DEPARTMENT_CLINICIANS.find(c => c.id === s.clinician_id)?.color || RISK_CATEGORY_COLORS(selectedRow.risk_category))
            : RISK_CATEGORY_COLORS(selectedRow.risk_category);
        const subR = d3.scaleSqrt().domain([0, Math.max(1, ...subRows.map(s => s.n))]).range([6, 20]);
        const maxSubR = subRows.length ? Math.max(...subRows.map(s => subR(s.n))) : 10;
        const subLabelLines = subRows.map(d => wrapBubbleLabel(bubbleSubGroupLabel(selectedRow.risk_category, subGroupKey(d))));
        const CHAR_W = 5.6;
        const maxLabelWidth = subLabelLines.length
            ? Math.max(...subLabelLines.map(lines => Math.max(...lines.map(l => l.length)) * CHAR_W))
            : 0;
        const maxLabelLines = subLabelLines.length ? Math.max(1, ...subLabelLines.map(lines => lines.length)) : 1;
        const spacing = Math.max(maxSubR * 2 + 14, maxLabelWidth + 18);
        const totalWidth = Math.max(0, (subRows.length - 1) * spacing);
        let startX = parentX - totalWidth / 2;
        startX = Math.max(margin.left + maxSubR + 4, Math.min(startX, width - margin.right - maxSubR - 4 - totalWidth));
        const labelDepth = 14 + Math.max(0, maxLabelLines - 1) * 11;
        const parentR = r(selectedRow.applicable_episodes);
        const clusterY = Math.min(
            height - margin.bottom - maxSubR - 28,
            parentY + parentR + maxSubR + labelDepth + 36
        );
        const axisY = height - margin.bottom;
        const elbowY = axisY - 22;

        layer.selectAll('*').remove();
        layer.append('line').attr('x1', parentX).attr('y1', parentY).attr('x2', parentX).attr('y2', clusterY - maxSubR - labelDepth - 8)
            .attr('stroke', 'var(--navy)').attr('stroke-width', 1.5).attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', fromParent ? 0 : 1)
            .transition().duration(dur).attr('stroke-opacity', 1);

        const nodes = subRows.map((d, i) => ({ ...d, tx: startX + i * spacing, ty: clusterY, key: subGroupKey(d) }));
        layer.selectAll('path.sub-leader').data(nodes, d => d.key).join('path')
            .attr('class', 'sub-leader')
            .attr('fill', 'none')
            .attr('stroke', plotColor('on-surface-variant'))
            .attr('stroke-width', 1.25)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .style('pointer-events', 'none')
            .attr('d', d => {
                const xAxis = x(d.gap_rate);
                const y0 = d.ty + subR(d.n);
                return `M ${d.tx} ${y0} L ${xAxis} ${elbowY} L ${xAxis} ${axisY}`;
            })
            .attr('stroke-opacity', fromParent ? 0 : 0.4)
            .transition().duration(dur).attr('stroke-opacity', 0.4);
        const subGroup = layer.selectAll('g.sub-bubble').data(nodes, d => d.key).join('g')
            .attr('class', 'sub-bubble')
            .attr('transform', d => fromParent ? `translate(${parentX},${parentY})` : `translate(${d.tx},${d.ty})`);
        subGroup.transition().duration(dur).attr('transform', d => `translate(${d.tx},${d.ty})`);

        subGroup.append('circle')
            .attr('r', d => subR(d.n))
            .attr('fill', d => subGroupColor(d))
            .attr('fill-opacity', d => !selectedSub ? 0.85 : (d.key === selectedSub ? 0.95 : 0.18))
            .attr('stroke', d => d.key === selectedSub ? 'var(--navy)' : plotColor('surface-container-lowest'))
            .attr('stroke-width', d => d.key === selectedSub ? 2.5 : 1.3)
            .style('cursor', 'pointer')
            .on('mousemove', function(event, d) {
                const rect = el.getBoundingClientRect();
                const label = bubbleSubGroupLabel(selectedRow.risk_category, d.key);
                const groupEps = baseFilteredEpisodes().filter(ep => {
                    if (!episodeRiskCategoryStatus(ep, selectedRow.risk_category)) return false;
                    return splitBy === 'clinician' ? ep.clinician_id === d.key : ep.procedure === d.key;
                });
                const withCore = groupEps.filter(ep => ep.core_risk_pct != null);
                const avg = withCore.length ? Math.round(withCore.reduce((s, ep) => s + ep.core_risk_pct, 0) / withCore.length) : null;
                const cats = groupEps.map(ep => jitterCategory(ep)).filter(Boolean);
                const dominant = cats.sort((a, b) => cats.filter(c => c === b).length - cats.filter(c => c === a).length)[0] || 'N/A';
                tooltip.html(
                    `<strong>${escHtml(label)}</strong><br>` +
                    `Core risks ${avg == null ? 'N/A' : avg + '%'} · ${escHtml(dominant)}<br>` +
                    `${d.gap_rate}% gap · n=${d.n}<br>` +
                    `<em>${d.key === selectedSub ? 'Click to deselect' : 'Click to see episodes'}</em>`
                ).style('left', `${event.clientX - rect.left + 12}px`).style('top', `${event.clientY - rect.top - 18}px`).style('opacity', 1);
            })
            .on('mouseleave', () => tooltip.style('opacity', 0))
            .on('click', (event, d) => {
                event.preventDefault();
                event.stopPropagation();
                selectBubbleSubGroup(d.key);
            });

        subGroup.append('text')
            .attr('y', d => {
                const lines = wrapBubbleLabel(bubbleSubGroupLabel(selectedRow.risk_category, d.key));
                return -subR(d.n) - 6 - (lines.length - 1) * 11;
            })
            .attr('text-anchor', 'middle')
            .style('font-size', '11px').style('font-weight', 700).attr('fill', plotColor('on-surface-variant'))
            .style('pointer-events', 'none').attr('stroke', plotColor('surface-container-lowest')).attr('stroke-width', 3).style('paint-order', 'stroke')
            .each(function(d) {
                const lines = wrapBubbleLabel(bubbleSubGroupLabel(selectedRow.risk_category, d.key));
                d3.select(this).selectAll('tspan').data(lines).join('tspan')
                    .attr('x', 0).attr('dy', (line, i) => i === 0 ? 0 : 11).text(line => line);
            });
        subGroup.raise();

        if (!subRows.length) {
            layer.append('text').attr('x', parentX).attr('y', clusterY).attr('text-anchor', 'middle')
                .style('font-size', '11px').style('font-style', 'italic').attr('fill', plotColor('outline'))
                .text('Not enough episodes per group to split this category yet.');
        }
        labelG.raise();
    };

    if (expand && selectedRow) {
        if (sameZoom && !liveSub.selectAll('g.sub-bubble').empty()) {
            liveSub.selectAll('g.sub-bubble circle')
                .transition().duration(220)
                .attr('fill-opacity', d => !selectedSub ? 0.85 : (d.key === selectedSub ? 0.95 : 0.18))
                .attr('stroke', d => d.key === selectedSub ? 'var(--navy)' : plotColor('surface-container-lowest'))
                .attr('stroke-width', d => d.key === selectedSub ? 2.5 : 1.3);
        } else {
            drawSubCluster(liveSub, true);
        }
        if (selectedSub) liveSub.selectAll('g.sub-bubble').filter(d => d.key === selectedSub).raise();
    } else if (!collapsing) {
        liveSub.selectAll('*').remove();
    }

    renderRiskBubbleZoomPanel();
}

// Ordinal win-rate dot + 95% bootstrap CI plot: one row per procedure,
// centered on a 50% peer-reference line (Jacob's implementation summary
// steps A-D, computed server-side in procedure_analytics.py).
function wrapFramingLabel(text, maxChars = 28) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let current = '';
    words.forEach(word => {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxChars && current) {
            lines.push(current);
            current = word;
        } else current = next;
    });
    if (current) lines.push(current);
    return lines.slice(0, 3);
}

function renderFramingDotPlot(rows) {
    const el = document.getElementById('framingDotPlot');
    if (!el || typeof d3 === 'undefined') return;
    el.innerHTML = '';
    if (!rows || !rows.length) {
        el.innerHTML = '<p class="jitter-hint">Not enough interventions with eligible episodes yet for a peer comparison.</p>';
        return;
    }

    const width = Math.max(el.clientWidth || 1000, 760);
    const rowHeight = DEMO_PAGE ? 58 : 46;
    const margin = DEMO_PAGE
        ? { top: 56, right: 70, bottom: 28, left: 280 }
        : { top: 56, right: 70, bottom: 40, left: 240 };
    const height = margin.top + margin.bottom + rowHeight * rows.length;

    const tooltip = d3.select(el).append('div').attr('class', 'beeswarm-tooltip');
    const svg = d3.select(el).append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img')
        .attr('aria-label', 'Decision framing win-rate by intervention, relative to peer interventions');
    const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const y = d3.scalePoint().domain(rows.map(r => r.procedure)).range([margin.top, height - margin.bottom]).padding(0.6);

    svg.append('g').attr('transform', `translate(0,${margin.top - 16})`)
        .call(d3.axisTop(x).ticks(5).tickFormat(d => `${d}%`))
        .call(g => g.select('.domain').attr('stroke', plotColor('outline-variant')))
        .selectAll('text').attr('fill', plotColor('on-surface-variant')).style('font-size', '11px');

    if (!DEMO_PAGE) {
        svg.append('line').attr('x1', x(50)).attr('x2', x(50)).attr('y1', margin.top - 24).attr('y2', height - margin.bottom + 8)
            .attr('stroke', plotColor('outline')).attr('stroke-dasharray', '4,4');
        svg.append('text').attr('x', margin.left).attr('y', margin.top - 34).attr('text-anchor', 'start')
            .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.06em').attr('fill', plotColor('on-surface-variant'))
            .text('← MORE SINGLE-OPTION FRAMING');
        svg.append('text').attr('x', width - margin.right).attr('y', margin.top - 34).attr('text-anchor', 'end')
            .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.06em').attr('fill', plotColor('on-surface-variant'))
            .text('MORE COMPARATIVE FRAMING →');
    } else {
        svg.append('text').attr('x', margin.left).attr('y', margin.top - 34).attr('text-anchor', 'start')
            .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.06em').attr('fill', plotColor('on-surface-variant'))
            .text('← Less comparative discussion');
        svg.append('text').attr('x', width - margin.right).attr('y', margin.top - 34).attr('text-anchor', 'end')
            .style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.06em').attr('fill', plotColor('on-surface-variant'))
            .text('More comparative discussion →');
    }

    const row = svg.append('g').selectAll('g').data(rows).join('g').attr('transform', d => `translate(0,${y(d.procedure)})`);

    const label = row.append('text').attr('x', margin.left - 16).attr('y', 5).attr('text-anchor', 'end')
        .style('font-size', '12.5px').style('font-weight', 700).attr('fill', plotColor('on-surface'));
    label.each(function(d) {
        const lines = wrapFramingLabel(demoProcedureLabel(d.procedure));
        d3.select(this).attr('y', lines.length > 1 ? -6 : 5);
        d3.select(this).selectAll('tspan').data(lines).join('tspan')
            .attr('x', margin.left - 16).attr('dy', (line, i) => i === 0 ? 0 : 14).text(line => line);
    });

    row.append('line').attr('x1', d => x(d.ci_low)).attr('x2', d => x(d.ci_high)).attr('y1', 0).attr('y2', 0)
        .attr('stroke', plotColor('outline')).attr('stroke-width', 2);
    row.append('line').attr('x1', d => x(d.ci_low)).attr('x2', d => x(d.ci_low)).attr('y1', -5).attr('y2', 5).attr('stroke', plotColor('outline')).attr('stroke-width', 2);
    row.append('line').attr('x1', d => x(d.ci_high)).attr('x2', d => x(d.ci_high)).attr('y1', -5).attr('y2', 5).attr('stroke', plotColor('outline')).attr('stroke-width', 2);

    const framingDot = RISK_CATEGORY_COLORS('Neurologic / sensory injury');
    row.append('circle').attr('cx', d => x(d.score)).attr('cy', 0).attr('r', 7)
        .attr('fill', d => DEMO_PAGE ? magentaByRate(d.score) : framingDot)
        .attr('fill-opacity', DEMO_PAGE ? 1 : 0.75)
        .attr('stroke', plotColor('surface-container-lowest')).attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mousemove', function(event, d) {
            const rect = el.getBoundingClientRect();
            tooltip.html(
                `<strong>${escHtml(demoProcedureLabel(d.procedure))}</strong><br>` +
                `${d.score}% win-rate vs. peers (95% CI ${d.ci_low}–${d.ci_high}%)<br>` +
                `n=${d.n} episodes`
            ).style('left', `${event.clientX - rect.left + 12}px`).style('top', `${event.clientY - rect.top - 18}px`).style('opacity', 1);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0))
        .on('click', (_, d) => navGoTo('procedure', d.procedure));

    row.append('text').attr('x', width - margin.right + 14).attr('y', 5).attr('text-anchor', 'start')
        .style('font-size', '11px').style('font-weight', 700).attr('fill', plotColor('on-surface-variant'))
        .text(d => `n=${d.n}`);
}

// Five-number summary (min/Q1/median/Q3/max) plus 1.5xIQR whiskers and
// outliers beyond them — the standard box-and-whisker definition.
function boxPlotStats(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    const q1 = d3.quantile(sorted, 0.25);
    const median = d3.quantile(sorted, 0.5);
    const q3 = d3.quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr, upperFence = q3 + 1.5 * iqr;
    const inFence = sorted.filter(v => v >= lowerFence && v <= upperFence);
    const whiskerLow = inFence.length ? inFence[0] : sorted[0];
    const whiskerHigh = inFence.length ? inFence[inFence.length - 1] : sorted[sorted.length - 1];
    const outliers = sorted.filter(v => v < whiskerLow || v > whiskerHigh);
    return { q1, median, q3, whiskerLow, whiskerHigh, outliers, n: sorted.length };
}

function selectBoxPlotGroup(category, clinicianId) {
    navGoTo('box', `${category}|||${clinicianId}`);
}

function renderBoxPlotZoomPanel() {
    parkInlineEpisodeSlot();
    const panel = document.getElementById('boxPlotZoomPanel');
    if (!panel) return;
    if (!NAV.boxCategory || !NAV.boxClinicianId) {
        panel.innerHTML = '';
        restoreInlineEpisodeIfOpen();
        return;
    }
    const category = NAV.boxCategory;
    const clinicianId = NAV.boxClinicianId;
    const clin = BOX_PLOT_CLINICIANS.find(c => c.id === clinicianId);
    const episodes = BOX_PLOT_EPISODES.filter(ep => ep.clinician_id === clinicianId && jitterCategory(ep) === category);
    panel.innerHTML = renderEpisodeListPanel(`${clin ? clin.name : 'Clinician'} — ${category}`, episodes);
    bindEpisodePeeks();
    restoreInlineEpisodeIfOpen();
}

// Small-multiples box plot: same x-axis (4 discussion categories) and y-axis
// (% core risks discussed) as the old jitter plot, but every clinician gets
// a box-and-whisker glyph side by side in each category lane, so the
// department-wide pattern and per-clinician spread are both visible without
// a drill-down step. Click a box to see the episodes behind it.
function renderBoxPlot(episodes, clinicians, selectedClinicianId) {
    const el = document.getElementById('boxPlot');
    if (!el || typeof d3 === 'undefined') return;

    const clinicianList = clinicians || [];
    BOX_PLOT_EPISODES = episodes || [];
    BOX_PLOT_CLINICIANS = clinicianList;
    const width = Math.max(el.clientWidth || 1000, 760);
    const height = 520;
    const margin = { top: 28, right: CHART_LANE_MARGIN.right, bottom: 78, left: CHART_LANE_MARGIN.left };

    el.innerHTML = '';
    const tooltip = d3.select(el).append('div').attr('class', 'beeswarm-tooltip');

    const svg = d3.select(el)
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('role', 'img')
        .style('font-family', 'inherit')
        .attr('aria-label', 'Box plots of percentage of core risks discussed, by clinician and discussion category');

    const x = chartLaneScale(width);
    const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`).tickSize(-(width - margin.left - margin.right));
    const yGroup = svg.append('g').attr('transform', `translate(${margin.left},0)`).call(yAxis);
    yGroup.select('.domain').remove();
    yGroup.selectAll('.tick line').attr('stroke', plotColor('outline-variant'));
    yGroup.selectAll('.tick text').attr('fill', plotColor('on-surface-variant')).style('font-size', '11px').style('font-weight', 700);

    const xAxis = d3.axisBottom(x).tickSize(0).tickPadding(16);
    const xGroup = svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis);
    xGroup.select('.domain').attr('stroke', plotColor('outline-variant'));
    xGroup.selectAll('.tick text').attr('fill', plotColor('on-surface')).style('font-size', '11px').style('font-weight', 500)
        .style('letter-spacing', '0');

    svg.append('text').attr('x', (margin.left + width - margin.right) / 2).attr('y', height - 12).attr('text-anchor', 'middle')
        .attr('fill', plotColor('on-surface-variant')).style('font-size', '11px').style('font-weight', 500).style('letter-spacing', '0.18em')
        .text('TREATMENT OPTION DISCUSSION CATEGORY');
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(margin.top + height - margin.bottom) / 2).attr('y', 14)
        .attr('text-anchor', 'middle').attr('fill', plotColor('on-surface-variant')).style('font-size', '11px').style('font-weight', 500)
        .style('letter-spacing', '0.18em').text('% CORE RISKS DISCUSSED');

    const laneHalfWidth = Math.min(70, (x.step ? x.step() : 160) * 0.42);
    const slotWidth = (2 * laneHalfWidth) / Math.max(1, clinicianList.length);
    const boxWidth = Math.min(26, slotWidth * 0.72);

    DISCUSSION_CATEGORIES.forEach(category => {
        const laneX = x(category);
        clinicianList.forEach((clin, i) => {
            const values = (episodes || [])
                .filter(ep => ep.clinician_id === clin.id && jitterCategory(ep) === category && ep.core_risk_pct != null)
                .map(ep => ep.core_risk_pct);
            if (!values.length) return;
            const stats = boxPlotStats(values);
            const cx = laneX - laneHalfWidth + slotWidth * (i + 0.5);
            const isBoxSelected = NAV.boxCategory === category && NAV.boxClinicianId === clin.id;
            const isLegendSelected = selectedClinicianId === clin.id;
            const keepVisible = new Set([NAV.boxClinicianId, selectedClinicianId].filter(Boolean));
            const isDimmed = keepVisible.size ? !keepVisible.has(clin.id) : false;
            const opacity = isDimmed ? 0.16 : 0.85;
            const strokeWidth = isBoxSelected || isLegendSelected ? 2.2 : 1.2;

            const g = svg.append('g').attr('class', 'box-glyph').style('cursor', 'pointer')
                .attr('data-category', category).attr('data-clinician', clin.id)
                .attr('tabindex', 0).attr('role', 'button')
                .attr('aria-label', `${clin.name}, ${category}: median ${Math.round(stats.median)}%, n=${stats.n}`)
                .on('click', () => selectBoxPlotGroup(category, clin.id))
                .on('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectBoxPlotGroup(category, clin.id); }
                })
                .on('mousemove', (event) => {
                    const rect = el.getBoundingClientRect();
                    const groupEps = (episodes || []).filter(ep => ep.clinician_id === clin.id && jitterCategory(ep) === category);
                    const cats = groupEps.map(ep => jitterCategory(ep)).filter(Boolean);
                    tooltip.html(
                        `<strong>${escHtml(clin.name)}</strong> — ${escHtml(category)}<br>` +
                        `Core risks median ${Math.round(stats.median)}%<br>` +
                        `${escHtml(category)} · n=${stats.n}<br><em>Click to see episodes</em>`
                    ).style('left', `${event.clientX - rect.left + 12}px`).style('top', `${event.clientY - rect.top - 18}px`).style('opacity', 1);
                })
                .on('mouseleave', () => tooltip.style('opacity', 0));

            // Full-column invisible hit target so clicks/hovers register anywhere
            // in the glyph's visual footprint, not just on the thin strokes.
            g.append('rect').attr('x', cx - slotWidth / 2).attr('y', margin.top)
                .attr('width', slotWidth).attr('height', height - margin.bottom - margin.top)
                .attr('fill', 'transparent');

            g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', y(stats.whiskerLow)).attr('y2', y(stats.whiskerHigh))
                .attr('stroke', clin.color).attr('stroke-width', 1.4).attr('stroke-opacity', opacity);
            [stats.whiskerLow, stats.whiskerHigh].forEach(v => {
                g.append('line').attr('x1', cx - boxWidth * 0.28).attr('x2', cx + boxWidth * 0.28).attr('y1', y(v)).attr('y2', y(v))
                    .attr('stroke', clin.color).attr('stroke-width', 1.4).attr('stroke-opacity', opacity);
            });
            g.append('rect').attr('x', cx - boxWidth / 2).attr('y', y(stats.q3)).attr('width', boxWidth)
                .attr('height', Math.max(1, y(stats.q1) - y(stats.q3)))
                .attr('fill', clin.color).attr('fill-opacity', isDimmed ? 0.08 : 0.32)
                .attr('stroke', clin.color).attr('stroke-width', strokeWidth).attr('stroke-opacity', opacity);
            g.append('line').attr('x1', cx - boxWidth / 2).attr('x2', cx + boxWidth / 2).attr('y1', y(stats.median)).attr('y2', y(stats.median))
                .attr('stroke', clin.color).attr('stroke-width', isBoxSelected || isLegendSelected ? 2.6 : 2).attr('stroke-opacity', isDimmed ? 0.3 : 1);
            g.selectAll('.outlier').data(stats.outliers).join('circle')
                .attr('cx', cx).attr('cy', v => y(v)).attr('r', 2.6)
                .attr('fill', clin.color).attr('fill-opacity', opacity);
            g.append('text').attr('x', cx).attr('y', Math.max(margin.top + 10, y(stats.whiskerHigh) - 8)).attr('text-anchor', 'middle')
                .style('font-size', '11px').style('font-weight', 700).attr('fill', isDimmed ? plotColor('outline-variant') : plotColor('on-surface-variant'))
                .text(`n=${stats.n}`);
        });
    });
    renderBoxPlotZoomPanel();
}

function openEpisodeFromRow(event, episodeId) {
    const zoom = event?.currentTarget?.closest?.('.zoom-episode-panel');
    if (zoom && zoom.closest('#riskBubbleZoomPanel')) NAV.episodeAnchor = 'bubble';
    else if (zoom && zoom.closest('#boxPlotZoomPanel')) NAV.episodeAnchor = 'box';
    else NAV.episodeAnchor = 'table';
    navGoTo('episode', episodeId);
}

async function loadDepartmentPlots() {
    const [overviewRes, proceduresRes] = await Promise.all([
        fetch('/api/department/overview'),
        fetch('/api/department/procedures'),
    ]);
    if (!overviewRes.ok) throw new Error('The department overview could not be loaded.');
    DEPARTMENT_DATA = await overviewRes.json();
    DEPARTMENT_EPISODES = DEPARTMENT_DATA.episodes || [];
    DEPARTMENT_CLINICIANS = DEPARTMENT_DATA.clinicians || [];
    DEPARTMENT_PROCEDURE_DATA = proceduresRes.ok ? await proceduresRes.json() : { risk_categories: [], framing_scores: [] };
    return DEPARTMENT_DATA;
}

function departmentPlotState() {
    const selected = [...SELECTED_PROCEDURES];
    return {
        data: DEPARTMENT_DATA,
        episodes: listEpisodes(),
        clinicians: DEPARTMENT_CLINICIANS,
        procedures: procedureTabList(),
        days: DATE_RANGE_DAYS,
        source: NAV.dataSource,
        procedure: selected.length === 1 ? selected[0] : null,
        clinician: NAV.clinicianId,
    };
}

function setHomeFilters(next) {
    if (next && 'days' in next) DATE_RANGE_DAYS = next.days;
    if (next && 'source' in next) NAV.dataSource = next.source || 'all';
    if (next && 'procedure' in next) {
        const name = next.procedure || null;
        SELECTED_PROCEDURES = name ? new Set([name]) : new Set();
        NAV.procedure = name;
        if (name) {
            SANKEY_FOCUS_PROCEDURE = name;
            SANKEY_FOCUS_IS_AUTO = false;
        } else {
            SANKEY_FOCUS_IS_AUTO = true;
        }
        NAV.bubbleSubGroup = null;
        syncMapGrouping();
    }
    if (next && 'clinician' in next) NAV.clinicianId = next.clinician || null;
    refreshDepartmentDashboard();
}
