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
  lastPresetLens: "fab12i_synergy",
  customWeights: {},
  activeEcosystemCountry: "All",
  activeEcosystemLayer: "All",
  activeEcosystemMode: "All",
  activeCaseFilter: "All",
  selectedCountry: "singapore",
  candidateScope: "baseline_only",
  hideSingaporeHeatmap: true,
  nonSingaporeOnlyHeatmap: true
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

const scoringFactorKeys = [
  "policy_score",
  "ecosystem_score",
  "talent_score",
  "infrastructure_score",
  "customer_proximity_score",
  "cost_efficiency_score",
  "geopolitical_stability_score",
  "time_to_market_score",
  "esg_readiness_score",
  "fab12i_synergy_score",
  "umc_global_layout_fit_score",
  "ecosystem_adjacency_score",
  "customer_coverage_score",
  "partner_potential_score",
  "execution_risk_penalty"
];

const factorDefinitions = {
  policy_score: "Strength of policy incentives, investment agencies, tax support, grants, and semiconductor-specific government backing.",
  ecosystem_score: "Depth of the local semiconductor base across fabs, OSATs, suppliers, design activity, and adjacent electronics manufacturing.",
  talent_score: "Availability of engineers, technicians, operators, FAEs, account support talent, and training programs.",
  infrastructure_score: "Readiness of industrial parks, transport links, utilities, cleanroom-capable sites, and operating reliability.",
  customer_proximity_score: "Proximity to UMC customer decision makers, manufacturing sites, regional headquarters, and demand clusters.",
  cost_efficiency_score: "Relative operating cost advantage for support, engineering, supplier coordination, and scalable commercial presence.",
  geopolitical_stability_score: "Political, legal, regulatory, trade, and business-continuity stability relevant to semiconductor operations.",
  time_to_market_score: "How quickly UMC could establish presence through office, partnership, brownfield, support hub, or supplier collaboration.",
  esg_readiness_score: "Power, water, environmental permitting, ESG expectations, and infrastructure resilience for semiconductor operations.",
  fab12i_synergy_score: "How strongly the location supports UMC Singapore Fab 12i operations, customers, logistics, and regional manufacturing strategy.",
  umc_global_layout_fit_score: "How well the location complements UMC's existing global foundry footprint and regional risk diversification.",
  ecosystem_adjacency_score: "Proximity to upstream suppliers, OSATs, EMS, IC design, materials, equipment, logistics, and end customers.",
  customer_coverage_score: "Ability to support UMC customers across automotive, consumer, communication, IoT, power, display, industrial, and connectivity applications.",
  partner_potential_score: "Likelihood that UMC can enter through partnership, JV, supplier collaboration, OSAT adjacency, or customer support rather than greenfield capex.",
  execution_risk_penalty: "Execution difficulty from permitting, capex scale, staffing, qualification, utility constraints, and operational complexity. Higher raw score reduces the final result."
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
  state.customWeights = weightsFromLens(activeLens());
  render();
}

function activeLens() {
  if (state.activeLens === "custom_weight_mode") {
    return {
      id: "custom_weight_mode",
      name: "Custom Weight Mode",
      description: "User-adjustable score weights. Positive weights are normalized automatically; execution risk is treated as a negative adjustment.",
      weights: state.customWeights
    };
  }
  return state.lenses.find((lens) => lens.id === state.activeLens) || state.lenses[0];
}

function presetLensById(id = state.lastPresetLens) {
  return state.lenses.find((lens) => lens.id === id) || state.lenses[0];
}

function weightsFromLens(lens) {
  return scoringFactorKeys.reduce((weights, key) => {
    weights[key] = Number(lens?.weights?.[key] || 0);
    return weights;
  }, {});
}

function sliderValueForWeight(key, weight) {
  return key === "execution_risk_penalty" ? Math.abs(weight || 0) : Math.max(weight || 0, 0);
}

function positiveWeightTotal(weights = activeLens().weights) {
  return Object.entries(weights).reduce((sum, [key, weight]) => {
    if (key === "execution_risk_penalty") return sum;
    return sum + Math.max(Number(weight) || 0, 0);
  }, 0);
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

function singaporeCountry() {
  return state.countries.find((country) => country.id === "singapore");
}

function nonSingaporeCountries() {
  return state.countries.filter((country) => country.id !== "singapore");
}

function candidateCountries() {
  return state.candidateScope === "include_singapore" ? state.countries : nonSingaporeCountries();
}

function matrixCountries() {
  const hideSingapore = state.candidateScope !== "include_singapore" || state.hideSingaporeHeatmap || state.nonSingaporeOnlyHeatmap;
  return hideSingapore ? nonSingaporeCountries() : state.countries;
}

function scopeNoteText() {
  if (state.candidateScope === "include_singapore") {
    return "Singapore is included as a normal candidate in ranking, heatmap, and recommendations.";
  }
  if (state.candidateScope === "exclude_singapore") {
    return "Singapore Fab 12i remains the regional anchor; this view compares next-step non-Singapore options.";
  }
  return "Singapore Fab 12i is shown as the regional baseline. Rankings and recommendations compare non-Singapore next-step options.";
}

function baselineMetrics(country, mode, lens = activeLens()) {
  const singapore = singaporeCountry();
  if (!singapore || country.id === "singapore") {
    return {
      singapore_baseline_gap: 0,
      fab12i_extension_value: 0,
      complementarity_score: 0,
      non_singapore_next_step_score: strategyScore(country, mode, lens)
    };
  }
  const score = strategyScore(country, mode, lens);
  const singaporeScore = strategyScore(singapore, mode, lens);
  const singapore_baseline_gap = Math.max(singaporeScore - score, 0);
  const fab12i_extension_value = clamp(Math.round((
    (country.fab12i_synergy_score || 0) * 0.34 +
    (country.customer_coverage_score || 0) * 0.22 +
    (country.ecosystem_adjacency_score || 0) * 0.22 +
    (country.partner_potential_score || 0) * 0.22
  ) * 20), 1, 100);
  const complementarity_score = clamp(Math.round((
    (country.partner_potential_score || 0) * 0.28 +
    (country.ecosystem_adjacency_score || 0) * 0.24 +
    (country.cost_efficiency_score || 0) * 0.18 +
    (country.customer_coverage_score || 0) * 0.18 +
    (country.fab12i_synergy_score || 0) * 0.12
  ) * 20), 1, 100);
  const non_singapore_next_step_score = clamp(Math.round(
    (score * 0.52) +
    (fab12i_extension_value * 0.26) +
    (complementarity_score * 0.22) -
    (singapore_baseline_gap * 0.12)
  ), 1, 100);
  return { singapore_baseline_gap, fab12i_extension_value, complementarity_score, non_singapore_next_step_score };
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

function strategies(lens = activeLens(), countries = candidateCountries()) {
  return countries.flatMap((country) => {
    return state.modes.map((mode) => ({
      country,
      mode,
      score: strategyScore(country, mode, lens),
      countryScore: weightedScore(country, lens),
      modeFit: modeFit(country, mode.id),
      countryAttractiveness: country.country_attractiveness_score,
      expansionModeFit: country.expansion_mode_fit_score,
      ...baselineMetrics(country, mode, lens),
      label: recommendationLabel(strategyScore(country, mode, lens)),
      explanation: explainScore(country, mode, lens)
    }));
  }).sort((a, b) => {
    const aScore = state.candidateScope === "baseline_only" ? a.non_singapore_next_step_score : a.score;
    const bScore = state.candidateScope === "baseline_only" ? b.non_singapore_next_step_score : b.score;
    return bScore - aScore;
  });
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
  renderCandidateScope();
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

function renderCandidateScope() {
  const options = [
    ["baseline_only", "Use Singapore as baseline only"],
    ["include_singapore", "Include Singapore as candidate"],
    ["exclude_singapore", "Exclude Singapore from candidate ranking"]
  ];
  const controls = document.getElementById("candidateScopeControls");
  if (controls) {
    controls.innerHTML = options.map(([value, label]) => `
      <label class="scope-option ${state.candidateScope === value ? "active" : ""}">
        <input type="radio" name="candidateScope" value="${value}" ${state.candidateScope === value ? "checked" : ""}>
        <span>${label}</span>
      </label>
    `).join("");
    controls.querySelectorAll("input[name='candidateScope']").forEach((input) => {
      input.addEventListener("change", () => {
        state.candidateScope = input.value;
        if (input.value === "include_singapore") {
          state.hideSingaporeHeatmap = false;
          state.nonSingaporeOnlyHeatmap = false;
        } else {
          state.hideSingaporeHeatmap = true;
          state.nonSingaporeOnlyHeatmap = true;
        }
        render();
      });
    });
  }
  const note = document.getElementById("scopeNote");
  if (note) note.textContent = scopeNoteText();
  renderSingaporeBaselineCard();
}

function renderSingaporeBaselineCard() {
  const container = document.getElementById("singaporeBaselineCard");
  const singapore = singaporeCountry();
  if (!container || !singapore) return;
  if (state.candidateScope === "include_singapore") {
    container.innerHTML = "";
    container.hidden = true;
    return;
  }
  container.hidden = false;
  const bestSingapore = strategies(activeLens(), [singapore])[0];
  container.innerHTML = `
    <article class="baseline-panel">
      <span class="badge">Singapore baseline</span>
      <h3>Fab 12i regional anchor</h3>
      <p><strong>${bestSingapore.mode.name}: ${bestSingapore.score}</strong></p>
      <p>Singapore is not ranked as a next-step market in this view. It remains the UMC manufacturing anchor used to benchmark gap, complementarity, and Fab 12i extension value.</p>
      <div class="baseline-metrics">
        <div><span>Lens score</span><strong>${weightedScore(singapore)}</strong></div>
        <div><span>Fab 12i synergy</span><strong>${singapore.fab12i_synergy_score}/5</strong></div>
        <div><span>Customer coverage</span><strong>${singapore.customer_coverage_score}/5</strong></div>
        <div><span>Infrastructure</span><strong>${singapore.infrastructure_score}/5</strong></div>
      </div>
    </article>
  `;
}

function renderSummary() {
  const top = strategies()[0];
  document.getElementById("topRecommendation").textContent = `${top.country.name} + ${top.mode.name}`;
  document.getElementById("topRecommendationText").textContent = `${state.candidateScope === "baseline_only" ? `Next-step score ${top.non_singapore_next_step_score}` : `Score ${top.score}`}. ${top.explanation}`;
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
  const nonSingapore = nonSingaporeCountries();
  const cards = [
    [state.candidateScope === "include_singapore" ? "Best under active lens" : "Best non-Singapore overall", strategies(lens)[0]],
    ["Best non-Singapore advanced packaging option", strategies(lens, nonSingapore).find((item) => item.mode.id === "advanced_packaging")],
    ["Best non-Singapore sales office option", strategies(lens, nonSingapore).find((item) => item.mode.id === "sales_office")],
    ["Best non-Singapore customer engineering support option", strategies(lens, nonSingapore).find((item) => item.mode.id === "customer_support_call_center")],
    ["Best Fab 12i extension market", strategies(lens, nonSingapore).sort((a, b) => b.fab12i_extension_value - a.fab12i_extension_value)[0]],
    ["Best long-term watchlist market", strategies(lens, nonSingapore).sort((a, b) => (b.complementarity_score + (b.country.time_to_market_score || 0) * 10) - (a.complementarity_score + (a.country.time_to_market_score || 0) * 10))[0]]
  ];

  document.getElementById("executiveCards").innerHTML = cards.map(([title, item]) => `
    <article class="executive-card">
      <span class="badge">${title}</span>
      <h3>${item.country.name} | ${item.mode.name}</h3>
      <p><strong>${state.candidateScope === "baseline_only" ? item.non_singapore_next_step_score : item.score}: ${item.label}</strong></p>
      <p>${item.explanation}</p>
      ${item.country.id !== "singapore" ? `<p><strong>Baseline metrics:</strong> gap to Singapore ${item.singapore_baseline_gap}; complementarity ${item.complementarity_score}; Fab 12i extension value ${item.fab12i_extension_value}.</p>` : ""}
      ${freshnessBadge(item.country)}
      <div class="source-badges">${sourceBadges(item.country.source_ids)}</div>
    </article>
  `).join("");
}

function renderMatrix() {
  const topKeys = new Set(strategies().slice(0, 3).map((item) => `${item.country.id}-${item.mode.id}`));
  const hideCheckbox = document.getElementById("hideSingaporeHeatmap");
  const nonSingaporeCheckbox = document.getElementById("nonSingaporeOnlyHeatmap");
  if (hideCheckbox) {
    hideCheckbox.checked = state.hideSingaporeHeatmap;
    hideCheckbox.onchange = () => {
      state.hideSingaporeHeatmap = hideCheckbox.checked;
      renderMatrix();
    };
  }
  if (nonSingaporeCheckbox) {
    nonSingaporeCheckbox.checked = state.nonSingaporeOnlyHeatmap;
    nonSingaporeCheckbox.onchange = () => {
      state.nonSingaporeOnlyHeatmap = nonSingaporeCheckbox.checked;
      if (nonSingaporeCheckbox.checked) state.hideSingaporeHeatmap = true;
      renderMatrix();
    };
  }
  document.getElementById("matrixBody").innerHTML = matrixCountries().map((country) => {
    const cells = state.modes.map((mode) => {
      const score = strategyScore(country, mode);
      const metrics = baselineMetrics(country, mode);
      return `
        <td class="heat-cell ${heatClass(score)} ${topKeys.has(`${country.id}-${mode.id}`) ? "top-strategy-cell" : ""}">
          <strong>${score}</strong>
          <span>${recommendationLabel(score)}</span>
          <small>${activeLens().name}</small>
          ${country.id !== "singapore" ? `<small>Gap ${metrics.singapore_baseline_gap} | Ext ${metrics.fab12i_extension_value}</small>` : ""}
          <button class="explain-btn" type="button" data-explain-country="${country.id}" data-explain-mode="${mode.id}" aria-label="Explain ${country.name} ${mode.name} score">Explain Score</button>
        </td>
      `;
    }).join("");
    return `<tr><th scope="row">${country.name}<br><small>${weightedScore(country)} lens score</small></th>${cells}</tr>`;
  }).join("");
  const matrixNote = document.getElementById("matrixComparisonNote");
  if (matrixNote) {
    matrixNote.textContent = state.candidateScope === "include_singapore" && !state.hideSingaporeHeatmap && !state.nonSingaporeOnlyHeatmap
      ? "Heatmap includes Singapore as a candidate using normal scoring."
      : "Singapore Fab 12i remains the regional anchor; this heatmap compares next-step non-Singapore options and shows gap / extension signals where available.";
  }

  document.querySelectorAll("[data-explain-country]").forEach((button) => {
    button.addEventListener("click", () => {
      showScoreExplanation(button.dataset.explainCountry, button.dataset.explainMode);
    });
  });
}

function scoreBreakdown(country, mode, lens = activeLens()) {
  const lensEntries = scoringFactorKeys.map((key) => [key, Number(lens.weights[key] || 0)]);
  const positiveWeight = lensEntries.reduce((sum, [key, weight]) => {
    if (key === "execution_risk_penalty") return sum;
    return sum + Math.max(weight, 0);
  }, 0);
  const penaltyWeight = lensEntries.reduce((sum, [key, weight]) => {
    if (key !== "execution_risk_penalty") return sum;
    return sum + Math.abs(Math.min(weight, 0));
  }, 0);
  const modeCriteria = modeFitCriteria[mode.id] || {};
  const positiveModeWeight = Object.values(modeCriteria).reduce((sum, weight) => sum + Math.max(weight, 0), 0);
  const countryConfidence = sourceConfidence(country);

  return scoringFactorKeys.map((key) => {
    const raw = Number(country[key] || 0);
    const weight = Number(lens.weights[key] || 0);
    const modeAdjustment = Number(modeCriteria[key] || 0);
    let weightedContribution = 0;
    if (weight > 0 && positiveWeight) {
      weightedContribution = (raw * weight) / (positiveWeight * 5) * 100;
    }
    if (weight < 0 && penaltyWeight) {
      weightedContribution = -((raw * Math.abs(weight)) / (penaltyWeight * 5) * 22);
    }

    let modeContribution = 0;
    if (modeAdjustment > 0 && positiveModeWeight) {
      modeContribution = (raw * modeAdjustment) / (positiveModeWeight * 5) * 100;
    }
    if (modeAdjustment < 0) {
      modeContribution = -(raw * Math.abs(modeAdjustment) * 4);
    }

    return {
      key,
      label: labelForKey(key),
      raw,
      weight,
      weightedContribution,
      modeAdjustment,
      finalContribution: (weightedContribution * 0.56) + (modeContribution * 0.44),
      confidence: countryConfidence
    };
  });
}

function sourceConfidence(item) {
  if (item.confidence) return item.confidence;
  const confidences = (item.source_ids || []).map((id) => sourceById(id)?.confidence).filter(Boolean);
  return confidences.length ? [...new Set(confidences)].join(", ") : "not specified";
}

function showScoreExplanation(countryId, modeId) {
  const country = state.countries.find((item) => item.id === countryId);
  const mode = state.modes.find((item) => item.id === modeId);
  const modal = document.getElementById("scoreModal");
  if (!country || !mode || !modal) return;

  const lens = activeLens();
  const rows = scoreBreakdown(country, mode, lens);
  document.getElementById("scoreModalTitle").textContent = `${country.name} + ${mode.name}`;
  document.getElementById("scoreModalSummary").innerHTML = `
    <strong>${strategyScore(country, mode, lens)}: ${recommendationLabel(strategyScore(country, mode, lens))}</strong>
    under ${lens.name}. Country lens score ${weightedScore(country, lens)}; mode fit ${modeFit(country, mode.id)}.
  `;
  document.getElementById("scoreModalBody").innerHTML = `
    <div class="table-wrap breakdown-wrap">
      <table class="breakdown-table">
        <thead>
          <tr>
            <th>Factor name</th>
            <th>Raw score</th>
            <th>Weight</th>
            <th>Weighted contribution</th>
            <th>Mode adjustment</th>
            <th>Final contribution</th>
            <th>Source confidence</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><strong>${row.label}</strong><br><small>${row.key}</small></td>
              <td>${row.raw}/5</td>
              <td>${formatScoreNumber(row.weight)}</td>
              <td>${formatScoreNumber(row.weightedContribution)}</td>
              <td>${formatScoreNumber(row.modeAdjustment)}</td>
              <td>${formatScoreNumber(row.finalContribution)}</td>
              <td>${row.confidence}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <p class="modal-note">Final contribution is directional and combines the normalized country lens contribution with the expansion-mode adjustment. The displayed final strategy score also applies mode/lens modifiers and recommended-mode bonus.</p>
  `;
  modal.hidden = false;
  modal.querySelector(".score-modal-close").focus();
}

function formatScoreNumber(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function closeScoreExplanation() {
  const modal = document.getElementById("scoreModal");
  if (modal) modal.hidden = true;
}

function renderLensModel() {
  document.getElementById("lensSelector").innerHTML = `
    ${state.lenses.map((lens) => `
    <button type="button" class="${lens.id === state.activeLens ? "active" : ""}" data-lens="${lens.id}" aria-label="Use ${lens.name} scoring lens">${lens.name}</button>
    `).join("")}
    <button type="button" class="${state.activeLens === "custom_weight_mode" ? "active" : ""}" data-lens="custom_weight_mode" aria-label="Use Custom Weight Mode scoring lens">Custom Weight Mode</button>
  `;

  document.querySelectorAll("[data-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.lens !== "custom_weight_mode") {
        state.lastPresetLens = button.dataset.lens;
      }
      state.activeLens = button.dataset.lens;
      render();
    });
  });

  const lens = activeLens();
  document.getElementById("weightControls").innerHTML = `
    <div class="formula-card">
      <h3>${lens.name}</h3>
      <p>${lens.description}</p>
      <p><strong>Formula:</strong> normalized country score from weighted 1-5 factors + expansion-mode-specific fit + mode/lens modifier + recommended-mode bonus. Foundry, packaging, sales, and customer engineering support use different fit weights. Execution risk penalty reduces scores.</p>
      <div class="weight-actions">
        <button type="button" id="resetWeights">Reset to Preset</button>
        <button type="button" id="exportWeights">Export Current Weights</button>
      </div>
    </div>
    ${state.activeLens === "custom_weight_mode" ? renderCustomWeightControls(lens.weights) : renderPresetWeightList(lens.weights)}
    ${renderFactorDefinitions()}
  `;

  document.getElementById("weightTotal").textContent = state.activeLens === "custom_weight_mode"
    ? `${positiveWeightTotal(lens.weights)} positive weight`
    : lens.name;
  bindWeightControls();
  renderRanking();
}

function renderPresetWeightList(weights) {
  return Object.entries(weights).map(([key, value]) => `
    <div class="control compact-control">
      <label><span>${labelForKey(key)}</span><span>${value}</span></label>
    </div>
  `).join("");
}

function renderCustomWeightControls(weights) {
  return `
    <div class="custom-weight-grid">
      ${scoringFactorKeys.map((key) => {
        const displayValue = sliderValueForWeight(key, weights[key]);
        const storedValue = key === "execution_risk_penalty" ? `-${displayValue}` : displayValue;
        return `
          <div class="control custom-control">
            <label for="weight_${key}">
              <span>${labelForKey(key)}</span>
              <span id="value_${key}">${storedValue}</span>
            </label>
            <input id="weight_${key}" type="range" min="0" max="30" step="1" value="${displayValue}" data-custom-weight="${key}" aria-label="Weight for ${labelForKey(key)}">
            <p>${factorDefinitions[key]}</p>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderFactorDefinitions() {
  return `
    <div class="factor-definitions">
      <h3>Factor Definitions</h3>
      <dl>
        ${scoringFactorKeys.map((key) => `
          <div>
            <dt>${key}</dt>
            <dd>${factorDefinitions[key]}</dd>
          </div>
        `).join("")}
      </dl>
    </div>
  `;
}

function bindWeightControls() {
  document.getElementById("resetWeights")?.addEventListener("click", () => {
    state.customWeights = weightsFromLens(presetLensById());
    if (state.activeLens === "custom_weight_mode") {
      render();
    }
  });

  document.getElementById("exportWeights")?.addEventListener("click", exportCurrentWeights);

  document.querySelectorAll("[data-custom-weight]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const key = slider.dataset.customWeight;
      const value = Number(slider.value);
      state.customWeights[key] = key === "execution_risk_penalty" ? -value : value;
      const valueEl = document.getElementById(`value_${key}`);
      if (valueEl) valueEl.textContent = key === "execution_risk_penalty" ? `-${value}` : value;
      document.getElementById("weightTotal").textContent = `${positiveWeightTotal(state.customWeights)} positive weight`;
      renderSummary();
      renderSingaporeBaselineCard();
      renderExecutiveCards();
      renderMatrix();
      renderRanking();
      renderRecommendations();
      renderDeepDive();
      renderCountryCards();
    });
  });
}

function exportCurrentWeights() {
  const lens = activeLens();
  const payload = {
    exported_at: new Date().toISOString(),
    scoring_mode: lens.name,
    lens_id: lens.id,
    positive_weight_total: positiveWeightTotal(lens.weights),
    weights: lens.weights,
    note: "Raw factor scores are 1-5. Positive weights are normalized; execution_risk_penalty reduces the final score."
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `umc-current-weights-${lens.id}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderRanking() {
  const ranking = [...candidateCountries()].sort((a, b) => weightedScore(b) - weightedScore(a));
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
            <td>${best.mode.name} (${state.candidateScope === "baseline_only" ? best.non_singapore_next_step_score : best.score})</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>
    <p class="comparison-note">${scopeNoteText()}</p>
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
  const best = strategies(activeLens(), [country])[0];

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
    const countryStrategies = strategies(activeLens(), [country]);
    const bestModes = countryStrategies.slice(0, 2).map((item) => item.mode.name).join(", ");
    return `
      <article class="country-card">
        <button class="country-card-toggle" type="button" aria-expanded="false" aria-controls="${country.id}_body">
          <span>${country.name}</span><span>${weightedScore(country)}</span>
        </button>
        <div id="${country.id}_body" class="country-card-body">
          <p><strong>Best modes:</strong> ${bestModes}</p>
          <p><strong>UMC strategy:</strong> ${countryStrategies[0].explanation}</p>
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
  const nonSingapore = nonSingaporeCountries();
  const recommendationSet = state.candidateScope === "include_singapore"
    ? strategies().slice(0, 3).map((item, index) => [`Top ${index + 1}`, item])
    : [
      ["Best non-Singapore advanced packaging option", strategies(activeLens(), nonSingapore).find((item) => item.mode.id === "advanced_packaging")],
      ["Best non-Singapore sales office option", strategies(activeLens(), nonSingapore).find((item) => item.mode.id === "sales_office")],
      ["Best non-Singapore customer engineering support option", strategies(activeLens(), nonSingapore).find((item) => item.mode.id === "customer_support_call_center")],
      ["Best Fab 12i extension market", strategies(activeLens(), nonSingapore).sort((a, b) => b.fab12i_extension_value - a.fab12i_extension_value)[0]],
      ["Best long-term watchlist market", strategies(activeLens(), nonSingapore).sort((a, b) => (b.complementarity_score + (b.country.time_to_market_score || 0) * 10) - (a.complementarity_score + (a.country.time_to_market_score || 0) * 10))[0]]
    ];
  document.getElementById("recommendationCards").innerHTML = recommendationSet.map(([title, item]) => `
    <article class="recommendation-card top-strategy">
      <span class="badge">${title}</span>
      <h3>${item.country.name} + ${item.mode.name}</h3>
      <p><strong>${state.candidateScope === "baseline_only" ? item.non_singapore_next_step_score : item.score}: ${item.label}</strong></p>
      <p>${item.explanation}</p>
      <p><strong>UMC strategic need:</strong> ${modeNeedMap[item.mode.id]}</p>
      <p><strong>Score inputs:</strong> country attractiveness ${item.country.country_attractiveness_score}/5; mode fit ${item.country.expansion_mode_fit_score}/5; Fab 12i synergy ${item.country.fab12i_synergy_score}/5; global layout fit ${item.country.umc_global_layout_fit_score}/5; risk penalty ${item.country.execution_risk_penalty}/5.</p>
      ${item.country.id !== "singapore" ? `<p><strong>Singapore baseline comparison:</strong> singapore_baseline_gap ${item.singapore_baseline_gap}; complementarity_score ${item.complementarity_score}; fab12i_extension_value ${item.fab12i_extension_value}; non_singapore_next_step_score ${item.non_singapore_next_step_score}.</p>` : ""}
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

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-score-modal]") || event.target.id === "scoreModal") {
    closeScoreExplanation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeScoreExplanation();
  }
});

loadData().catch((error) => {
  document.body.innerHTML = `
    <main class="section">
      <h1>Data could not be loaded</h1>
      <p class="muted">Run this folder through a local static server so the browser can fetch the JSON files.</p>
      <pre>${error.message}</pre>
    </main>
  `;
});
