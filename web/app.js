/* ═══════════════════════════════════════════════════════════
   Facet Lab — Web App Controller
   ═══════════════════════════════════════════════════════════ */

import { generateOrchInstructions, generateFacetInstructions, generateOrchKnowledge, generateFacetKnowledge } from './generator.js';

const WIZARD_STEPS = ['discover', 'design', 'generate', 'activate'];

const state = {
  pillars: [],    // [{ id, label, domain, desc, checked, custom, customText }]
  customPillars: [], // [{ text: '' }]
  orchestrator: { name: '', style: '', description: '' },
  facets: [],     // [{ name, domain, role, description, pillarText, ... }]
};

// ─── Curated Pillar Catalog ───

const PILLAR_CATALOG = [
  { id: 'career',        label: 'Career & Professional Growth', domain: 'Career & Professional Growth',  desc: 'Job search, skill-building, networking, promotions, side projects' },
  { id: 'finance',       label: 'Personal Finance',             domain: 'Personal Finance',               desc: 'Budgeting, debt, saving, investing, expense tracking' },
  { id: 'health',        label: 'Health & Wellness',            domain: 'Health & Wellness',              desc: 'Exercise, nutrition, sleep, stress management, medical' },
  { id: 'calendar',      label: 'Calendar & Scheduling',        domain: 'Calendar & Time Management',     desc: 'Time management, deadlines, event planning, routine structure' },
  { id: 'relationships', label: 'Relationships & Social',       domain: 'Relationships & Social',         desc: 'Family, friendships, dating, social commitments, communication' },
  { id: 'learning',      label: 'Learning & Personal Growth',   domain: 'Learning & Personal Growth',     desc: 'Reading, courses, hobbies, self-improvement, curiosity' },
  { id: 'creative',      label: 'Creative Expression',          domain: 'Creative Expression',            desc: 'Writing, art, music, design, content creation' },
  { id: 'rest',          label: 'Rest & Recovery',              domain: 'Rest & Recovery',                desc: 'Sleep hygiene, downtime, recharging, boundaries with work' },
  { id: 'home',          label: 'Home & Environment',           domain: 'Home & Environment',             desc: 'Living space, chores, organization, pets, moving' },
  { id: 'spirituality',  label: 'Spirituality & Purpose',       domain: 'Spirituality & Purpose',         desc: 'Meditation, faith, meaning-making, values alignment' },
];

const NAME_SUGGESTIONS = {
  'Career & Professional Growth':  'e.g. Tony, Miranda, Forge, Scout',
  'Personal Finance':              'e.g. Peso, Mint, Vault, Ledger',
  'Health & Wellness':             'e.g. Maddy, Rocky, Pulse, Coach',
  'Calendar & Time Management':    'e.g. Dora, Tempo, Clio, Keeper',
  'Relationships & Social':        'e.g. Joy, Hearth, Luna, Haven',
  'Learning & Personal Growth':    'e.g. Hermione, Neo, Beacon, Lumen',
  'Creative Expression':           'e.g. Muse, Frida, Lyra, Bloom',
  'Rest & Recovery':               'e.g. Olaf, Serene, Harbor, Willow',
  'Home & Environment':            'e.g. Nester, Cove, Roost, Acre',
  'Spirituality & Purpose':        'e.g. Sage, Aurora, Compass, North',
};

const ROLE_SUGGESTIONS = {
  'Career & Professional Growth':  'Career Strategist',
  'Personal Finance':              'Financial Strategist',
  'Health & Wellness':             'Health & Wellness Coach',
  'Calendar & Time Management':    'Schedule Keeper',
  'Relationships & Social':        'Relationship Advisor',
  'Learning & Personal Growth':    'Learning Guide',
  'Creative Expression':           'Creative Director',
  'Rest & Recovery':               'Wellness Guardian',
  'Home & Environment':            'Home Manager',
  'Spirituality & Purpose':        'Mindfulness Guide',
};

// ─── Navigation ───

function goTo(sectionId) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  const indicator = document.getElementById('step-indicator');
  const stepIdx = WIZARD_STEPS.indexOf(sectionId);

  if (stepIdx >= 0) {
    indicator.classList.remove('hidden');
    indicator.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i === stepIdx) dot.classList.add('active');
      else if (i < stepIdx) dot.classList.add('done');
    });
  } else {
    indicator.classList.add('hidden');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Step 1: Discover ───

function initDiscover() {
  renderPillarGrid();
  renderCustomPillars();
}

function renderPillarGrid() {
  const grid = document.getElementById('pillars-grid');
  grid.innerHTML = '';
  PILLAR_CATALOG.forEach(p => {
    const checked = state.pillars.some(s => s.id === p.id);
    const card = document.createElement('label');
    card.className = `pillar-option${checked ? ' selected' : ''}`;
    card.innerHTML = `
      <input type="checkbox" value="${p.id}" ${checked ? 'checked' : ''}>
      <div class="pillar-option-content">
        <span class="pillar-option-label">${escapeHTML(p.label)}</span>
        <span class="pillar-option-desc">${escapeHTML(p.desc)}</span>
      </div>
    `;
    card.querySelector('input').addEventListener('change', e => {
      if (e.target.checked) {
        state.pillars.push({ ...p, checked: true, custom: false });
        card.classList.add('selected');
      } else {
        state.pillars = state.pillars.filter(s => s.id !== p.id);
        card.classList.remove('selected');
      }
    });
    grid.appendChild(card);
  });
}

function renderCustomPillars() {
  const container = document.getElementById('custom-pillars');
  container.innerHTML = '';
  state.customPillars.forEach((cp, i) => {
    const row = document.createElement('div');
    row.className = 'custom-pillar-row';
    row.innerHTML = `
      <input type="text"
             class="custom-pillar-input"
             placeholder="Other pillar — e.g. Travel & Adventure"
             value="${escapeAttr(cp.text)}"
             data-index="${i}">
      <button class="pillar-remove" data-index="${i}" title="Remove">×</button>
    `;
    row.querySelector('input').addEventListener('input', e => {
      state.customPillars[+e.target.dataset.index].text = e.target.value;
    });
    row.querySelector('.pillar-remove').addEventListener('click', e => {
      state.customPillars.splice(+e.target.dataset.index, 1);
      renderCustomPillars();
    });
    container.appendChild(row);
  });
}

function addCustomPillar() {
  state.customPillars.push({ text: '' });
  renderCustomPillars();
  const inputs = document.querySelectorAll('.custom-pillar-input');
  inputs[inputs.length - 1].focus();
}

function finishDiscover() {
  // Collect selected catalog pillars
  const selected = [...state.pillars];

  // Add non-empty custom pillars
  state.customPillars.forEach(cp => {
    const t = cp.text.trim();
    if (t) {
      selected.push({
        id: 'custom_' + t.toLowerCase().replace(/\s+/g, '_'),
        label: t,
        domain: t,
        desc: '',
        checked: true,
        custom: true,
      });
    }
  });

  if (selected.length < 2) {
    showError('pillars-grid', 'Please select at least 2 life pillars.');
    return;
  }

  state.pillars = selected;

  // Pre-populate facets from pillars
  state.facets = selected.map(p => ({
    name: '',
    domain: p.domain,
    role: ROLE_SUGGESTIONS[p.domain] || deriveRole(p.domain),
    description: '',
    pillarText: p.label,
    extensions: [],
    data_scope: {},
    external_sources: [],
  }));

  renderDesignFacets();
  goTo('design');
}

// ─── Step 2: Design ───

function renderDesignFacets() {
  const container = document.getElementById('facets-design-list');
  container.innerHTML = '';

  state.facets.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'facet-design-card';
    card.innerHTML = `
      <h4>Pillar: "${escapeHTML(f.pillarText)}"</h4>
      <div class="form-row">
        <div class="form-field">
          <label>Name</label>
          <input type="text" data-facet="${i}" data-field="name"
                 placeholder="${escapeAttr(NAME_SUGGESTIONS[f.domain] || 'e.g. Forge, Sage, Vault')}"
                 value="${escapeAttr(f.name)}">
        </div>
        <div class="form-field">
          <label>Domain</label>
          <input type="text" data-facet="${i}" data-field="domain"
                 placeholder="e.g. Personal Finance"
                 value="${escapeAttr(f.domain)}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Role Title</label>
          <input type="text" data-facet="${i}" data-field="role"
                 placeholder="${escapeAttr(ROLE_SUGGESTIONS[f.domain] || 'e.g. Specialist')}"
                 value="${escapeAttr(f.role)}">
        </div>
        <div class="form-field">
          <label>Personality</label>
          <select data-facet="${i}" data-field="personality"
                  onchange="app.toggleOtherInput('personality-other-${i}', this.value === 'Other')">
            <option value="">Choose…</option>
            <option value="Direct and no-nonsense" ${f.personality === 'Direct and no-nonsense' ? 'selected' : ''}>Direct &amp; no-nonsense</option>
            <option value="Warm and encouraging" ${f.personality === 'Warm and encouraging' ? 'selected' : ''}>Warm &amp; encouraging</option>
            <option value="Analytical and data-driven" ${f.personality === 'Analytical and data-driven' ? 'selected' : ''}>Analytical &amp; data-driven</option>
            <option value="Creative and exploratory" ${f.personality === 'Creative and exploratory' ? 'selected' : ''}>Creative &amp; exploratory</option>
            <option value="Tough-love motivator" ${f.personality === 'Tough-love motivator' ? 'selected' : ''}>Tough-love motivator</option>
            <option value="Calm and patient" ${f.personality === 'Calm and patient' ? 'selected' : ''}>Calm &amp; patient</option>
            <option value="Other">Other…</option>
          </select>
          <input type="text" id="personality-other-${i}"
                 placeholder="Describe this agent's personality…"
                 style="display:none;margin-top:.5rem"
                 data-facet="${i}" data-field="personality">
        </div>
      </div>
      <div class="form-field full">
        <label>Description <span class="hint">(what does this agent do?)</span></label>
        <textarea data-facet="${i}" data-field="description" rows="2"
                  placeholder="How does this agent think and communicate?">${escapeHTML(f.description)}</textarea>
      </div>
      <details class="data-access-details">
        <summary>Data Access ✦</summary>
        <div class="data-access-inner">
          <div class="form-field full">
            <label>Gemini Extensions</label>
            <div class="ext-checkboxes" data-facet="${i}">
              <label class="ext-opt"><input type="checkbox" value="google_workspace" ${(f.extensions||[]).includes('google_workspace') ? 'checked' : ''}> Workspace (Gmail, Sheets, Drive)</label>
              <label class="ext-opt"><input type="checkbox" value="google_calendar" ${(f.extensions||[]).includes('google_calendar') ? 'checked' : ''}> Calendar</label>
              <label class="ext-opt"><input type="checkbox" value="google_search" ${(f.extensions||[]).includes('google_search') ? 'checked' : ''}> Search</label>
              <label class="ext-opt"><input type="checkbox" value="google_maps" ${(f.extensions||[]).includes('google_maps') ? 'checked' : ''}> Maps</label>
              <label class="ext-opt"><input type="checkbox" value="youtube" ${(f.extensions||[]).includes('youtube') ? 'checked' : ''}> YouTube</label>
            </div>
          </div>
          <div class="form-field full">
            <label>Gmail Scope <span class="hint">(what emails should this agent read?)</span></label>
            <input type="text" data-facet="${i}" data-scope="gmail"
                   placeholder="e.g. Bank alerts, transaction receipts"
                   value="${escapeAttr((f.data_scope||{}).gmail || '')}">
          </div>
          <div class="form-field full">
            <label>Sheets Name <span class="hint">(a dedicated Google Sheet for this agent)</span></label>
            <input type="text" data-facet="${i}" data-scope="sheets"
                   placeholder="e.g. Facet Lab — ${escapeAttr(f.name || 'AgentName')}"
                   value="${escapeAttr((f.data_scope||{}).sheets || '')}">
          </div>
          <div class="form-field full">
            <label>External Apps <span class="hint">(non-Google apps that feed data to this agent)</span></label>
            <textarea data-facet="${i}" data-field="external_raw" rows="2"
                      placeholder="e.g. Vesync — paste device readings&#10;LinkedIn — job alert emails arrive automatically">${formatExternalSources(f.external_sources)}</textarea>
          </div>
        </div>
      </details>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('input[data-field], textarea[data-field], select[data-field]').forEach(el => {
    const evtType = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evtType, e => {
      const idx = +e.target.dataset.facet;
      const field = e.target.dataset.field;
      if (field === 'external_raw') {
        state.facets[idx].external_sources = parseExternalSources(e.target.value);
      } else if (field === 'personality' && e.target.tagName === 'SELECT' && e.target.value !== 'Other') {
        // When a named option is picked, clear any free-text and use the option value
        state.facets[idx][field] = e.target.value;
        const otherInput = document.getElementById(`personality-other-${idx}`);
        if (otherInput) otherInput.value = '';
      } else if (field === 'personality' && e.target.tagName === 'INPUT') {
        // Free-text personality — use what the user typed
        state.facets[idx][field] = e.target.value;
      } else {
        state.facets[idx][field] = e.target.value;
      }
      updatePreview();
    });
  });

  container.querySelectorAll('input[data-scope]').forEach(el => {
    el.addEventListener('input', e => {
      const idx = +e.target.dataset.facet;
      const key = e.target.dataset.scope;
      if (!state.facets[idx].data_scope) state.facets[idx].data_scope = {};
      state.facets[idx].data_scope[key] = e.target.value;
      updatePreview();
    });
  });

  container.querySelectorAll('.ext-checkboxes input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', e => {
      const idx = +e.target.closest('.ext-checkboxes').dataset.facet;
      const val = e.target.value;
      const exts = state.facets[idx].extensions || [];
      if (e.target.checked) {
        if (!exts.includes(val)) exts.push(val);
      } else {
        const pos = exts.indexOf(val);
        if (pos > -1) exts.splice(pos, 1);
      }
      state.facets[idx].extensions = exts;
      updatePreview();
    });
  });

  // Orchestrator fields
  document.getElementById('orch-name').value = state.orchestrator.name;
  document.getElementById('orch-style').value = state.orchestrator.style;
  document.getElementById('orch-desc').value = state.orchestrator.description;

  updatePreview();
}

function updatePreview() {
  // Read orchestrator fields live
  state.orchestrator.name = document.getElementById('orch-name')?.value || '';
  state.orchestrator.style = document.getElementById('orch-style')?.value || '';
  state.orchestrator.description = document.getElementById('orch-desc')?.value || '';

  const preview = document.getElementById('council-preview');
  if (!preview) return;

  let html = '';

  if (state.orchestrator.name.trim()) {
    html += `
      <div class="preview-card orch">
        <div class="preview-sparkle">✦</div>
        <div class="preview-name">${escapeHTML(state.orchestrator.name)}</div>
        <div class="preview-role">Orchestrator</div>
      </div>`;
  }

  state.facets.forEach(f => {
    if (f.name.trim()) {
      html += `
        <div class="preview-card">
          <div class="preview-sparkle">✦</div>
          <div class="preview-name">${escapeHTML(f.name)}</div>
          <div class="preview-role">${escapeHTML(f.role || f.domain || 'Facet')}</div>
        </div>`;
    }
  });

  preview.innerHTML = html || '<p style="color:var(--on-surface-2);font-size:.9rem;">Name your agents above to see the preview.</p>';
}

function finishDesign() {
  // Validate orchestrator
  const oName = state.orchestrator.name.trim();
  if (!oName) {
    showError('orch-name', 'Your Orchestrator needs a name.');
    document.getElementById('orch-name').focus();
    return;
  }

  // Validate facets
  for (let i = 0; i < state.facets.length; i++) {
    const f = state.facets[i];
    if (!f.name.trim()) {
      showError(`facets-design-list`, `Facet ${i + 1} needs a name.`);
      return;
    }
    if (!f.domain.trim()) {
      showError(`facets-design-list`, `Facet "${f.name}" needs a domain.`);
      return;
    }
  }

  // Compute orchestrator extensions as union of all facet extensions
  const allExts = new Set();
  state.facets.forEach(f => (f.extensions || []).forEach(e => allExts.add(e)));
  state.orchestrator.extensions = [...allExts];

  renderGemCards();
  goTo('generate');
}

// ─── Step 3: Generate ───

function renderGemCards() {
  const container = document.getElementById('gem-cards');
  container.innerHTML = '';

  const orch = state.orchestrator;
  const facets = state.facets;

  // Orchestrator card
  container.appendChild(createGemCard({
    name: orch.name,
    role: 'Orchestrator',
    isOrch: true,
    instructions: generateOrchInstructions(orch, facets),
    knowledge: generateOrchKnowledge(orch, facets),
  }));

  // Facet cards
  facets.forEach(f => {
    container.appendChild(createGemCard({
      name: f.name,
      role: f.role || f.domain,
      isOrch: false,
      instructions: generateFacetInstructions(f, orch, facets),
      knowledge: generateFacetKnowledge(f, orch, facets),
    }));
  });
}

function createGemCard({ name, role, isOrch, instructions, knowledge }) {
  const card = document.createElement('div');
  card.className = 'gem-card';

  const nameLower = name.toLowerCase().replace(/\s+/g, '_');

  card.innerHTML = `
    <div class="gem-card-header ${isOrch ? 'orch' : ''}">
      <div class="gem-card-sparkle">✦</div>
      <div class="gem-card-info">
        <h4>${escapeHTML(name)}</h4>
        <p>${escapeHTML(role)}</p>
      </div>
    </div>
    <div class="gem-card-body">
      <button class="btn ghost sm copy-btn">Copy Instructions</button>
      <button class="btn ghost sm download-btn">Download Knowledge File</button>
    </div>
  `;

  card.querySelector('.copy-btn').addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(instructions);
      e.target.textContent = '✓ Copied!';
      showToast('Instructions copied to clipboard!');
      setTimeout(() => { e.target.textContent = 'Copy Instructions'; }, 2000);
    } catch {
      fallbackCopy(instructions, e.target);
    }
  });

  card.querySelector('.download-btn').addEventListener('click', () => {
    downloadFile(`${nameLower}_knowledge.md`, knowledge);
    showToast(`Downloaded ${nameLower}_knowledge.md`);
  });

  return card;
}

// ─── Data Access Helpers ───

function formatExternalSources(sources) {
  if (!sources || !sources.length) return '';
  return sources.map(s => `${s.app} — ${s.ingest} ${s.format || ''}`.trim()).join('\n');
}

function parseExternalSources(raw) {
  if (!raw || !raw.trim()) return [];
  return raw.trim().split('\n').filter(Boolean).map(line => {
    const parts = line.split('—').map(s => s.trim());
    if (parts.length < 2) return { app: parts[0], ingest: 'paste', format: '' };
    const rest = parts.slice(1).join('—').trim();
    const ingestMatch = rest.match(/^(email_forward|paste|sheet_import|automation)\b/i);
    const ingest = ingestMatch ? ingestMatch[1].toLowerCase() : 'paste';
    const format = ingestMatch ? rest.slice(ingest.length).trim() : rest;
    return { app: parts[0], ingest, format };
  });
}

// ─── Utilities ───

// Derive a sensible role title from a free-text domain name.
// e.g. "Travel & Adventure" → "Travel & Adventure Specialist"
function deriveRole(domain) {
  if (!domain || !domain.trim()) return 'Specialist';
  const d = domain.trim();
  // If it already ends with a role-sounding word, use as-is
  if (/advisor|coach|guide|manager|director|keeper|guardian|strategist|specialist$/i.test(d)) return d;
  return d + ' Specialist';
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

function showError(nearId, msg) {
  // Remove old errors
  document.querySelectorAll('.error-msg').forEach(e => e.remove());
  const el = document.getElementById(nearId);
  if (el) {
    const err = document.createElement('div');
    err.className = 'error-msg';
    err.textContent = msg;
    el.parentElement.insertBefore(err, el.nextSibling);
    setTimeout(() => err.remove(), 4000);
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    btn.textContent = '✓ Copied!';
    showToast('Copied!');
  } catch {
    btn.textContent = 'Copy failed — select manually';
  }
  document.body.removeChild(ta);
  setTimeout(() => { btn.textContent = 'Copy Instructions'; }, 2000);
}

// ─── Init ───

function init() {
  initDiscover();

  // Live-update preview when orchestrator fields change
  ['orch-name', 'orch-style', 'orch-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
  });
}

// ─── Other-input reveal helpers ───

function toggleOtherInput(inputId, show) {
  const el = document.getElementById(inputId);
  if (el) el.style.display = show ? 'block' : 'none';
  if (!show && el) el.value = '';
}

function syncOtherInput(selectId, value) {
  // Write the free-text value back into the corresponding state field
  if (selectId === 'orch-style') {
    state.orchestrator.style = value;
    updatePreview();
  }
}

// ─── Public API ───

const app = { goTo, addCustomPillar, finishDiscover, finishDesign, toggleOtherInput, syncOtherInput };
window.app = app;

init();
