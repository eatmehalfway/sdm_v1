import { typescaleStyles } from './m3_components.js';

if (typescaleStyles?.styleSheet) {
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
}

const THEME_KEY = 'm3-cockpit-theme';
let openEpisodeId = null;
let episodesExpanded = false;

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[char]));
}

function categoryOf(episode) {
    const level = episode.tradeoff_level || episode.decision_framing || '';
    if (level === 'Single option' || level === 'Single option presented') return 'Single option';
    if (level === 'Minimally compared' || level === 'Not compared' || level === 'Limited comparison') return 'Minimally compared';
    if (level === 'Meaningfully compared' || level === 'Meaningful comparison') return 'Meaningfully compared';
    return level || null;
}

function chip(group, value, label, selected) {
    return `<md-filter-chip data-group="${esc(group)}" data-value="${esc(value)}" label="${esc(label)}" ${selected ? 'selected' : ''}></md-filter-chip>`;
}

function filterRow(title, html) {
    return `<div class="filter-row"><h2 class="md-typescale-label-large">${esc(title)}</h2><md-chip-set>${html}</md-chip-set></div>`;
}

function episodeRows(episodes) {
    const sorted = [...episodes].sort((a, b) => String(b.episode_date || '').localeCompare(String(a.episode_date || '')));
    if (!sorted.length) return '<p class="empty md-typescale-body-medium">No episodes match these filters.</p>';
    const body = sorted.map(episode => `
        <tr tabindex="0" data-episode="${esc(episode.episode_id)}" class="${episode.episode_id === openEpisodeId ? 'is-open' : ''}">
            <td class="md-typescale-body-medium">${esc(episode.patient_label || 'Patient')}</td>
            <td class="md-typescale-body-medium">${esc(episode.clinician_name || '—')}</td>
            <td class="md-typescale-body-medium">${esc(episode.procedure || '—')}</td>
            <td class="md-typescale-body-medium">${episode.core_risk_pct == null ? '—' : `${episode.core_risk_pct}%`}</td>
            <td class="md-typescale-body-medium">${episode.completeness_pct == null ? '—' : `${episode.completeness_pct}%`}</td>
            <td class="md-typescale-body-medium">${esc(categoryOf(episode) || '—')}</td>
            <td class="md-typescale-body-medium">${esc(episode.status || '—')}</td>
        </tr>
    `).join('');
    return `<div class="episodes"><table>
        <thead><tr>
            <th class="md-typescale-label-medium" scope="col">Patient</th>
            <th class="md-typescale-label-medium" scope="col">Clinician</th>
            <th class="md-typescale-label-medium" scope="col">Intervention</th>
            <th class="md-typescale-label-medium" scope="col">Core risks</th>
            <th class="md-typescale-label-medium" scope="col">Completeness</th>
            <th class="md-typescale-label-medium" scope="col">Discussion</th>
            <th class="md-typescale-label-medium" scope="col">Status</th>
        </tr></thead>
        <tbody>${body}</tbody>
    </table></div>`;
}

function render() {
    const snap = window.departmentPlotState();
    const episodes = snap.episodes || [];
    const clinicians = snap.clinicians || [];
    document.getElementById('main').innerHTML = `
        <section class="filters" aria-label="Filters">
            ${filterRow('Time', [
                chip('days', '', 'All time', snap.days == null),
                chip('days', '30', '30 days', snap.days === 30),
                chip('days', '60', '60 days', snap.days === 60),
                chip('days', '90', '90 days', snap.days === 90),
            ].join(''))}
            ${filterRow('Source', [
                chip('source', 'all', 'All sources', snap.source === 'all'),
                chip('source', 'saved', 'Saved runs', snap.source === 'saved'),
                chip('source', 'demo', 'Demo', snap.source === 'demo'),
            ].join(''))}
            ${filterRow('Clinician', [
                chip('clinician', '', 'All clinicians', !snap.clinician),
                ...clinicians.map(person => chip('clinician', person.id, person.name, snap.clinician === person.id)),
            ].join(''))}
            ${filterRow('Intervention', [
                chip('procedure', '', 'All interventions', !snap.procedure),
                ...(snap.procedures || []).map(name => chip('procedure', name, name, snap.procedure === name)),
            ].join(''))}
        </section>
        <div id="plotHost"></div>
        <section class="card episode-card${episodesExpanded ? ' is-open' : ''}" aria-label="Episodes">
            <h2>
                <button type="button" class="episode-toggle" aria-expanded="${episodesExpanded ? 'true' : 'false'}" aria-controls="episodeList">
                    <span class="md-typescale-title-medium">${episodes.length} episode${episodes.length === 1 ? '' : 's'}</span>
                    <md-icon aria-hidden="true">${episodesExpanded ? 'expand_less' : 'expand_more'}</md-icon>
                </button>
            </h2>
            <div id="episodeList"${episodesExpanded ? '' : ' hidden'}>
                ${episodeRows(episodes)}
            </div>
        </section>
    `;
    const paint = () => {
        window.__v2PaintingPlots = true;
        try { window.refreshDepartmentDashboard(); }
        finally { window.__v2PaintingPlots = false; }
    };
    paint();
    requestAnimationFrame(paint);
}

function openCockpit(id, scroll) {
    if (!id) return;
    openEpisodeId = id;
    const slot = document.getElementById('cockpitSlot');
    const frame = document.getElementById('cockpitFrame');
    const src = `/styles/m3?episode=${encodeURIComponent(id)}`;
    if (frame.getAttribute('src') !== src) frame.src = src;
    slot.hidden = false;
    document.querySelectorAll('tr[data-episode]').forEach(row => {
        row.classList.toggle('is-open', row.dataset.episode === id);
    });
    if (scroll) slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeCockpit() {
    openEpisodeId = null;
    const slot = document.getElementById('cockpitSlot');
    const frame = document.getElementById('cockpitFrame');
    slot.hidden = true;
    frame.removeAttribute('src');
    document.querySelectorAll('tr[data-episode].is-open').forEach(row => row.classList.remove('is-open'));
}

function applyFilter(group, value) {
    if (group === 'days') window.setHomeFilters({ days: value ? Number(value) : null });
    else if (group === 'source') window.setHomeFilters({ source: value || 'all' });
    else if (group === 'procedure') window.setHomeFilters({ procedure: value });
    else if (group === 'clinician') window.setHomeFilters({ clinician: value });
    else if (group === 'legend-clinician') window.toggleClinicianFilter(value);
}

function bind() {
    document.getElementById('main').addEventListener('click', event => {
        if (event.target.closest('[data-action="new-analysis"]')) {
            event.preventDefault();
            openRunDialog();
            return;
        }
        if (event.target.closest('.episode-toggle')) {
            episodesExpanded = !episodesExpanded;
            const card = document.querySelector('.episode-card');
            const button = card?.querySelector('.episode-toggle');
            const list = document.getElementById('episodeList');
            const icon = button?.querySelector('md-icon');
            card?.classList.toggle('is-open', episodesExpanded);
            if (button) button.setAttribute('aria-expanded', episodesExpanded ? 'true' : 'false');
            if (list) list.hidden = !episodesExpanded;
            if (icon) icon.textContent = episodesExpanded ? 'expand_less' : 'expand_more';
            return;
        }
        const chipEl = event.target.closest('md-filter-chip');
        if (chipEl) {
            applyFilter(chipEl.dataset.group, chipEl.dataset.value || null);
            return;
        }
        const row = event.target.closest('tr[data-episode]');
        if (row) openCockpit(row.dataset.episode, true);
    });
    document.getElementById('main').addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const row = event.target.closest('tr[data-episode]');
        if (!row) return;
        event.preventDefault();
        openCockpit(row.dataset.episode, true);
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    const button = document.getElementById('themeToggle');
    const icon = button?.querySelector('md-icon');
    const dark = theme === 'dark';
    if (icon) icon.textContent = dark ? 'light_mode' : 'dark_mode';
    if (button) button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.getElementById('cockpitFrame')?.contentWindow?.postMessage({ type: 'v2-theme', theme }, location.origin);
    if (document.getElementById('plotHost')?.childElementCount) {
        requestAnimationFrame(() => {
            window.__v2PaintingPlots = true;
            try { window.refreshDepartmentDashboard(); }
            finally { window.__v2PaintingPlots = false; }
        });
    }
}

async function load() {
    await window.loadDepartmentPlots();
    document.getElementById('loading').hidden = true;
    render();
}

window.v2Rerender = render;
window.v2OpenCockpit = id => openCockpit(id, true);
window.v2CloseCockpit = closeCockpit;

const stored = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(stored || (prefersDark ? 'dark' : 'light'));
document.getElementById('themeToggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
let analysisRunning = false;
let engineReady = null;

function engineDocument() {
    const frame = document.getElementById('analysisEngine');
    return frame?.contentDocument || null;
}

function ensureEngine() {
    const frame = document.getElementById('analysisEngine');
    if (engineReady) return engineReady;
    engineReady = new Promise((resolve, reject) => {
        const done = () => {
            if (frame.contentWindow?.runAnalysis) resolve(frame.contentWindow);
            else reject(new Error('The analysis engine did not load.'));
        };
        frame.addEventListener('load', done, { once: true });
        frame.src = '/compare?v2engine=1';
    });
    return engineReady;
}

function assignFiles(input, files) {
    const transfer = new DataTransfer();
    [...files].forEach(file => transfer.items.add(file));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

function syncProcedureOptions() {
    const remote = engineDocument()?.getElementById('procedureSelect');
    const local = document.getElementById('runProcedure');
    if (!remote || !local) return;
    const current = local.value || 'AUTO';
    local.innerHTML = [...remote.options].map(option => `<option value="${esc(option.value)}">${esc(option.textContent)}</option>`).join('');
    if ([...local.options].some(option => option.value === current)) local.value = current;
}

function waitForMapping(doc) {
    return new Promise((resolve, reject) => {
        const started = Date.now();
        const timer = setInterval(() => {
            const message = doc.getElementById('excelStatusMsg')?.innerText || '';
            if (/Loaded Successfully/.test(message)) {
                clearInterval(timer);
                resolve();
            } else if (/Error/.test(message)) {
                clearInterval(timer);
                reject(new Error(message));
            } else if (Date.now() - started > 20000) {
                clearInterval(timer);
                reject(new Error('The mapping file took too long to read.'));
            }
        }, 100);
    });
}

function setRunError(message) {
    const error = document.getElementById('runError');
    error.hidden = !message;
    error.textContent = message || '';
}

function addRunStatus(message) {
    const log = document.getElementById('runLog');
    const line = document.createElement('div');
    line.textContent = message;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

function openRunDialog() {
    const dialog = document.getElementById('runDialog');
    dialog.hidden = false;
    document.getElementById('runGeminiKey').value = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('runJevKey').value = localStorage.getItem('jev_api_key') || '';
    document.getElementById('runGeminiModel').value = localStorage.getItem('gemini_model') || 'gemini-3.8-flash';
    document.getElementById('runJevModel').value = localStorage.getItem('jev_model') || 'jev-latest';
    document.getElementById('runGeminiEndpoint').value = localStorage.getItem('gemini_endpoint') || 'https://generativelanguage.googleapis.com/v1beta';
    document.getElementById('runJevEndpoint').value = localStorage.getItem('jev_endpoint') || 'https://api.typesafe.ai/v1/systemone';
    setRunError('');
    document.getElementById('runGeminiKey').focus();
    ensureEngine().then(syncProcedureOptions).catch(error => setRunError(error.message));
}

function closeRunDialog() {
    if (analysisRunning) return;
    document.getElementById('runDialog').hidden = true;
}

async function startAnalysis(event) {
    event.preventDefault();
    if (analysisRunning) return;
    const transcripts = document.getElementById('runTranscripts').files;
    const geminiKey = document.getElementById('runGeminiKey').value.trim();
    const jevKey = document.getElementById('runJevKey').value.trim();
    if (!geminiKey || !jevKey) {
        setRunError('Gemini and Jev API keys are both required.');
        return;
    }
    if (!transcripts.length) {
        setRunError('Choose at least one transcript.');
        return;
    }
    analysisRunning = true;
    document.getElementById('startRun').disabled = true;
    document.getElementById('loading').hidden = false;
    setRunError('');
    document.getElementById('runLog').replaceChildren();
    addRunStatus('Starting Gemini and Jev.');
    try {
        const win = await ensureEngine();
        const doc = win.document;
        doc.getElementById('compareGeminiKey').value = geminiKey;
        doc.getElementById('apiKey').value = geminiKey;
        doc.getElementById('jevKey').value = jevKey;
        doc.getElementById('geminiModel').value = document.getElementById('runGeminiModel').value.trim() || 'gemini-3.8-flash';
        doc.getElementById('jevModel').value = document.getElementById('runJevModel').value.trim() || 'jev-latest';
        doc.getElementById('geminiEndpoint').value = document.getElementById('runGeminiEndpoint').value.trim();
        doc.getElementById('jevEndpoint').value = document.getElementById('runJevEndpoint').value.trim();
        doc.getElementById('totalEncounters').value = document.getElementById('runEncounters').value;
        const excel = document.getElementById('runExcel').files;
        if (excel.length) {
            doc.getElementById('excelStatusMsg').innerText = '';
            assignFiles(doc.getElementById('excelInput'), excel);
            await waitForMapping(doc);
            syncProcedureOptions();
        }
        doc.getElementById('procedureSelect').value = document.getElementById('runProcedure').value || 'AUTO';
        assignFiles(doc.getElementById('fileInput'), transcripts);
        localStorage.setItem('gemini_api_key', geminiKey);
        localStorage.setItem('jev_api_key', jevKey);
        localStorage.setItem('gemini_model', doc.getElementById('geminiModel').value);
        localStorage.setItem('jev_model', doc.getElementById('jevModel').value);
        localStorage.setItem('gemini_endpoint', doc.getElementById('geminiEndpoint').value);
        localStorage.setItem('jev_endpoint', doc.getElementById('jevEndpoint').value);
        await win.runAnalysis();
    } catch (error) {
        analysisRunning = false;
        document.getElementById('startRun').disabled = false;
        document.getElementById('loading').hidden = true;
        setRunError(error.message || 'The analysis failed.');
    }
}

window.addEventListener('message', async event => {
    if (event.origin !== location.origin) return;
    const data = event.data || {};
    if (data.type === 'v2-run-status') addRunStatus(data.message);
    if (data.type === 'v2-run-error') {
        analysisRunning = false;
        document.getElementById('startRun').disabled = false;
        document.getElementById('loading').hidden = true;
        setRunError(data.message || 'The analysis failed.');
    }
    if (data.type === 'v2-run-done') {
        analysisRunning = false;
        document.getElementById('startRun').disabled = false;
        document.getElementById('loading').hidden = true;
        document.getElementById('runDialog').hidden = true;
        await window.loadDepartmentPlots();
        render();
        if (data.id) openCockpit(`run_${data.id}`, true);
    }
});

document.getElementById('cancelRun')?.addEventListener('click', closeRunDialog);
document.getElementById('runScrim')?.addEventListener('click', closeRunDialog);
document.getElementById('runForm')?.addEventListener('submit', startAnalysis);
document.getElementById('runExcel')?.addEventListener('change', async () => {
    const files = document.getElementById('runExcel').files;
    if (!files.length) return;
    try {
        const win = await ensureEngine();
        win.document.getElementById('excelStatusMsg').innerText = '';
        assignFiles(win.document.getElementById('excelInput'), files);
        await waitForMapping(win.document);
        syncProcedureOptions();
    } catch (error) {
        setRunError(error.message);
    }
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeRunDialog();
});

document.getElementById('refreshDepartment')?.addEventListener('click', async () => {
    const bar = document.getElementById('loading');
    if (bar) bar.hidden = false;
    try {
        await window.loadDepartmentPlots();
        render();
    } catch (error) {
        document.getElementById('main').innerHTML = `<article class="card"><h2 class="md-typescale-title-medium">Could not load the department</h2><p class="md-typescale-body-medium">${esc(error.message)}</p></article>`;
    } finally {
        if (bar) bar.hidden = true;
    }
});

document.getElementById('closeCockpit')?.addEventListener('click', closeCockpit);
bind();

load().catch(error => {
    document.getElementById('loading').hidden = true;
    document.getElementById('main').innerHTML = `<article class="card"><h2 class="md-typescale-title-medium">Could not load the department</h2><p class="md-typescale-body-medium">${esc(error.message)}</p></article>`;
});
