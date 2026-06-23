const files = {
  countries: "data/countries.json",
  modes: "data/expansion_modes.json",
  lenses: "data/scoring_lenses.json",
  evidenceLibrary: "data/evidence_library.json",
  decisionClaims: "data/decision_claims.json",
  decisionStrategies: "data/decision_strategies.json",
  countryProfiles: "data/country_profiles.json",
  sources: "data/sources.json",
  decisionReadiness: "data/decision_readiness.json"
};

const state = {
  countries: [],
  modes: [],
  lenses: [],
  evidenceLibrary: [],
  decisionClaims: [],
  decisionStrategies: [],
  countryProfiles: [],
  sources: [],
  decisionReadiness: {
    universal_investment_gates: [],
    countries: []
  },
  baselineSingapore: true,
  activeLens: "fab12i_synergy",
  customWeights: {},
  evidenceClaim: "All",
  evidenceCountry: "All",
  evidenceConfidence: "All"
};

const factorKeys = [
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

const labels = {
  policy_score: "Policy incentives",
  ecosystem_score: "Semiconductor ecosystem",
  talent_score: "Talent availability",
  infrastructure_score: "Infrastructure",
  customer_proximity_score: "Customer proximity",
  cost_efficiency_score: "Cost efficiency",
  geopolitical_stability_score: "Geopolitical stability",
  time_to_market_score: "Time to market",
  esg_readiness_score: "ESG / power / water",
  fab12i_synergy_score: "Fab 12i synergy",
  umc_global_layout_fit_score: "UMC global layout fit",
  ecosystem_adjacency_score: "Ecosystem adjacency",
  customer_coverage_score: "Customer coverage",
  partner_potential_score: "Partner potential",
  execution_risk_penalty: "Execution risk penalty"
};

const industryCategoryLabels = {
  foundry_wafer_manufacturing: "Foundry / Wafer Manufacturing",
  packaging_assembly_test: "Packaging, Assembly & Test",
  ic_design_ip: "IC Design & IP",
  equipment_materials: "Equipment & Materials",
  electronics_ems: "Electronics & EMS",
  public_policy: "Public Policy",
  infrastructure: "Infrastructure"
};

const modeLabels = {
  optimize_existing_fab12i_p3: "Optimize Fab 12i P3 / no new external expansion",
  sales_office: "Sales office",
  customer_engineering_hub: "Customer engineering hub",
  packaging_osat_partnership: "Packaging / OSAT partnership",
  foundry_manufacturing_expansion: "Foundry",
  watchlist: "Watchlist"
};

const modeFitCriteria = {
  optimize_existing_fab12i_p3: {
    fab12i_synergy_score: 0.28,
    umc_global_layout_fit_score: 0.2,
    customer_coverage_score: 0.14,
    time_to_market_score: 0.12,
    infrastructure_score: 0.1,
    esg_readiness_score: 0.08,
    execution_risk_penalty: -0.08
  },
  sales_office: {
    customer_coverage_score: 0.26,
    customer_proximity_score: 0.2,
    time_to_market_score: 0.16,
    geopolitical_stability_score: 0.12,
    fab12i_synergy_score: 0.12,
    cost_efficiency_score: 0.08,
    execution_risk_penalty: -0.06
  },
  customer_engineering_hub: {
    talent_score: 0.22,
    customer_coverage_score: 0.2,
    customer_proximity_score: 0.14,
    infrastructure_score: 0.12,
    cost_efficiency_score: 0.1,
    fab12i_synergy_score: 0.14,
    execution_risk_penalty: -0.08
  },
  packaging_osat_partnership: {
    ecosystem_adjacency_score: 0.28,
    partner_potential_score: 0.24,
    ecosystem_score: 0.16,
    talent_score: 0.1,
    infrastructure_score: 0.1,
    fab12i_synergy_score: 0.12,
    execution_risk_penalty: -0.1
  },
  foundry_manufacturing_expansion: {
    infrastructure_score: 0.2,
    esg_readiness_score: 0.18,
    policy_score: 0.14,
    talent_score: 0.12,
    ecosystem_score: 0.12,
    fab12i_synergy_score: 0.14,
    execution_risk_penalty: -0.18
  }
};

async function loadData() {
  const [countries, modes, lenses, evidenceLibrary, decisionClaims, decisionStrategies, countryProfiles, sources, decisionReadiness] = await Promise.all(
    Object.values(files).map((url) => fetch(url).then((response) => response.json()))
  );
  Object.assign(state, { countries, modes, lenses, evidenceLibrary, decisionClaims, decisionStrategies, countryProfiles, sources, decisionReadiness });
  state.customWeights = weightsFromLens(activeLens());
  render();
}

function activeLens() {
  if (state.activeLens === "custom") {
    return {
      id: "custom",
      name: "Custom weights",
      description: "User-defined screening weights.",
      weights: state.customWeights
    };
  }
  return state.lenses.find((lens) => lens.id === state.activeLens) || state.lenses[0];
}

function weightsFromLens(lens) {
  return factorKeys.reduce((weights, key) => {
    weights[key] = Number(lens?.weights?.[key] || 0);
    return weights;
  }, {});
}

function candidates() {
  return state.baselineSingapore ? state.countries.filter((country) => country.id !== "singapore") : state.countries;
}

function singapore() {
  return state.countries.find((country) => country.id === "singapore");
}

function modeById(modeId) {
  return state.modes.find((mode) => mode.id === modeId) || { id: modeId, name: modeLabels[modeId] || modeId };
}

function externalModes() {
  return state.modes.filter((mode) => mode.id !== "optimize_existing_fab12i_p3");
}

function fab12iP3Strategy() {
  const country = singapore();
  const mode = modeById("optimize_existing_fab12i_p3");
  if (!country || !mode) return null;
  const metrics = baselineMetrics(country, mode.id);
  const readiness = readinessFor(country);
  return {
    country,
    mode,
    score: 94,
    strategicScore: 94,
    rawScore: strategyScore(country, mode.id),
    metrics,
    readiness,
    evidence: evidenceFor(country, mode.id),
    decisionLabel: "Optimize Existing Fab 12i P3 / No New External Expansion"
  };
}

function weightedScore(country, lens = activeLens()) {
  const entries = Object.entries(lens.weights || {});
  const positiveWeight = entries.reduce((sum, [key, weight]) => key === "execution_risk_penalty" ? sum : sum + Math.max(weight, 0), 0);
  const penaltyWeight = Math.abs(Number(lens.weights?.execution_risk_penalty || 0));
  const positive = entries.reduce((sum, [key, weight]) => {
    if (key === "execution_risk_penalty" || weight <= 0) return sum;
    return sum + (Number(country[key]) || 0) * weight;
  }, 0);
  const base = positiveWeight ? positive / (positiveWeight * 5) * 100 : 0;
  const penalty = penaltyWeight ? ((Number(country.execution_risk_penalty) || 0) * penaltyWeight) / (penaltyWeight * 5) * 20 : 0;
  return clamp(Math.round(base - penalty), 1, 100);
}

function modeFit(country, modeId) {
  const criteria = modeFitCriteria[modeId] || {};
  const positiveWeight = Object.values(criteria).reduce((sum, weight) => sum + Math.max(weight, 0), 0);
  const positive = Object.entries(criteria).reduce((sum, [key, weight]) => {
    if (weight <= 0) return sum;
    return sum + (Number(country[key]) || 0) * weight;
  }, 0);
  const penalty = Math.abs(criteria.execution_risk_penalty || 0) * (Number(country.execution_risk_penalty) || 0) * 4;
  return clamp(Math.round(positive / (positiveWeight * 5) * 100 - penalty), 1, 100);
}

function strategyScore(country, modeId, lens = activeLens()) {
  const score = weightedScore(country, lens) * 0.58 + modeFit(country, modeId) * 0.42;
  return clamp(Math.round(score), 1, 100);
}

function baselineMetrics(country, modeId) {
  const base = singapore();
  if (!base || country.id === "singapore") return { gap: 0, extension: 100, complementarity: 100, nextStepScore: strategyScore(country, modeId) };
  const score = strategyScore(country, modeId);
  const gap = Math.max(strategyScore(base, modeId) - score, 0);
  const extension = clamp(Math.round(((country.fab12i_synergy_score || 0) * 0.35 + (country.partner_potential_score || 0) * 0.25 + (country.ecosystem_adjacency_score || 0) * 0.2 + (country.customer_coverage_score || 0) * 0.2) * 20), 1, 100);
  const complementarity = clamp(Math.round(((country.cost_efficiency_score || 0) * 0.25 + (country.partner_potential_score || 0) * 0.25 + (country.ecosystem_adjacency_score || 0) * 0.25 + (country.customer_coverage_score || 0) * 0.25) * 20), 1, 100);
  const nextStepScore = clamp(Math.round(score * 0.56 + extension * 0.24 + complementarity * 0.2 - gap * 0.12), 1, 100);
  return { gap, extension, complementarity, nextStepScore };
}

function allStrategies(countries = candidates()) {
  const strategies = countries.flatMap((country) => state.modes.map((mode) => {
    const metrics = baselineMetrics(country, mode.id);
    const strategicScore = state.baselineSingapore ? metrics.nextStepScore : strategyScore(country, mode.id);
    const realismAdjustment = {
      optimize_existing_fab12i_p3: country.id === "singapore" ? 12 : -80,
      sales_office: 2,
      customer_engineering_hub: 4,
      packaging_osat_partnership: country.id === "malaysia" ? -16 : -4,
      foundry_manufacturing_expansion: -30
    }[mode.id] || 0;
    const score = clamp(strategicScore + realismAdjustment, 1, 100);
    return {
      country,
      mode,
      score,
      strategicScore,
      rawScore: strategyScore(country, mode.id),
      metrics,
      readiness: readinessFor(country),
      evidence: evidenceFor(country, mode.id)
    };
  }));
  const includeInternalOption = state.baselineSingapore && countries.length === candidates().length;
  if (includeInternalOption) {
    const internal = fab12iP3Strategy();
    if (internal) strategies.push(internal);
  }
  return strategies.sort((a, b) => b.score - a.score);
}

function evidenceFor(country, modeId) {
  return state.evidenceLibrary.filter((item) => item.country === country.name && strategyMode(item.related_strategy_id) === modeId);
}

function readinessFor(country) {
  const readinessRows = Array.isArray(state.decisionReadiness)
    ? state.decisionReadiness
    : state.decisionReadiness.countries || [];
  return readinessRows.find((item) => item.country_id === country.id) || {};
}

function primaryDecisionStrategy() {
  return state.decisionStrategies[0] || null;
}

function claimById(id) {
  return state.decisionClaims.find((claim) => claim.id === id);
}

function strategyName(id) {
  return state.decisionStrategies.find((strategy) => strategy.id === id)?.strategy_name || id;
}

function strategyMode(id) {
  return state.decisionStrategies.find((strategy) => strategy.id === id)?.expansion_mode;
}

function claimForStrategy(strategyId) {
  const map = {
    optimize_fab12i_p3: "focus_fab12i_p3",
    malaysia_packaging_osat_watchlist: "malaysia_osat_watchlist",
    vietnam_customer_engineering_watchlist: "sales_engineering_customer_validation",
    thailand_auto_power_watchlist: "sales_engineering_customer_validation",
    philippines_support_ops_watchlist: "sales_engineering_customer_validation",
    indonesia_design_policy_watchlist: "other_sea_watchlists"
  };
  return claimById(map[strategyId]);
}

function render() {
  renderBaseline();
  renderSummary();
  renderLensSelector();
  renderCustomWeights();
  renderMatrix();
  renderEvidenceFilters();
  renderEvidence();
  renderDecisionFunnel();
  renderCountryCards();
  renderSources();
}

function renderBaseline() {
  const toggle = document.getElementById("baselineToggle");
  toggle.checked = state.baselineSingapore;
  toggle.onchange = () => {
    state.baselineSingapore = toggle.checked;
    render();
  };
  document.getElementById("baselineNote").textContent = state.baselineSingapore
    ? "Singapore Fab 12i is treated as UMC's existing Southeast Asia anchor. This view allows the best next step to be no new external expansion while Fab 12i P3 ramps."
    : "Singapore is included as a normal candidate in the ranking and heatmap.";
  const anchor = singapore();
  document.getElementById("baselineCard").innerHTML = state.baselineSingapore && anchor ? `
    <article class="anchor-card">
      <span class="badge">Existing anchor</span>
      <h3>Singapore Fab 12i</h3>
      <p>${anchor.summary}</p>
      <div class="mini-stats">
        <div><span>Lens score</span><strong>${weightedScore(anchor)}</strong></div>
        <div><span>Fab 12i synergy</span><strong>${anchor.fab12i_synergy_score}/5</strong></div>
      </div>
    </article>
  ` : "";
}

function renderSummary() {
  const top = primaryDecisionStrategy();
  const mode = modeById(top?.expansion_mode);
  document.getElementById("topRecommendation").textContent = top?.strategy_name || "Loading";
  document.getElementById("topRecommendationText").textContent = top?.strategic_rationale || "Loading screening output...";
  document.getElementById("topMode").textContent = mode.name;
}

function renderLensSelector() {
  const selector = document.getElementById("lensSelector");
  selector.innerHTML = `
    ${state.lenses.map((lens) => `<button type="button" class="${lens.id === state.activeLens ? "active" : ""}" data-lens="${lens.id}">${lens.name.replace("Advanced Packaging", "Packaging / OSAT")}</button>`).join("")}
    <button type="button" class="${state.activeLens === "custom" ? "active" : ""}" data-lens="custom">Custom weights</button>
  `;
  selector.querySelectorAll("[data-lens]").forEach((button) => {
    button.onclick = () => {
      state.activeLens = button.dataset.lens;
      if (state.activeLens !== "custom") state.customWeights = weightsFromLens(activeLens());
      render();
    };
  });
}

function renderCustomWeights() {
  const panel = document.getElementById("customWeightsPanel");
  if (state.activeLens !== "custom") {
    panel.innerHTML = "";
    return;
  }
  panel.innerHTML = `
    <div class="custom-grid">
      ${factorKeys.map((key) => {
        const value = key === "execution_risk_penalty" ? Math.abs(state.customWeights[key] || 0) : Math.max(state.customWeights[key] || 0, 0);
        return `
          <label>
            <span>${labels[key]}</span>
            <strong id="value_${key}">${key === "execution_risk_penalty" ? -value : value}</strong>
            <input type="range" min="0" max="30" value="${value}" data-weight="${key}" aria-label="${labels[key]} weight">
          </label>
        `;
      }).join("")}
    </div>
  `;
  panel.querySelectorAll("[data-weight]").forEach((input) => {
    input.oninput = () => {
      const key = input.dataset.weight;
      const value = Number(input.value);
      state.customWeights[key] = key === "execution_risk_penalty" ? -value : value;
      document.getElementById(`value_${key}`).textContent = key === "execution_risk_penalty" ? -value : value;
      renderMatrix();
      renderSummary();
      renderDecisionFunnel();
    };
  });
}

function renderMatrix() {
  document.getElementById("matrixBody").innerHTML = candidates().map((country) => {
    const cells = externalModes().map((mode) => {
      const score = state.baselineSingapore ? baselineMetrics(country, mode.id).nextStepScore : strategyScore(country, mode.id);
      const metrics = baselineMetrics(country, mode.id);
      return `
        <td class="${heatClass(score)}">
          <strong>${score}</strong>
          <span>${labelForScore(score)}</span>
          ${state.baselineSingapore && country.id !== "singapore" ? `<small>Gap ${metrics.gap} | Extension ${metrics.extension}</small>` : ""}
          <button type="button" class="text-button" data-explain="${country.id}|${mode.id}">Explain</button>
        </td>
      `;
    }).join("");
    return `<tr><th>${country.name}</th>${cells}</tr>`;
  }).join("");
  document.querySelectorAll("[data-explain]").forEach((button) => {
    button.onclick = () => {
      const [countryId, modeId] = button.dataset.explain.split("|");
      showExplanation(countryId, modeId);
    };
  });
}

function renderEvidenceFilters() {
  const claims = ["All", ...state.decisionClaims.map((claim) => claim.id)];
  const countries = ["All", ...new Set(state.evidenceLibrary.map((item) => item.country))];
  const confidence = ["All", "High", "Medium", "Low"];
  renderFilter("claimFilters", claims, state.evidenceClaim, (value) => state.evidenceClaim = value, (value) => claimById(value)?.claim_title || value);
  renderFilter("countryFilters", countries, state.evidenceCountry, (value) => state.evidenceCountry = value, (value) => value);
  renderFilter("confidenceFilters", confidence, state.evidenceConfidence, (value) => state.evidenceConfidence = value, (value) => value);
}

function renderFilter(id, values, active, setter, labeler) {
  const el = document.getElementById(id);
  el.innerHTML = values.map((value) => `<button type="button" class="${value === active ? "active" : ""}" data-filter="${value}">${labeler(value)}</button>`).join("");
  el.querySelectorAll("[data-filter]").forEach((button) => {
    button.onclick = () => {
      setter(button.dataset.filter);
      renderEvidenceFilters();
      renderEvidence();
    };
  });
}

function renderEvidence() {
  const items = state.evidenceLibrary.filter((item) => {
    const claimMatch = state.evidenceClaim === "All" || item.decision_claim_id === state.evidenceClaim;
    const countryMatch = state.evidenceCountry === "All" || item.country === state.evidenceCountry;
    const confidenceMatch = state.evidenceConfidence === "All" || item.confidence === state.evidenceConfidence;
    return claimMatch && countryMatch && confidenceMatch;
  });
  const grouped = groupBy(items, "decision_claim_id");
  const claims = state.decisionClaims.filter((claim) => grouped[claim.id]?.length);
  document.getElementById("evidenceLibrary").innerHTML = claims.map((claim, index) => {
    const claimItems = grouped[claim.id];
    const summary = claimEvidenceSummary(claim.id);
    return `
      <details id="claim-${claim.id}" class="evidence-country" ${index < 2 ? "open" : ""}>
        <summary>
          <span>${claim.claim_title}</span>
          <small>${claim.evidence_strength} evidence | ${summary.evidenceCount} evidence items | ${claim.validation_gaps.length} validation gaps</small>
        </summary>
        <article class="claim-summary-card">
          <h3>${claim.claim_title}</h3>
          <p><strong>Interpretation:</strong> ${claim.management_interpretation}</p>
          <p><strong>Evidence strength:</strong> ${claim.evidence_strength}</p>
          <p><strong>Recommended action:</strong> ${claim.recommended_action}</p>
          <p><strong>Validation gaps:</strong> ${claim.validation_gaps.join("; ")}</p>
        </article>
        <div class="evidence-type-groups">
          <section class="evidence-type-group">
            <div class="evidence-card-grid">
              ${claimItems.map(renderEvidenceCard).join("")}
            </div>
          </section>
        </div>
      </details>
    `;
  }).join("") || `<p class="muted">No evidence matches the selected filters.</p>`;
}

function renderDecisionFunnel() {
  document.getElementById("decisionCards").innerHTML = state.decisionStrategies.map((strategy) => {
    const gateSummary = summarizeGates(strategy.gate_status);
    const claim = claimForStrategy(strategy.id);
    const evidence = claim ? state.evidenceLibrary.filter((item) => item.decision_claim_id === claim.id) : [];
    return `
      <article class="decision-card">
        <span class="readiness">${strategy.status}</span>
        <h3>${strategy.strategy_name}</h3>
        <p><strong>Strategic rationale:</strong> ${strategy.strategic_rationale}</p>
        <p><strong>Decision supported:</strong> ${strategy.decision_supported}</p>
        <div class="gate-summary">
          <span class="${gateSummary.canProceed ? "gate-ok" : "gate-hold"}">${gateSummary.decision}</span>
          <small>${gateSummary.blockers} blockers | ${gateSummary.notValidated} not validated</small>
        </div>
        <div class="gate-grid">
          ${Object.entries(strategy.gate_status).map(([key, status]) => `
            <div class="gate-pill ${gateClass(status)}">
              <span>${gateLabel(key)}</span>
              <strong>${status}</strong>
            </div>
          `).join("")}
        </div>
        ${claim ? `
          <div class="linked-evidence">
            <p><strong>Evidence:</strong> ${evidence.length} items | <strong>Strength:</strong> ${claim.evidence_strength}</p>
            <p><strong>Top linked evidence:</strong> ${evidence.slice(0, 3).map((item) => item.title).join("; ")}</p>
            <p><strong>Unresolved evidence gaps:</strong> ${claim.validation_gaps.join("; ")}</p>
            <button type="button" class="text-button" data-view-claim="${claim.id}">View supporting evidence</button>
          </div>
        ` : ""}
        <p><strong>Next action:</strong> ${strategy.next_action}</p>
        <p><strong>Suggested owner:</strong> ${strategy.suggested_owner}</p>
      </article>
    `;
  }).join("");
}

function renderCountryCards() {
  document.getElementById("countryCards").innerHTML = state.countryProfiles.map((profile) => {
    const evidence = profile.top_evidence_ids
      .map((id) => state.evidenceLibrary.find((item) => item.id === id))
      .filter(Boolean);
    return `
      <article class="country-card">
        <h3>${profile.country}</h3>
        <p><strong>Thesis:</strong> ${profile.thesis}</p>
        <p><strong>Best-fit role:</strong> ${profile.best_fit_role}</p>
        <p><strong>Unique advantage:</strong> ${profile.unique_advantage}</p>
        <p><strong>Unique risk:</strong> ${profile.unique_risk}</p>
        <p><strong>Relevant locations:</strong> ${profile.relevant_locations.join(", ")}</p>
        <p><strong>Key evidence:</strong> ${evidence.map((item) => item.title).join("; ")}</p>
        <details>
          <summary>What moves priority up</summary>
          <ul>${profile.move_up_triggers.map((item) => `<li>${item}</li>`).join("")}</ul>
        </details>
        <details>
          <summary>What moves priority down</summary>
          <ul>${profile.move_down_triggers.map((item) => `<li>${item}</li>`).join("")}</ul>
        </details>
        <details>
          <summary>Evidence gaps</summary>
          <ul>${profile.evidence_gaps.map((gap) => `<li>${gap}</li>`).join("")}</ul>
        </details>
      </article>
    `;
  }).join("");
}

function renderEvidenceCard(item) {
  return `
    <article class="evidence-card">
      <div class="evidence-card-top">
        <span class="badge muted-badge">${industryCategoryLabels[item.industry_category] || item.industry_category}</span>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Country / location:</strong> ${item.country} | ${item.location}</p>
      <p><strong>What it supports:</strong> ${item.what_it_supports}</p>
      <p><strong>Decision implication:</strong> ${item.decision_implication}</p>
      <p><strong>Limitation:</strong> ${item.limitation}</p>
      <p><strong>What to validate next:</strong> ${item.what_to_validate_next.join("; ")}</p>
      <p><strong>Related strategy:</strong> ${strategyName(item.related_strategy_id)}</p>
      <p><strong>Confidence:</strong> ${item.confidence} | <strong>Data year:</strong> ${item.data_year}</p>
      <p><strong>Source:</strong> ${item.source_badge || `${item.source_ids.length} source(s)`}</p>
    </article>
  `;
}

function claimEvidenceSummary(claimId) {
  const items = state.evidenceLibrary.filter((item) => item.decision_claim_id === claimId);
  return {
    evidenceCount: items.length
  };
}

function summarizeGates(gates) {
  const statuses = Object.values(gates || {});
  const blockers = statuses.filter((status) => status === "Blocker").length;
  const notValidated = statuses.filter((status) => status === "Not validated").length;
  const canProceed = blockers === 0 && notValidated === 0;
  const decision = canProceed ? "Can proceed to execution / Stage 1" : "Stay in Watchlist / Do not approve capex";
  return { blockers, notValidated, canProceed, decision };
}

function gateLabel(key) {
  const labels = {
    customer_overlap: "Customer overlap",
    revenue_mechanism: "Revenue mechanism",
    partner_shortlist: "Partner shortlist",
    government_incentives_tax: "Government incentives / tax",
    capex_opex_estimate: "Capex / opex estimate",
    roic_payback: "ROIC / payback",
    infrastructure_utilities: "Infrastructure / utilities",
    engineering_talent: "Engineering talent",
    legal_regulatory: "Legal / regulatory"
  };
  return labels[key] || key;
}

function gateClass(status) {
  return {
    "Validated": "gate-validated",
    "Partial": "gate-partial",
    "Not validated": "gate-missing",
    "Not required": "gate-na",
    "Blocker": "gate-blocker"
  }[status] || "gate-missing";
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key] || "Other";
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

function renderSources() {
  document.getElementById("sourcesList").innerHTML = state.sources.slice(0, 80).map((source) => `
    <article>
      <a href="${source.url}" target="_blank" rel="noopener">${source.title}</a>
      <p>${source.publisher} | Data year ${source.data_year || source.year} | ${source.confidence || "Unknown"} confidence</p>
    </article>
  `).join("");
}

function showExplanation(countryId, modeId) {
  const country = state.countries.find((item) => item.id === countryId);
  const mode = state.modes.find((item) => item.id === modeId);
  const lens = activeLens();
  const modal = document.getElementById("scoreModal");
  const entries = factorKeys.map((key) => {
    const raw = Number(country[key] || 0);
    const weight = Number(lens.weights[key] || 0);
    const contribution = key === "execution_risk_penalty" ? -raw * Math.abs(weight) : raw * Math.max(weight, 0);
    return { key, raw, weight, contribution };
  }).filter((row) => row.weight !== 0);
  document.getElementById("scoreModalTitle").textContent = `${country.name} - ${mode.name}`;
  document.getElementById("scoreModalSummary").textContent = `Screening score ${state.baselineSingapore ? baselineMetrics(country, mode.id).nextStepScore : strategyScore(country, mode.id)}. This is a prioritization signal, not an investment decision.`;
  document.getElementById("scoreModalBody").innerHTML = `
    <table class="breakdown-table">
      <thead><tr><th>Factor</th><th>Raw</th><th>Weight</th><th>Directional contribution</th></tr></thead>
      <tbody>${entries.map((row) => `<tr><td>${labels[row.key]}</td><td>${row.raw}/5</td><td>${row.weight}</td><td>${Math.round(row.contribution)}</td></tr>`).join("")}</tbody>
    </table>
  `;
  modal.hidden = false;
}

function entryMode(modeId) {
  const map = {
    optimize_existing_fab12i_p3: "execute committed Fab 12i P3 ramp before new external capex",
    sales_office: "representative office or focused account coverage",
    customer_engineering_hub: "customer engineering hub with FAE and quality escalation",
    packaging_osat_partnership: "conditional watchlist until demand, partner economics, incentives, and ROIC are validated",
    foundry_manufacturing_expansion: "manufacturing diligence only after customer, incentive, utility, and ROIC validation"
  };
  return map[modeId] || "watchlist";
}

function labelForScore(score) {
  if (score >= 82) return "High priority";
  if (score >= 70) return "Diligence target";
  if (score >= 58) return "Watchlist";
  return "Low priority";
}

function heatClass(score) {
  if (score >= 82) return "heat-strong";
  if (score >= 70) return "heat-viable";
  if (score >= 58) return "heat-watch";
  return "heat-low";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]") || event.target.id === "scoreModal") {
    document.getElementById("scoreModal").hidden = true;
  }
  const claimButton = event.target.closest("[data-view-claim]");
  if (claimButton) {
    state.evidenceClaim = claimButton.dataset.viewClaim;
    state.evidenceCountry = "All";
    state.evidenceConfidence = "All";
    renderEvidenceFilters();
    renderEvidence();
    document.getElementById("evidence")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.getElementById("scoreModal").hidden = true;
});

loadData().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>Data could not be loaded</h1><p>${error.message}</p></main>`;
});
