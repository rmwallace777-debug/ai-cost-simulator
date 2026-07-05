/** AI Cost Simulator - main logic */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const routes = {
  default: {
    title: 'Free AI API Cost Simulator - Estimate LLM Token Pricing',
    h1: 'Free AI API Cost Simulator - Estimate LLM Token Pricing Instantly',
    desc: 'Estimate API costs for GPT-4, Claude, Gemini, and open-source models. Calculate token expenses for prompts, completions, and fine-tuning before you run.',
  },
};

function applyRoute(route) {
  const r = routes[route] || routes.default;
  document.title = r.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', r.desc);
  const elTitle = $('#page-title');
  if (elTitle) elTitle.textContent = r.h1;
  const elLead = $('#page-lead');
  if (elLead) elLead.textContent = r.desc;
  const canonical = $('#canonical');
  if (canonical) canonical.setAttribute('href', window.location.origin + window.location.pathname);
}

const MODELS = {
  'gpt-4o': { input: 2.5, output: 10, label: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.6, label: 'GPT-4o Mini' },
  'gpt-4-turbo': { input: 10, output: 30, label: 'GPT-4 Turbo' },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5, label: 'GPT-3.5 Turbo' },
  'claude-3-5-sonnet': { input: 3, output: 15, label: 'Claude 3.5 Sonnet' },
  'claude-3-opus': { input: 15, output: 75, label: 'Claude 3 Opus' },
  'gemini-1.5-pro': { input: 1.25, output: 5, label: 'Gemini 1.5 Pro' },
  'gemini-2.0-flash': { input: 0.1, output: 0.4, label: 'Gemini 2.0 Flash' },
};

function estimate(model, inputTokens, outputTokens, callsPerMonth) {
  const pricePer1K = MODELS[model] || MODELS['gpt-4o-mini'];
  const inputCost = (inputTokens / 1000) * pricePer1K.input;
  const outputCost = (outputTokens / 1000) * pricePer1K.output;
  const callCost = inputCost + outputCost;
  return {
    perCall: callCost,
    monthly: callCost * (callsPerMonth || 1),
    inputRate: pricePer1K.input,
    outputRate: pricePer1K.output,
  };
}

function formatMoney(n) {
  if (n < 0.01) return '$' + n.toFixed(4);
  if (n < 1) return '$' + n.toFixed(3);
  return '$' + n.toFixed(2);
}

function calc() {
  try {
    console.log('[ai-cost] calc start');
    const model = $('#model').value || 'gpt-4o-mini';
    const inputTokens = parseInt($('#input-tokens').value || '0', 10);
    const outputTokens = parseInt($('#output-tokens').value || '0', 10);
    const calls = parseInt($('#calls').value || '1', 10);
    console.log('[ai-cost] calc inputs', {model, inputTokens, outputTokens, calls});

  console.log('[ai-cost] calc inputs', {model, inputTokens, outputTokens, calls});

  if (!inputTokens && !outputTokens) {
    const rv = $('#result-value');
    const rm = $('#result-meta');
    if (rv) rv.textContent = '—';
    if (rm) rm.textContent = 'Enter token counts to estimate';
    console.log('[ai-cost] calc empty-result');
    return;
  }

  const res = estimate(model, inputTokens, outputTokens, calls);
  const rv = $('#result-value');
  const rm = $('#result-meta');
  console.log('[ai-cost] calc result', res, {rv, rm});
  if (rv) rv.textContent = `${formatMoney(res.monthly)} / month`;
  if (rm) rm.textContent = `${formatMoney(res.perCall)} per call @ ${res.inputRate}/${res.outputRate} per 1K tokens`;
  } catch (e) {
    console.error('[ai-cost] calc failed', e);
  }
}

function initHandlers() {
  const recalc = () => calc();
  $$('.input').forEach((el) => el.addEventListener('input', recalc));
  $('#model').addEventListener('change', recalc);
  const calculateBtn = $('#calculate-btn');
  if (calculateBtn) calculateBtn.addEventListener('click', recalc);
  const resetBtn = $('#reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const inputTokensEl = $('#input-tokens');
      const outputTokensEl = $('#output-tokens');
      const callsEl = $('#calls');
      if (inputTokensEl) inputTokensEl.value = '1000';
      if (outputTokensEl) outputTokensEl.value = '1000';
      if (callsEl) callsEl.value = '1000';
      calc();
    });
  }
  calc();
}

applyRoute('default');
initHandlers();
