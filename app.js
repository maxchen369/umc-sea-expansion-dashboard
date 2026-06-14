const files = {
  countries: "data/countries.json",
  modes: "data/expansion_modes.json",
  cases: "data/case_studies.json",
  sources: "data/sources.json",
  ecosystem: "data/ecosystem_entities.json",
  customers: "data/customer_segments.json",
  policies: "data/policies.json",
  clusters: "data/location_clusters.json",
  lenses: "data/scoring_lenses.json",
  updateLog: "data/update_log.json"
};

const state = {
  countries: [],
  modes: [],
  cases: [],
  sources: [],
  ecosystem: [],
  customers: [],
  policies: [],
  clusters: [],
  lenses: [],
  updateLog: [],
  activeLens: "fab12i_synergy",
  activeEcosystemCountry: "All",
  activeEcosystemLayer: "All",
  activeEcosystemMode: "All",
  activeCaseFilter: "All",
  selectedCountry: "singapore"
};

const ecosystemFilters = [
  "All",
  "upstream materials",
  "semiconductor equipment",
  "IC design",
  "wafer fabrication",
  "OSAT",
  "advanced packaging",
  "testing",
  "EMS",
  "end customers",
  "logistics",
  "customer engineering support"
];

const caseFilters = ["All", ...ecosystemFilters.slice(1), "Singapore", "Malaysia", "Vietnam"];

const ecosystemModeLabels = {
  sales_office: "Sales Office",
  foundry: "Foundry",
  advanced_packaging: "Advanced Packaging",
  customer_support_call_center: "Customer Support Center"
};

const scoreLabels = {
  country_attractiveness_score: "country attractiveness",
  expansion_mode_fit_score: "expansion mode fit",
  policy_score: "policy incentives",
  ecosystem_score: "semiconductor ecosystem",
  talent_score: "talent availability",
  infrastructure_score: "infrastructure and utilities",
  customer_proximity_score: "customer proximity",
  cost_efficiency_score: "cost efficiency",
  geopolitical_stability_score: "geopolitical stability",
  time_to_market_score: "time to market",
  esg_readiness_score: "ESG, power, and water readiness",
  fab12i_synergy_score: "UMC Fab 12i synergy",
  umc_global_layout_fit_score: "UMC global footprint fit",
  ecosystem_adjacency_score: "ecosystem adjacency",
  customer_coverage_score: "customer coverage",
  partner_potential_score: "partner potential",
  execution_risk_penalty: "execution risk penalty"
};

const modeNeedMap = {
  foundry: "manufacturing resilience, specialty-node capacity, customer qualification, and Fab 12i-linked supply assurance",
  advanced_packaging: "OSAT adjacency, test and packaging partnerships, customer qualification support, and back-end options near UMC wafer output",
  sales_office: "regional account coverage, fabless / IDM / EMS / OSAT customer access, and senior customer engagement for Fab 12i demand",
  customer_support_call_center: "B2B FAE support, quality issue coordination, order and logistics support, and Fab 12i customer engineering coverage"
};

const modeLensModifiers = {
  generic_country: {
    sales_office: 1,
    foundry: 0.94,
    advanced_packaging: 1,
    customer_support_call_center: 1.02
  },
  fab12i_synergy: {
    sales_office: 1.05,
    foundry: 1.1,
    advanced_packaging: 0.96,
    customer_support_call_center: 1.08
  },
  advanced_packaging_ecosystem: {
    sales_office: 0.9,
    foundry: 0.82,
    advanced_packaging: 1.18,
    customer_support_call_center: 1
  },
  sales_support_coverage: {
    sales_office: 1.16,
    foundry: 0.78,
    advanced_packaging: 0.92,
    customer_support_call_center: 1.18
  },
  low_risk_fast_entry: {
    sales_office: 1.16,
    foundry: 0.7,
    advanced_packaging: 0.92,
    customer_support_call_center: 1.18
  },
  umc_global_layout_fit: {
    sales_office: 1.08,
    foundry: 1.04,
    advanced_packaging: 1.08,
    customer_support_call_center: 1.08
  }
};

const modeFitCriteria = {
  sales_office: {
    customer_coverage_score: 0.24,
    customer_proximity_score: 0.18,
    ecosystem_adjacency_score: 0.12,
    partner_potential_score: 0.1,
    time_to_market_score: 0.1,
    geopolitical_stability_score: 0.08,
    fab12i_synergy_score: 0.1,
    umc_global_layout_fit_score: 0.08
  },
  foundry: {
    infrastructure_score: 0.18,
    esg_readiness_score: 0.16,
    policy_score: 0.12,
    talent_score: 0.11,
    customer_coverage_score: 0.1,
    fab12i_synergy_score: 0.16,
    umc_global_layout_fit_score: 0.09,
    ecosystem_score: 0.08,
    execution_risk_penalty: -0.14
  },
  advanced_packaging: {
    ecosystem_adjacency_score: 0.24,
    partner_potential_score: 0.2,
    ecosystem_score: 0.13,
    infrastructure_score: 0.09,
    customer_coverage_score: 0.1,
    fab12i_synergy_score: 0.1,
    talent_score: 0.08,
    time_to_market_score: 0.06,
    execution_risk_penalty: -0.1
  },
  customer_support_call_center: {
    talent_score: 0.2,
    customer_coverage_score: 0.18,
    customer_proximity_score: 0.14,
    infrastructure_score: 0.1,
    time_to_market_score: 0.1,
    cost_efficiency_score: 0.09,
    fab12i_synergy_score: 0.11,
    geopolitical_stability_score: 0.08,
    execution_risk_penalty: -0.08
  }
};

async function loadData() {
  const [
    countries,
    modes,
    cases,
    sources,
    ecosystem,
    customers,
    policies,
    clusters,
    lenses,
    updateLog
  ] = await Promise.all(Object.values(files).map((url) => fetch(url).then((response) => response.json())));

  Object.assign(state, { countries, modes, cases, sources, ecosystem, customers, policies, clusters, lenses, updateLog });
  render();
}

function activeLens() {
  return state.lenses.find((lens) => lens.id === state.activeLens) || state.lenses[0];
}

function sourceById(id) {
  return state.sources.find((source) => source.id === id);
}

function weightedScore(country, lens = activeLens()) {
  const entries = Object.entries(lens.weights);
  const positiveWeight = entries.reduce((sum, [, weight]) => sum + Math.max(weight, 0), 0);
  const penaltyWeight = entries.reduce((sum, [, weight]) => sum + Math.abs(Math.min(weight, 0)), 0);
  const positive = entries.reduce((sum, [key, weight]) => {
    if (weight <= 0) return sum;
    return sum + (country[key] || 0) * weight;
  }, 0);
  const penalty = entries.reduce((sum, [key, weight]) => {
    if (weight >= 0) return sum;
    return sum + (country[key] || 0) * Math.abs(weight);
  }, 0);
  const base = positiveWeight ? (positive / (positiveWeight * 5)) * 100 : 0;
  const penaltyImpact = penaltyWeight ? (penalty / (penaltyWeight * 5)) * 22 : 0;
  return clamp(Math.round(base - penaltyImpact), 1, 100);
}

function modeFit(country, modeId) {
  const criteria = modeFitCriteria[modeId] || {};
  const positiveWeight = Object.values(criteria).reduce((sum, weight) => sum + Math.max(weight, 0), 0);
  const positive = Object.entries(criteria).reduce((sum, [key, weight]) => {
    if (weight <= 0) return sum;
    return sum + (country[key] || 0) * weight;
  }, 0);
  const penalty = Object.entries(criteria).reduce((sum, [key, weight]) => {
    if (weight >= 0) return sum;
    return sum + (country[key] || 0) * Math.abs(weight);
  }, 0);
  return clamp(Math.round(((positive / (positiveWeight * 5)) * 100) - (penalty * 4)), 1, 100);
}

function strategyScore(country, mode, lens = activeLens()) {
  const modifier = modeLensModifiers[lens.id]?.[mode.id] || 1;
  const recommendedBonus = country.recommended_modes.includes(mode.id) ? 4 : 0;
  const raw = ((weightedScore(country, lens) * 0.56) + (modeFit(country, mode.id) * 0.44)) * modifier + recommendedBonus;
  return clamp(Math.round(raw), 1, 100);
}

function recommendationLabel(score) {
  if (score >= 82) return "Strong Fit";
  if (score >= 70) return "Viable";
  if (score >= 58) return "Watchlist";
  return "Low Fit";
}

function heatClass(score) {
  if (score >= 82) return "heat-strong";
  if (score >= 70) return "heat-viable";
  if (score >= 58) return "heat-watch";
  return "heat-low";
}

function strategies(lens = activeLens()) {
  return state.countries.flatMap((country) => {
    return state.modes.map((mode) => ({
      country,
      mode,
      score: strategyScore(country, mode, lens),
      countryScore: weightedScore(country, lens),
      modeFit: modeFit(country, mode.id),
      countryAttractiveness: country.country_attractiveness_score,
      expansionModeFit: country.expansion_mode_fit_score,
      label: recommendationLabel(strategyScore(country, mode, lens)),
      explanation: explainScore(country, mode, lens)
    }));
  }).sort((a, b) => b.score - a.score);
}

function explainScore(country, mode, lens = activeLens()) {
  const drivers = Object.entries(lens.weights)
    .filter(([, weight]) => weight > 0)
    .sort((a, b) => (country[b[0]] || 0) * b[1] - (country[a[0]] || 0) * a[1])
    .slice(0, 3)
    .map(([key]) => labelForKey(key));
  const fab12iText = country.fab12i_synergy_score >= 4
    ? "It directly reinforces Fab 12i as UMC's Southeast Asia anchor."
    : country.fab12i_synergy_score === 3
      ? "It supports Fab 12i indirectly through customer, EMS, or back-end adjacency."
      : "Its Fab 12i linkage is limited and should be treated as a market-coverage option.";
  const risks = country.risks?.slice(0, 2).join(" ") || "Risks require further diligence.";
  return `${country.name} scores highly under ${lens.name} because of ${drivers.join(", ")}. ${mode.name} supports ${modeNeedMap[mode.id]}. ${fab12iText} Remaining risks: ${risks}`;
}

function labelForKey(key) {
  return scoreLabels[key] || key.replace(/_/g, " ");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sourceBadges(ids = []) {
  return ids.map((id) => {
    const source = sourceById(id);
    const label = source ? `${source.publisher} (${source.confidence || "Unknown"})` : id;
    return `<span class="source-badge">${label}</span>`;
  }).join("");
}

function freshnessBadge(item) {
  return `
    <div class="freshness-badge" aria-label="Data freshness">
      <span>Published ${item.published_date || "Model data"}</span>
      <span>Retrieved ${item.retrieved_date || "2026-06-13"}</span>
      <span>Data ${item.data_year || "2026"}</span>
      <span>${item.confidence || "Internal estimate"} confidence</span>
    </div>
  `;
}

function render() {
  renderSummary();
  renderExecutiveCards();
  renderMatrix();
  renderLensModel();
  renderDeepDive();
  renderCountryCards();
  renderEcosystem();
  renderCaseFilters();
  renderCases();
  renderRecommendations();
  renderSources();
}

function renderSummary() {
  const top = strategies()[0];
  document.getElementById("topRecommendation").textContent = `${top.country.name} + ${top.mode.name}`;
  document.getElementById("topRecommendationText").textContent = `Score ${top.score}. ${top.explanation}`;
  document.getElementById("bestSales").textContent = bestForMode("sales_office").country.name;
  document.getElementById("bestFoundry").textContent = bestForMode("foundry").country.name;
  document.getElementById("bestPackaging").textContent = bestForMode("advanced_packaging").country.name;
  document.getElementById("bestSupport").textContent = bestForMode("customer_support_call_center").country.name;
}

function bestForMode(modeId) {
  return strategies().filter((item) => item.mode.id === modeId)[0];
}

function renderExecutiveCards() {
  const lens = activeLens();
  const cards = [
    ["Best under active lens", strategies(lens)[0]],
    ["Fab 12i synergy", strategies(state.lenses.find((item) => item.id === "fab12i_synergy"))[0]],
    ["Advanced packaging ecosystem", strategies(state.lenses.find((item) => item.id === "advanced_packaging_ecosystem")).find((item) => item.mode.id === "advanced_packaging")],
    ["Sales and customer engineering", strategies(state.lenses.find((item) => item.id === "sales_support_coverage"))[0],
    ],
    ["Low risk / fast entry", strategies(state.lenses.find((item) => item.id === "low_risk_fast_entry"))[0]],
    ["Best foundry option", bestForMode("foundry")]
  ];

  document.getElementById("executiveCards").innerHTML = cards.map(([title, item]) => `
    <article class="executive-card">
      <span class="badge">${title}</span>
      <h3>${item.country.name} | ${item.mode.name}</h3>
      <p><strong>${item.score}: ${item.label}</strong></p>
      <p>${item.explanation}</p>
      ${freshnessBadge(item.country)}
      <div class="source-badges">${sourceBadges(item.country.source_ids)}</div>
    </article>
  `).join("");
}

function renderMatrix() {
  const topKeys = new Set(strategies().slice(0, 3).map((item) => `${item.country.id}-${item.mode.id}`));
  document.getElementById("matrixBody").innerHTML = state.countries.map((country) => {
    const cells = state.modes.map((mode) => {
      const score = strategyScore(country, mode);
      return `
        <td class="heat-cell ${heatClass(score)} ${topKeys.has(`${country.id}-${mode.id}`) ? "top-strategy-cell" : ""}">
          <strong>${score}</strong>
          <span>${recommendationLabel(score)}</span>
          <small>${activeLens().name}</small>
        </td>
      `;
    }).join("");
    return `<tr><th scope="row">${country.name}<br><small>${weightedScore(country)} lens score</small></th>${cells}</tr>`;
  }).join("");
}

function renderLensModel() {
  document.getElementById("lensSelector").innerHTML = state.lenses.map((lens) => `
    <button type="button" class="${lens.id === state.activeLens ? "active" : ""}" data-lens="${lens.id}" aria-label="Use ${lens.name} scoring lens">${lens.name}</button>
  `).join("");

  document.querySelectorAll("[data-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLens = button.dataset.lens;
      render();
    });
  });

  const lens = activeLens();
  document.getElementById("weightControls").innerHTML = `
    <div class="formula-card">
      <h3>${lens.name}</h3>
      <p>${lens.description}</p>
      <p><strong>Formula:</strong> UMC lens score + expansion-mode-specific fit + mode/lens modifier + recommended-mode bonus. Foundry, packaging, sales, and customer engineering support use different fit weights. Execution risk penalty reduces scores.</p>
    </div>
    ${Object.entries(lens.weights).map(([key, value]) => `
      <div class="control compact-control">
        <label><span>${labelForKey(key)}</span><span>${value}</span></label>
      </div>
    `).join("")}
  `;

  document.getElementById("weightTotal").textContent = lens.name;
  renderRanking();
}

function renderRanking() {
  const ranking = [...state.countries].sort((a, b) => weightedScore(b) - weightedScore(a));
  const max = Math.max(...ranking.map((country) => weightedScore(country)), 1);
  document.getElementById("rankingList").innerHTML = `
    <table class="ranking-table">
      <thead><tr><th>Rank</th><th>Country</th><th>Lens score</th><th>Best strategy</th></tr></thead>
      <tbody>
        ${ranking.map((country, index) => {
          const best = strategies().find((item) => item.country.id === country.id);
          const score = weightedScore(country);
          return `<tr>
            <td>${index + 1}</td>
            <td><strong>${country.name}</strong><div class="rank-track" aria-hidden="true"><span style="width:${(score / max) * 100}%"></span></div></td>
            <td><strong>${score}</strong></td>
            <td>${best.mode.name} (${best.score})</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderDeepDive() {
  document.getElementById("countryTabs").innerHTML = state.countries.map((country) => `
    <button type="button" class="${country.id === state.selectedCountry ? "active" : ""}" data-country="${country.id}">${country.name}</button>
  `).join("");

  document.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCountry = button.dataset.country;
      renderDeepDive();
    });
  });

  const country = state.countries.find((item) => item.id === state.selectedCountry) || state.countries[0];
  const policy = state.policies.find((item) => item.country === country.name);
  const clusters = state.clusters.filter((item) => item.country === country.name);
  const best = strategies().find((item) => item.country.id === country.id);

  document.getElementById("countryDetail").innerHTML = `
    <div class="detail-grid">
      <div>
        <span class="badge">${best.mode.name}</span>
        <h3>${country.name}</h3>
        <p>${country.summary}</p>
        ${freshnessBadge(country)}
        <div class="source-badges">${sourceBadges(country.source_ids)}</div>
        <div class="stat-grid">
          <div class="stat"><span>${activeLens().name}</span><strong>${weightedScore(country)}</strong></div>
          <div class="stat"><span>Fab 12i synergy</span><strong>${country.fab12i_synergy_score}/5</strong></div>
          <div class="stat"><span>Partner potential</span><strong>${country.partner_potential_score}/5</strong></div>
          <div class="stat"><span>Risk penalty</span><strong>${country.execution_risk_penalty}/5</strong></div>
        </div>
      </div>
      <div>
        <h4>Policy implication</h4>
        <p>${policy?.umc_implication || "Policy details pending."}</p>
        <h4>Location clusters</h4>
        <ul>${clusters.map((cluster) => `<li><strong>${cluster.cluster}:</strong> ${cluster.umc_angle}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderCountryCards() {
  document.getElementById("countryCards").innerHTML = state.countries.map((country) => {
    const cases = state.cases.filter((item) => item.country === country.name);
    const bestModes = strategies().filter((item) => item.country.id === country.id).slice(0, 2).map((item) => item.mode.name).join(", ");
    return `
      <article class="country-card">
        <button class="country-card-toggle" type="button" aria-expanded="false" aria-controls="${country.id}_body">
          <span>${country.name}</span><span>${weightedScore(country)}</span>
        </button>
        <div id="${country.id}_body" class="country-card-body">
          <p><strong>Best modes:</strong> ${bestModes}</p>
          <p><strong>UMC strategy:</strong> ${strategies().find((item) => item.country.id === country.id).explanation}</p>
          ${freshnessBadge(country)}
          ${countrySection("UMC-specific scores", `Fab 12i synergy ${country.fab12i_synergy_score}/5; global layout fit ${country.umc_global_layout_fit_score}/5; ecosystem adjacency ${country.ecosystem_adjacency_score}/5; customer coverage ${country.customer_coverage_score}/5; partner potential ${country.partner_potential_score}/5.`)}
          ${countrySection("Risks", country.risks.join(" "))}
          ${countrySection("Comparable peer cases", cases.length ? cases.map((item) => `${item.company}: ${item.relevance_to_umc}`).join(" ") : "No direct peer case in current dataset.")}
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".country-card-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      document.getElementById(button.getAttribute("aria-controls")).classList.toggle("open", !expanded);
    });
  });
}

function countrySection(title, body) {
  return `<details><summary>${title}</summary><p>${body}</p></details>`;
}

function renderEcosystem() {
  const countries = ["All", ...state.countries.map((country) => country.name)];
  const modes = ["All", ...state.modes.map((mode) => mode.id)];

  document.getElementById("ecosystemCountryFilters").innerHTML = countries.map((country) => `
    <button type="button" class="${state.activeEcosystemCountry === country ? "active" : ""}" data-eco-country="${country}" aria-label="Filter ecosystem by ${country}">
      ${country}
    </button>
  `).join("");

  document.getElementById("ecosystemLayerFilters").innerHTML = ecosystemFilters.map((filter) => `
    <button type="button" class="${state.activeEcosystemLayer === filter ? "active" : ""}" data-eco-layer="${filter}" aria-label="Filter ecosystem by ${filter}">
      ${filter}
    </button>
  `).join("");

  document.getElementById("ecosystemModeFilters").innerHTML = modes.map((mode) => `
    <button type="button" class="${state.activeEcosystemMode === mode ? "active" : ""}" data-eco-mode="${mode}" aria-label="Filter ecosystem by ${ecosystemModeLabels[mode] || mode}">
      ${ecosystemModeLabels[mode] || mode}
    </button>
  `).join("");

  document.querySelectorAll("[data-eco-country]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeEcosystemCountry = button.dataset.ecoCountry;
      renderEcosystem();
    });
  });

  document.querySelectorAll("[data-eco-layer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeEcosystemLayer = button.dataset.ecoLayer;
      renderEcosystem();
    });
  });

  document.querySelectorAll("[data-eco-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeEcosystemMode = button.dataset.ecoMode;
      renderEcosystem();
    });
  });

  const entities = state.ecosystem.filter((item) => {
    const countryMatch = state.activeEcosystemCountry === "All" || item.country === state.activeEcosystemCountry || item.country.includes(state.activeEcosystemCountry);
    const layerMatch = state.activeEcosystemLayer === "All" || item.ecosystem_layer === state.activeEcosystemLayer;
    const modeMatch = state.activeEcosystemMode === "All" || item.relevant_expansion_modes?.includes(state.activeEcosystemMode);
    return countryMatch && layerMatch && modeMatch;
  });

  renderEcosystemSummary(entities);

  document.getElementById("ecosystemGrid").innerHTML = entities.map((entity) => `
    <article class="case-card ecosystem-card">
      <span class="badge">${entity.ecosystem_layer}</span>
      <h3>${entity.name}</h3>
      <p><strong>${entity.country} | ${entity.location}</strong></p>
      <p><strong>Value chain:</strong> ${entity.value_chain_position || "Not specified"}</p>
      <p>${entity.relevance_to_umc || entity.umc_relevance}</p>
      <ul class="entity-mode-list">
        ${(entity.relevant_expansion_modes || []).map((mode) => `<li>${ecosystemModeLabels[mode] || mode}</li>`).join("")}
      </ul>
      <div class="entity-score-grid" aria-label="Entity relevance scores">
        <div><span>Fab 12i</span><strong>${entity.fab12i_synergy_score ?? "n/a"}</strong></div>
        <div><span>Sales</span><strong>${entity.sales_relevance_score ?? "n/a"}</strong></div>
        <div><span>Support</span><strong>${entity.customer_support_relevance_score ?? "n/a"}</strong></div>
        <div><span>Packaging</span><strong>${entity.advanced_packaging_relevance_score ?? "n/a"}</strong></div>
      </div>
      <div class="source-badges">${sourceBadges(entity.source_ids)}</div>
      ${freshnessBadge(entity)}
    </article>
  `).join("") || `<p class="muted">No ecosystem entities match the selected filters.</p>`;
}

function renderEcosystemSummary(entities) {
  const modeAverage = (key) => {
    if (!entities.length) return 0;
    return Math.round(entities.reduce((sum, entity) => sum + (entity[key] || 0), 0) / entities.length * 10) / 10;
  };

  const topLayer = Object.entries(entities.reduce((counts, entity) => {
    counts[entity.ecosystem_layer] = (counts[entity.ecosystem_layer] || 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "no selected layer";

  document.getElementById("ecosystemSummary").innerHTML = `
    <article>
      <h3>Sales Office Location Choice</h3>
      <p>Average sales relevance is <strong>${modeAverage("sales_relevance_score")}/5</strong>. Strong country/customer clusters support representative offices and senior account coverage.</p>
    </article>
    <article>
      <h3>Customer Engineering Support</h3>
      <p>Average support relevance is <strong>${modeAverage("customer_support_relevance_score")}/5</strong>. Dense FAE, test, packaging, EMS, and account-operations ecosystems improve support hub fit.</p>
    </article>
    <article>
      <h3>Advanced Packaging Strategy</h3>
      <p>Average packaging relevance is <strong>${modeAverage("advanced_packaging_relevance_score")}/5</strong>. OSAT, testing, equipment, and advanced packaging layers drive partner-led options.</p>
    </article>
    <article>
      <h3>Foundry Expansion Strategy</h3>
      <p>Average Fab 12i synergy is <strong>${modeAverage("fab12i_synergy_score")}/5</strong>. The dominant selected layer is <strong>${topLayer}</strong>, which affects whether expansion should be fab-led, partner-led, or support-led.</p>
    </article>
  `;
}

function renderCaseFilters() {
  document.getElementById("caseFilters").innerHTML = caseFilters.map((filter) => `
    <button type="button" class="${state.activeCaseFilter === filter ? "active" : ""}" data-case-filter="${filter}">${filter}</button>
  `).join("");

  document.querySelectorAll("[data-case-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCaseFilter = button.dataset.caseFilter;
      renderCaseFilters();
      renderCases();
    });
  });
}

function renderCases() {
  const cases = state.activeCaseFilter === "All"
    ? state.cases
    : state.cases.filter((item) => item.ecosystem_layer === state.activeCaseFilter || item.country === state.activeCaseFilter);

  document.getElementById("caseStudyGrid").innerHTML = cases.map((study) => `
    <article class="case-card">
      <span class="badge">${study.ecosystem_layer}</span>
      <h3>${study.company}</h3>
      <p><strong>${study.location}, ${study.country}</strong></p>
      <p><strong>${study.investment_amount}</strong> | ${study.value_chain_position}</p>
      <p>${study.relevance_to_umc}</p>
      ${freshnessBadge(study)}
      <div class="source-badges">${sourceBadges(study.source_ids)}</div>
    </article>
  `).join("");
}

function renderRecommendations() {
  document.getElementById("recommendationCards").innerHTML = strategies().slice(0, 3).map((item, index) => `
    <article class="recommendation-card top-strategy">
      <span class="badge">Top ${index + 1}</span>
      <h3>${item.country.name} + ${item.mode.name}</h3>
      <p><strong>${item.score}: ${item.label}</strong></p>
      <p>${item.explanation}</p>
      <p><strong>UMC strategic need:</strong> ${modeNeedMap[item.mode.id]}</p>
      <p><strong>Score inputs:</strong> country attractiveness ${item.country.country_attractiveness_score}/5; mode fit ${item.country.expansion_mode_fit_score}/5; Fab 12i synergy ${item.country.fab12i_synergy_score}/5; global layout fit ${item.country.umc_global_layout_fit_score}/5; risk penalty ${item.country.execution_risk_penalty}/5.</p>
      ${freshnessBadge(item.country)}
    </article>
  `).join("");
}

function renderSources() {
  document.getElementById("sourcesList").innerHTML = state.sources.map((source) => `
    <article class="source-item">
      <a href="${source.url}" target="_blank" rel="noopener">${source.title}</a>
      <p><strong>${source.publisher}, ${source.year}</strong></p>
      <p>${source.note}</p>
    </article>
  `).join("");
}

loadData().catch((error) => {
  document.body.innerHTML = `
    <main class="section">
      <h1>Data could not be loaded</h1>
      <p class="muted">Run this folder through a local static server so the browser can fetch the JSON files.</p>
      <pre>${error.message}</pre>
    </main>
  `;
});
