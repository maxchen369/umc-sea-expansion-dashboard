const files = {
  strategicOptions: "data/strategic_options.json",
  countryMetrics: "data/objective_country_metrics.json",
  evidenceLibrary: "data/evidence_library.json",
  caseDossiers: "data/case_dossiers.json",
  diligenceWorkplan: "data/diligence_workplan.json",
  countryProfiles: "data/country_profiles.json",
  sources: "data/sources.json"
};

const state = {
  strategicOptions: [],
  countryMetrics: [],
  evidenceLibrary: [],
  caseDossiers: [],
  diligenceWorkplan: [],
  countryProfiles: [],
  sources: [],
  evidenceOption: "All",
  evidenceCountry: "All",
  evidenceStrength: "All",
  metricSort: { key: "country", direction: "asc" }
};

const optionLabels = {
  optimize_existing_fab12i_p3: "Optimize Existing Fab 12i P3",
  sales_office: "Sales Office",
  customer_engineering_hub: "Customer Engineering Hub",
  packaging_osat_partnership: "Packaging / OSAT Partnership",
  foundry_manufacturing_expansion: "Foundry / Manufacturing Expansion"
};

const strengthLabels = {
  direct: "Direct evidence",
  proxy: "Proxy evidence",
  background: "Background evidence"
};

const strengthClasses = {
  direct: "status-primary",
  proxy: "status-conditional",
  background: "status-gap"
};

const metricColumns = [
  { key: "country", label: "Country" },
  { key: "industry_position", label: "Industry position" },
  { key: "has_12_inch_wafer_fab", label: "12-inch wafer fab" },
  { key: "electricity_cost", label: "Electricity cost" },
  { key: "outage_hours", label: "Outage hours" },
  { key: "firms_experiencing_outages_pct", label: "Firms with outages %" },
  { key: "value_chain_position", label: "Value-chain position" },
  { key: "engineering_talent_supply", label: "Engineering / semiconductor talent" },
  { key: "engineer_salary_range", label: "Engineer salary range" },
  { key: "key_limitation", label: "Key limitation" },
  { key: "data_gaps", label: "Data gaps" }
];

async function loadData() {
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, url]) => [key, await fetch(url).then((response) => response.json())])
  );
  entries.forEach(([key, value]) => {
    state[key] = value;
  });
  render();
}

function render() {
  renderOverview();
  renderOptionMap();
  renderCountryFactBase();
  renderEvidenceFilters();
  renderEvidenceMatrix();
  renderCaseDossiers();
  renderDiligenceWorkplan();
  renderCountrySheets();
  renderSources();
}

function renderOverview() {
  document.getElementById("overviewTitle").textContent = "Strategic options after Singapore Fab 12i P3";
  document.getElementById("baselineAssumption").textContent = "Singapore Fab 12i P3 is the existing baseline and regional anchor.";
  document.getElementById("optionLandscape").textContent = `${state.strategicOptions.length} option families mapped across Malaysia, Vietnam, Thailand, Indonesia, and the Philippines.`;
  document.getElementById("roadmapNote").textContent = "Use this as a discussion aid and diligence roadmap, not as an investment authorization tool.";
}

function renderOptionMap() {
  document.getElementById("optionCards").innerHTML = state.strategicOptions.map((option) => `
    <article class="strategy-card">
      <div class="card-topline">
        <span class="status-pill status-evidence">Option</span>
        <span class="muted">${option.capex_level} capex | ${option.execution_complexity} complexity</span>
      </div>
      <h3>${option.name}</h3>
      <p><strong>Purpose:</strong> ${option.purpose}</p>
      <p><strong>Business logic:</strong> ${option.business_logic}</p>
      <p><strong>Relevant countries:</strong> ${listText(option.relevant_countries)}</p>
      <p><strong>Why it might matter for UMC:</strong> ${option.why_it_might_matter_for_umc}</p>
      <p><strong>Data needed before action:</strong> ${listText(option.data_needed_before_action)}</p>
    </article>
  `).join("");
}

function renderCountryFactBase() {
  const nonSingapore = orderCountries(state.countryMetrics.filter((metric) => metric.country !== "Singapore"));
  renderMetricCards(nonSingapore);
  renderMetricTable(nonSingapore);
}

function renderMetricCards(metrics) {
  document.getElementById("metricCards").innerHTML = metrics.map((metric) => `
    <article class="metric-card">
      <div class="card-topline">
        <h3>${metric.country}</h3>
        <span class="data-quality">${metric.data_quality}</span>
      </div>
      <p><strong>Industry position:</strong> ${displayMetric(metric.industry_position)}</p>
      <p><strong>Cluster locations:</strong> ${listText(metric.semiconductor_cluster_locations)}</p>
      <p><strong>Representative companies:</strong> ${listText(metric.representative_companies)}</p>
      <p><strong>Key limitation:</strong> ${metric.key_limitation}</p>
      <p><strong>Data gaps:</strong> ${listText(metric.data_gaps)}</p>
    </article>
  `).join("");
}

function renderMetricTable(metrics) {
  const rows = [...metrics].sort((a, b) => {
    const key = state.metricSort.key;
    const av = String(displayMetric(a[key])).toLowerCase();
    const bv = String(displayMetric(b[key])).toLowerCase();
    const direction = state.metricSort.direction === "asc" ? 1 : -1;
    return av.localeCompare(bv) * direction;
  });
  document.getElementById("metricTableHead").innerHTML = `
    <tr>
      ${metricColumns.map((column) => `
        <th><button type="button" data-sort-metric="${column.key}">${column.label}${sortMarker(column.key)}</button></th>
      `).join("")}
    </tr>
  `;
  document.getElementById("metricTableBody").innerHTML = rows.map((metric) => `
    <tr>
      ${metricColumns.map((column) => `<td>${displayMetric(metric[column.key])}</td>`).join("")}
    </tr>
    <tr class="metric-detail-row">
      <td colspan="${metricColumns.length}">
        <details>
          <summary>Full fact base for ${metric.country}</summary>
          <div class="detail-grid">
            <p><strong>Materials / consumables localization:</strong> ${displayMetric(metric.materials_consumables_localization)}</p>
            <p><strong>Source IDs:</strong> ${listText(metric.source_ids)}</p>
            <p><strong>Estimate / data flag:</strong> ${displayMetric(metric.estimate_flag)}</p>
          </div>
        </details>
      </td>
    </tr>
  `).join("");
  document.querySelectorAll("[data-sort-metric]").forEach((button) => {
    button.onclick = () => {
      const key = button.dataset.sortMetric;
      state.metricSort = {
        key,
        direction: state.metricSort.key === key && state.metricSort.direction === "asc" ? "desc" : "asc"
      };
      renderMetricTable(metrics);
    };
  });
}

function renderEvidenceFilters() {
  const options = ["All", ...state.strategicOptions.map((option) => option.id)];
  const countries = ["All", ...new Set(state.evidenceLibrary.map((item) => item.country))];
  const strengths = ["All", "direct", "proxy", "background"];
  renderFilter("optionFilters", options, state.evidenceOption, (value) => state.evidenceOption = value, (value) => optionLabel(value));
  renderFilter("countryFilters", countries, state.evidenceCountry, (value) => state.evidenceCountry = value, (value) => value);
  renderFilter("strengthFilters", strengths, state.evidenceStrength, (value) => state.evidenceStrength = value, (value) => strengthLabels[value] || value);
}

function renderFilter(id, values, active, setter, labeler) {
  const el = document.getElementById(id);
  el.innerHTML = values.map((value) => `<button type="button" class="${value === active ? "active" : ""}" data-filter="${value}">${labeler(value)}</button>`).join("");
  el.querySelectorAll("[data-filter]").forEach((button) => {
    button.onclick = () => {
      setter(button.dataset.filter);
      renderEvidenceFilters();
      renderEvidenceMatrix();
    };
  });
}

function renderEvidenceMatrix() {
  const filtered = state.evidenceLibrary.filter((item) => {
    return (state.evidenceOption === "All" || item.option_id === state.evidenceOption)
      && (state.evidenceCountry === "All" || item.country === state.evidenceCountry)
      && (state.evidenceStrength === "All" || item.evidence_strength === state.evidenceStrength);
  });
  const byOption = groupBy(filtered, "option_id");
  document.getElementById("evidenceLibrary").innerHTML = state.strategicOptions
    .filter((option) => byOption[option.id]?.length)
    .map((option) => {
      const byCountry = groupBy(byOption[option.id], "country");
      return `
        <details class="evidence-claim" open>
          <summary>
            <span>${option.name}</span>
            <small>${byOption[option.id].length} evidence item(s)</small>
          </summary>
          ${Object.entries(byCountry).map(([country, items]) => `
            <section class="country-evidence-group">
              <h3>${country}</h3>
              <div class="evidence-card-grid">
                ${items.map(renderEvidenceCard).join("")}
              </div>
            </section>
          `).join("")}
        </details>
      `;
    }).join("") || `<p class="muted">No evidence matches the selected filters.</p>`;
}

function renderEvidenceCard(item) {
  return `
    <article class="evidence-card">
      <div class="card-topline">
        <span class="status-pill ${strengthClasses[item.evidence_strength] || "status-gap"}">${strengthLabels[item.evidence_strength] || item.evidence_strength}</span>
        <span class="muted">${item.confidence} | ${displayMetric(item.data_year)}</span>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Country:</strong> ${item.country}</p>
      <p><strong>Factual detail:</strong> ${item.factual_detail}</p>
      <p><strong>Option supported:</strong> ${optionLabel(item.option_id)}</p>
      <p><strong>What it proves:</strong> ${displayMetric(item.what_it_proves)}</p>
      <p><strong>What it does not prove:</strong> ${displayMetric(item.what_it_does_not_prove)}</p>
      <p><strong>What to validate next:</strong> ${listText(item.what_to_validate_next)}</p>
      <p><strong>Sources:</strong> ${listText(item.source_ids)}</p>
    </article>
  `;
}

function renderCaseDossiers() {
  const byOption = groupBy(state.caseDossiers, "option_id");
  document.getElementById("caseDossiers").innerHTML = state.strategicOptions
    .filter((option) => byOption[option.id]?.length)
    .map((option) => {
      const byCountry = groupBy(byOption[option.id], "country");
      return `
        <details class="evidence-claim" open>
          <summary>
            <span>${option.name}</span>
            <small>${byOption[option.id].length} dossier(s)</small>
          </summary>
          ${Object.entries(byCountry).map(([country, cases]) => `
            <section class="country-evidence-group">
              <h3>${country}</h3>
              <div class="case-grid">
                ${cases.map(renderCaseCard).join("")}
              </div>
            </section>
          `).join("")}
        </details>
      `;
    }).join("");
}

function renderCaseCard(item) {
  return `
    <article class="case-card">
      <div class="card-topline">
        <span class="status-pill status-evidence">${item.country}</span>
        <span class="muted">${item.location}</span>
      </div>
      <h3>${item.company_organization}</h3>
      <p><strong>Decision implication:</strong> ${item.decision_implication}</p>
      <details>
        <summary>Expand case dossier</summary>
        <p><strong>Activity:</strong> ${item.activity}</p>
        <p><strong>Scale indicator:</strong> ${item.scale_indicator}</p>
        <p><strong>Why it matters for UMC:</strong> ${item.why_it_matters_for_umc}</p>
        <p><strong>What it supports:</strong> ${item.what_it_supports}</p>
        <p><strong>What it does not prove:</strong> ${item.what_it_does_not_prove}</p>
        <p><strong>Next validation:</strong> ${item.next_validation_step}</p>
        <p><strong>Sources:</strong> ${listText(item.sources)}</p>
      </details>
    </article>
  `;
}

function renderDiligenceWorkplan() {
  document.getElementById("diligenceTableBody").innerHTML = state.diligenceWorkplan.map((item) => `
    <tr>
      <td><strong>${item.workstream}</strong></td>
      <td>${item.diligence_item}</td>
      <td>${optionLabel(item.related_option)}</td>
      <td>${item.related_country}</td>
      <td>${item.why_it_matters}</td>
      <td>${item.owner}</td>
      <td>${item.next_action}</td>
      <td>${item.output_needed}</td>
    </tr>
  `).join("");
}

function renderCountrySheets() {
  const metricsByCountry = Object.fromEntries(state.countryMetrics.map((item) => [item.country, item]));
  const relevant = orderCountries(state.countryProfiles.filter((profile) => profile.country !== "Singapore"));
  document.getElementById("countryCards").innerHTML = relevant.map((profile) => {
    const metric = metricsByCountry[profile.country] || {};
    return `
      <article class="country-card">
        <h3>${profile.country}</h3>
        <p><strong>Country thesis:</strong> ${profile.thesis}</p>
        <p><strong>Relevant options:</strong> ${countryOptions(profile.country).map(optionLabel).join(", ") || "data gap"}</p>
        <p><strong>Strongest fact:</strong> ${displayMetric(metric.industry_position || metric.value_chain_position)}</p>
        <p><strong>Biggest constraint:</strong> ${displayMetric(metric.key_limitation)}</p>
        <p><strong>Data gap:</strong> ${listText(metric.data_gaps || profile.evidence_gaps)}</p>
      </article>
    `;
  }).join("");
}

function renderSources() {
  document.getElementById("sourcesList").innerHTML = state.sources.map((source) => `
    <article>
      <a href="${source.url}" target="_blank" rel="noopener">${source.title}</a>
      <p>${source.publisher} | Data year ${source.data_year || source.year || "data gap"} | ${source.confidence || "Unknown"} confidence</p>
    </article>
  `).join("");
}

function countryOptions(country) {
  const ids = new Set();
  state.evidenceLibrary.filter((item) => item.country === country).forEach((item) => ids.add(item.option_id));
  state.caseDossiers.filter((item) => item.country === country).forEach((item) => ids.add(item.option_id));
  return [...ids].filter(Boolean);
}

function orderCountries(items) {
  const order = ["Malaysia", "Vietnam", "Thailand", "Indonesia", "Philippines"];
  return [...items].sort((a, b) => {
    const ac = a.country || "";
    const bc = b.country || "";
    const ai = order.indexOf(ac);
    const bi = order.indexOf(bc);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return ac.localeCompare(bc);
  });
}

function optionLabel(id) {
  if (id === "All") return "All";
  return state.strategicOptions.find((option) => option.id === id)?.name || optionLabels[id] || id;
}

function sortMarker(key) {
  if (state.metricSort.key !== key) return "";
  return state.metricSort.direction === "asc" ? " ^" : " v";
}

function displayMetric(value) {
  if (value === undefined || value === null || value === "") return "data gap";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "data gap";
  return value;
}

function listText(value) {
  return displayMetric(value);
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key] || "Other";
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

loadData().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>Data could not be loaded</h1><p>${error.message}</p></main>`;
});
