/* ═══════════════════════════════════════════════════════════
   Facet Lab — Web App Controller
   ═══════════════════════════════════════════════════════════ */

import { generateOrchInstructions, generateFacetInstructions, generateOrchKnowledge, generateFacetKnowledge } from './generator.js';

const WIZARD_STEPS = ['discover', 'design', 'generate', 'activate'];

const state = {
  pillars: [],    // [{ text: '' }]
  orchestrator: { name: '', style: '', description: '' },
  facets: [],     // [{ name, domain, role, description, pillarText }]
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
  if (state.pillars.length === 0) {
    state.pillars = [{ text: '' }, { text: '' }];
  }
  renderPillars();
}

function renderPillars() {
  const list = document.getElementById('pillars-list');
  list.innerHTML = '';
  state.pillars.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'pillar-card';
    card.innerHTML = `
      <div class="pillar-num">${i + 1}</div>
      <div class="pillar-input">
        <input type="text"
               placeholder="The part of me that…"
               value="${escapeAttr(p.text)}"
               data-index="${i}">
      </div>
      ${state.pillars.length > 2 ? `<button class="pillar-remove" data-index="${i}" title="Remove">×</button>` : ''}
    `;
    list.appendChild(card);
  });

  list.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', e => {
      state.pillars[+e.target.dataset.index].text = e.target.value;
    });
  });

  list.querySelectorAll('.pillar-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      state.pillars.splice(+e.target.dataset.index, 1);
      renderPillars();
    });
  });
}

function addPillar() {
  state.pillars.push({ text: '' });
  renderPillars();
  const inputs = document.querySelectorAll('#pillars-list input');
  inputs[inputs.length - 1].focus();
}

function finishDiscover() {
  // Validate: at least 2 non-empty pillars
  const filled = state.pillars.filter(p => p.text.trim().length > 0);
  if (filled.length < 2) {
    showError('pillars-list', 'Please describe at least 2 life pillars.');
    return;
  }
  // Remove empties
  state.pillars = state.pillars.filter(p => p.text.trim().length > 0);

  // Pre-populate facets from pillars
  state.facets = state.pillars.map(p => ({
    name: '',
    domain: guessDomain(p.text),
    role: '',
    description: '',
    pillarText: p.text,
  }));

  renderDesignFacets();
  goTo('design');
}

function guessDomain(text) {
  const t = text.toLowerCase();
  if (t.includes('money') || t.includes('financ') || t.includes('budget') || t.includes('saving')) return 'Personal Finance';
  if (t.includes('health') || t.includes('exercis') || t.includes('fit') || t.includes('wellness') || t.includes('gym')) return 'Health & Wellness';
  if (t.includes('career') || t.includes('work') || t.includes('job') || t.includes('professional')) return 'Career & Professional Growth';
  if (t.includes('schedul') || t.includes('calendar') || t.includes('time') || t.includes('plan')) return 'Calendar & Time Management';
  if (t.includes('learn') || t.includes('study') || t.includes('education') || t.includes('read')) return 'Learning & Personal Growth';
  if (t.includes('relation') || t.includes('friend') || t.includes('family') || t.includes('social')) return 'Relationships & Social';
  if (t.includes('creat') || t.includes('art') || t.includes('writ') || t.includes('music')) return 'Creative Expression';
  if (t.includes('rest') || t.includes('sleep') || t.includes('relax') || t.includes('recharge')) return 'Rest & Recovery';
  return '';
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
                 placeholder="e.g. Forge, Sage, Vault"
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
                 placeholder="e.g. Financial Advisor"
                 value="${escapeAttr(f.role)}">
        </div>
        <div class="form-field">
          <label>Inspiration (optional)</label>
          <input type="text" data-facet="${i}" data-field="inspiration"
                 placeholder="A character, mentor, or idea">
        </div>
      </div>
      <div class="form-field full">
        <label>Personality &amp; Description</label>
        <textarea data-facet="${i}" data-field="description" rows="2"
                  placeholder="How does this agent think and communicate?">${escapeHTML(f.description)}</textarea>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', e => {
      const idx = +e.target.dataset.facet;
      const field = e.target.dataset.field;
      state.facets[idx][field] = e.target.value;
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

// ─── Utilities ───

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

// ─── Public API ───

const app = { goTo, addPillar, finishDiscover, finishDesign };
window.app = app;

init();
