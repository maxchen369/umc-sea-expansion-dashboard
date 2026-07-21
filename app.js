const files = {
  frame: "data/frame.json",
  demand: "data/demand_drivers.json",
  competition: "data/competitive_map.json",
  valuechain: "data/valuechain_credibility.json",
  feasibility: "data/feasibility_inputs.json",
  cases: "data/cases_signals.json",
  gaps: "data/view_changing_gaps.json",
  sources: "data/source_index.json"
};

const state = {};

async function loadData() {
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, url]) => [key, await fetch(url).then((r) => r.json())])
  );
  entries.forEach(([key, value]) => { state[key] = value; });
  render();
}

function q(tag) {
  if (!tag) return "";
  return `<span class="q q-${String(tag).replace(/[^A-D]/g, "").charAt(0) || "x"}" title="Evidence quality ${tag}">${tag}</span>`;
}

function d(v) {
  if (v === undefined || v === null || v === "") return "data gap";
  return v;
}

function render() {
  renderFrame();
  renderDemand();
  renderCompetition();
  renderValueChain();
  renderFeasibility();
  renderCases();
  renderGaps();
  renderSources();
}

function renderFrame() {
  const f = state.frame;
  document.getElementById("frameTitle").textContent = f.title;
  document.getElementById("frameLens").textContent = f.lens;
  document.getElementById("frameFinding").innerHTML = `<span class="finding-tag">Structural finding</span> ${f.structural_finding}`;
  document.getElementById("frameHow").textContent = f.how_to_read;
  document.getElementById("qualityLegend").innerHTML = f.quality_legend.map((l) => `
    <div class="legend-row">
      <span class="q q-${l.tag}">${l.tag}</span>
      <div><strong>${l.label}</strong><span class="muted">${l.definition}</span></div>
    </div>
  `).join("");
  document.getElementById("frameKnowledgeNote").textContent = f.knowledge_note;
}

function renderDemand() {
  document.getElementById("demandNote").textContent = state.demand.note;
  document.getElementById("structuralDrivers").innerHTML = state.demand.structural_drivers.map((s) => `
    <article class="info-card">
      <div class="card-topline"><h4>${s.driver}</h4>${q(s.quality)}</div>
      <p><strong>What it is:</strong> ${d(s.what_it_is)}</p>
      <p><strong>Relevance to a specialty foundry:</strong> ${d(s.relevance_to_specialty_foundry)}</p>
      ${srcLine(s.sources)}
    </article>
  `).join("");
  document.getElementById("endMarketBody").innerHTML = state.demand.end_market_gravity.map((e) => `
    <tr>
      <td><strong>${e.country}</strong></td>
      <td>${d(e.end_markets)}</td>
      <td>${d(e.foundry_relevant_pull)}</td>
      <td>${q(e.quality)}</td>
    </tr>
  `).join("");
}

function renderCompetition() {
  document.getElementById("competitionNote").textContent = state.competition.note;
  const legend = state.competition.reads_as_legend || {};
  document.getElementById("competitionBody").innerHTML = state.competition.players.map((p) => `
    <tr>
      <td><strong>${p.player}</strong></td>
      <td>${d(p.type)}</td>
      <td>${d(p.location)}</td>
      <td>${d(p.layer)}</td>
      <td>${d(p.move)}<br><span class="muted">${d(p.read_note)}</span></td>
      <td><span class="reads reads-${p.reads_as}" title="${legend[p.reads_as] || ""}">${p.reads_as}</span></td>
      <td>${q(p.quality)}</td>
    </tr>
  `).join("");
  document.getElementById("competitionSynthesis").innerHTML = `<span class="finding-tag">Synthesis</span> ${state.competition.synthesis}`;
}

function renderValueChain() {
  const m = state.valuechain;
  document.getElementById("valueChainNote").textContent = m.note;
  document.getElementById("valueChainHead").innerHTML = `
    <tr><th>Layer</th>${m.countries.map((c) => `<th>${c}</th>`).join("")}</tr>
  `;
  document.getElementById("valueChainBody").innerHTML = m.layers.map((layer) => `
    <tr>
      <td class="layer-cell"><strong>${layer.layer}</strong><span class="muted">${layer.reference || ""}</span></td>
      ${m.countries.map((c) => {
        const cell = layer.cells[c] || {};
        return `<td><span class="status status-${cell.status}">${cell.status || "—"}</span> ${q(cell.quality)}<span class="muted">${d(cell.note)}</span></td>`;
      }).join("")}
    </tr>
  `).join("");
}

function renderFeasibility() {
  const fi = state.feasibility;
  document.getElementById("feasibilityNote").textContent = fi.note;
  document.getElementById("feasibilityHead").innerHTML = `
    <tr><th>Input</th>${fi.countries.map((c) => `<th>${c.country}</th>`).join("")}</tr>
  `;
  document.getElementById("feasibilityBody").innerHTML = fi.field_order.map((field) => `
    <tr>
      <td class="layer-cell"><strong>${field.label}</strong></td>
      ${fi.countries.map((c) => {
        const cell = c[field.key] || {};
        return `<td>${d(cell.value)} ${q(cell.quality)}</td>`;
      }).join("")}
    </tr>
  `).join("");
}

function renderCases() {
  document.getElementById("casesNote").textContent = state.cases.note;
  document.getElementById("mfgCases").innerHTML = state.cases.manufacturing_relevant.map(caseCard).join("");
  document.getElementById("signalCases").innerHTML = state.cases.signals_not_actionable.map(caseCard).join("");
}

function caseCard(k) {
  return `
    <article class="info-card">
      <div class="card-topline"><h4>${k.title}</h4>${q(k.quality)}</div>
      <p class="muted">${d(k.country)} · ${d(k.layer)}</p>
      <p><strong>What happened:</strong> ${d(k.what_happened)}</p>
      <p><strong>What it shows:</strong> ${d(k.what_it_shows)}</p>
      <p><strong>What it does not show:</strong> ${d(k.what_it_does_not_show)}</p>
      ${srcLine(k.sources)}
    </article>
  `;
}

function renderGaps() {
  document.getElementById("gapsNote").textContent = state.gaps.note;
  document.getElementById("gapsList").innerHTML = state.gaps.gaps.map((g, i) => `
    <article class="info-card">
      <div class="card-topline"><h4>${i + 1}. ${g.unknown}</h4>${q(g.quality)}</div>
      <p><strong>Would change:</strong> ${d(g.would_change)}</p>
      <p><strong>Why still open:</strong> ${d(g.why_open)}</p>
      <p><strong>How to close:</strong> ${d(g.how_to_close)}</p>
    </article>
  `).join("");
}

function renderSources() {
  document.getElementById("sourcesList").innerHTML = state.sources.map((s) => `
    <article>
      <a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>
      <p>${s.publisher} | ${s.data_year || "n/a"} | quality ${q(s.quality)}</p>
    </article>
  `).join("");
}

function srcLine(ids) {
  if (!ids || !ids.length) return `<p class="source-line muted">Sources: —</p>`;
  const byId = Object.fromEntries((state.sources || []).map((s) => [s.id, s]));
  const links = ids.map((id) => {
    const s = byId[id];
    return s ? `<a href="${s.url}" target="_blank" rel="noopener">${s.publisher}</a>` : id;
  }).join(", ");
  return `<p class="source-line"><strong>Sources:</strong> ${links}</p>`;
}

loadData().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>Data could not be loaded</h1><p>${error.message}</p><p class="muted">Serve over HTTP (e.g. python -m http.server) — fetch does not work from file://.</p></main>`;
});
