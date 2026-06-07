const $ = (sel, ctx = document) => ctx.querySelector(sel);

const routes = {
  default: {
    h1: `Free AI API Cost Simulator - Estimate LLM Token Pricing Instantly`,
    title: `Free AI API Cost Simulator - Estimate LLM Token Pricing`,
    desc: `Estimate API costs for GPT-4, Claude, Gemini, and open-source models. Calculate token expenses for prompts, completions, and fine-tuning before you run.`,
    keywords: 'AI API cost calculator, LLM token pricing estimator, GPT-4 cost per token, Claude API pricing, Gemini token cost, open source LLM pricing'
  }
};

function applyRoute(route) {
  const r = routes[route];
  if (!r) return;
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

applyRoute('default');
