const files = {
  countries: "data/countries.json",
  modes: "data/expansion_modes.json",
  cases: "data/case_studies.json",
  sources: "data/sources.json"
};

const state = {
  countries: [],
  modes: [],
  cases: [],
  sources: [],
  selectedCountry: "singapore",
  activeCaseFilter: "All",
  weights: {
    policy_score: 10,
    ecosystem_score: 14,
    talent_score: 12,
    infrastructure_score: 12,
    customer_proximity_score: 12,
    cost_efficiency_score: 8,
    geopolitical_stability_score: 10,
    time_to_market_score: 10,
    esg_readiness_score: 8
  }
};

const criteria = [
  ["policy_score", "Policy incentives"],
  ["ecosystem_score", "Semiconductor ecosystem"],
  ["talent_score", "Talent availability"],
  ["infrastructure_score", "Infrastructure and utilities"],
  ["customer_proximity_score", "Customer proximity"],
  ["cost_efficiency_score", "Cost efficiency"],
  ["geopolitical_stability_score", "Geopolitical stability"],
  ["time_to_market_score", "Time to market"],
  ["esg_readiness_score", "ESG / power / water readiness"]
];

const scenarios = {
  "Conservative Strategy": {
    policy_score: 8,
    ecosystem_score: 8,
    talent_score: 10,
    infrastructure_score: 18,
    customer_proximity_score: 8,
    cost_efficiency_score: 6,
    geopolitical_stability_score: 20,
    time_to_market_score: 18,
    esg_readiness_score: 16
  },
  "Growth Strategy": {
    policy_score: 12,
    ecosystem_score: 20,
    talent_score: 12,
    infrastructure_score: 10,
    customer_proximity_score: 20,
    cost_efficiency_score: 6,
    geopolitical_stability_score: 8,
    time_to_market_score: 10,
    esg_readiness_score: 8
  },
  "Advanced Packaging Push": {
    policy_score: 16,
    ecosystem_score: 20,
    talent_score: 18,
    infrastructure_score: 12,
    customer_proximity_score: 16,
    cost_efficiency_score: 8,
    geopolitical_stability_score: 8,
    time_to_market_score: 10,
    esg_readiness_score: 8
  },
  "Foundry Expansion": {
    policy_score: 18,
    ecosystem_score: 14,
    talent_score: 12,
    infrastructure_score: 20,
    customer_proximity_score: 8,
    cost_efficiency_score: 4,
    geopolitical_stability_score: 16,
    time_to_market_score: 10,
    esg_readiness_score: 20
  },
  "Cost Optimization": {
    policy_score: 8,
    ecosystem_score: 8,
    talent_score: 18,
    infrastructure_score: 8,
    customer_proximity_score: 8,
    cost_efficiency_score: 20,
    geopolitical_stability_score: 8,
    time_to_market_score: 18,
    esg_readiness_score: 6
  }
};

const modeCriteria = {
  sales_office: {
    customer_proximity_score: 0.34,
    geopolitical_stability_score: 0.2,
    time_to_market_score: 0.18,
    policy_score: 0.14,
    talent_score: 0.14
  },
  foundry: {
    infrastructure_score: 0.24,
    ecosystem_score: 0.2,
    policy_score: 0.18,
    esg_readiness_score: 0.16,
    talent_score: 0.12,
    geopolitical_stability_score: 0.1
  },
  advanced_packaging: {
    ecosystem_score: 0.28,
    talent_score: 0.18,
    infrastructure_score: 0.16,
    customer_proximity_score: 0.14,
    cost_efficiency_score: 0.14,
    time_to_market_score: 0.1
  },
  customer_support_call_center: {
    talent_score: 0.24,
    cost_efficiency_score: 0.22,
    customer_proximity_score: 0.18,
    infrastructure_score: 0.16,
    time_to_market_score: 0.14,
    geopolitical_stability_score: 0.06
  }
};

const levelScores = {
  "Very high": 5,
  High: 4,
  Medium: 3,
  Low: 2,
  "Very low": 1
};

const countryInsights = {
  singapore: {
    policy: "Strong investment agency support, predictable regulation, and proven ability to host high-value semiconductor projects.",
    talent: "Deep senior engineering, commercial, legal, finance, and regional headquarters talent, with premium compensation levels.",
    ecosystem: "Mature wafer-fab, equipment, logistics, and corporate services ecosystem.",
    infrastructure: "Best-in-class power reliability, logistics, water management, and ESG readiness, constrained by cost and land.",
    regulatory: "Low geopolitical and regulatory risk, but high operating cost and land scarcity affect capital allocation.",
    strategy: "Use as ASEAN control tower, technical sales hub, and selective high-assurance manufacturing base.",
    badges: ["EDB", "Company filings", "Peer fabs"]
  },
  malaysia: {
    policy: "National semiconductor strategy supports advanced packaging, IC design, investment attraction, and engineering talent.",
    talent: "Strong manufacturing and back-end semiconductor workforce, especially around Penang and Kulim.",
    ecosystem: "Deep OSAT, assembly, test, equipment, and supplier base with credible advanced packaging adjacency.",
    infrastructure: "Good industrial parks and utilities, but large fabs require site-specific power, water, and permitting diligence.",
    regulatory: "Moderate risk profile with state-level execution differences and increasing talent competition.",
    strategy: "Prioritize OSAT partnership, advanced packaging, and staged foundry feasibility work.",
    badges: ["MITI", "OSAT cluster", "Peer investment"]
  },
  vietnam: {
    policy: "Government interest in semiconductor upgrading is rising, but policy depth and execution remain developing.",
    talent: "Young technical workforce with cost advantages; specialized process and packaging skills still need ramp-up.",
    ecosystem: "Growing electronics and back-end activity, but supplier depth is not yet comparable to Malaysia or Singapore.",
    infrastructure: "Improving industrial zones, with variance across provinces and a need for careful site diligence.",
    regulatory: "Medium execution risk from permitting, province-level differences, and developing semiconductor institutions.",
    strategy: "Build support hub and monitor back-end partnership opportunities before heavy capex.",
    badges: ["Placeholder", "Peer assembly", "Vietnam option"]
  },
  thailand: {
    policy: "Investment promotion and the Eastern Economic Corridor create a platform for industrial and electronics projects.",
    talent: "Good industrial workforce for automotive and electronics; semiconductor-specific depth remains selective.",
    ecosystem: "Strong automotive and industrial customer base, but limited advanced semiconductor supplier density.",
    infrastructure: "Solid logistics and industrial zones, especially around Bangkok and the EEC.",
    regulatory: "Political and regulatory continuity should be monitored for large capital commitments.",
    strategy: "Use a lean sales office and technical support model focused on automotive and industrial customers.",
    badges: ["EEC", "Automotive", "Watchlist"]
  },
  philippines: {
    policy: "Policy focus on semiconductor ecosystem growth is improving, with assembly, test, and services as core strengths.",
    talent: "Strong English-language service workforce and established electronics operations capability.",
    ecosystem: "Relevant assembly, test, and packaging base, but front-end fab fit is limited.",
    infrastructure: "Location-specific diligence is important for logistics resilience, power, and business continuity.",
    regulatory: "Medium regulatory and infrastructure risk, manageable for support hubs and partnerships.",
    strategy: "Develop technical support hub and selective back-end partnership coverage.",
    badges: ["OECD", "BPO", "Assembly & Test"]
  },
  indonesia: {
    policy: "Industrial policy direction is supportive, but semiconductor execution depth is early-stage.",
    talent: "Large workforce and improving technical capacity, with limited specialized semiconductor depth.",
    ecosystem: "Large end-market potential but early semiconductor supplier ecosystem.",
    infrastructure: "Industrial infrastructure varies by region; capital projects face higher coordination complexity.",
    regulatory: "Higher execution risk from permitting, local coordination, and slower time to market.",
    strategy: "Maintain market development coverage and defer major semiconductor capex until ecosystem maturity improves.",
    badges: ["Placeholder", "Large market", "Long-term option"]
  }
};

const modeApproaches = {
  sales_office: "representative office",
  foundry: "greenfield investment",
  advanced_packaging: "partnership with OSAT / local supplier",
  customer_support_call_center: "technical support hub"
};

const filterOptions = ["All", "Foundry", "Advanced Packaging", "Assembly & Test", "Power Semiconductor", "Vietnam", "Malaysia", "Singapore"];

async function loadData() {
  const [countries, modes, cases, sources] = await Promise.all([
    fetch(files.countries).then((response) => response.json()),
    fetch(files.modes).then((response) => response.json()),
    fetch(files.cases).then((response) => response.json()),
    fetch(files.sources).then((response) => response.json())
  ]);

  state.countries = countries;
  state.modes = modes;
  state.cases = cases;
  state.sources = sources;
  render();
}

function scoreLevel(value, fallback = 3) {
  return levelScores[value] || fallback;
}

function inverseLevel(value, fallback = 3) {
  return 6 - scoreLevel(value, fallback);
}

function totalWeight() {
  return Object.values(state.weights).reduce((sum, value) => sum + value, 0);
}

function countryScore(country) {
  const weightSum = totalWeight();
  if (weightSum === 0) return 0;
  const weighted = criteria.reduce((sum, [key]) => sum + country[key] * state.weights[key], 0);
  return Math.round((weighted / (weightSum * 5)) * 100);
}

function modeFitScore(country, modeId) {
  const fit = modeCriteria[modeId] || {};
  const raw = Object.entries(fit).reduce((sum, [criterion, share]) => sum + country[criterion] * share, 0);
  return Math.round((raw / 5) * 100);
}

function riskAdjustment(country, mode) {
  const countryRisk = ((country.geopolitical_stability_score + country.time_to_market_score + country.infrastructure_score) / 15) * 100;
  const modePracticality = ((inverseLevel(mode.capex_level) + inverseLevel(mode.execution_complexity)) / 10) * 100;
  return Math.round((countryRisk * 0.65) + (modePracticality * 0.35));
}

function modeAttractiveness(mode) {
  return Math.round(scoreLevel(mode.strategic_relevance_to_umc) * 20);
}

function strategyScore(country, mode) {
  const recommendedBonus = country.recommended_modes.includes(mode.id) ? 4 : 0;
  const score = (countryScore(country) * 0.35)
    + (modeFitScore(country, mode.id) * 0.3)
    + (riskAdjustment(country, mode) * 0.2)
    + (modeAttractiveness(mode) * 0.15)
    + recommendedBonus;
  return Math.max(1, Math.min(100, Math.round(score)));
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

function countryRanking() {
  return [...state.countries].sort((a, b) => countryScore(b) - countryScore(a));
}

function strategies() {
  return state.countries.flatMap((country) => {
    return state.modes.map((mode) => buildStrategy(country, mode));
  }).sort((a, b) => b.score - a.score);
}

function buildStrategy(country, mode) {
  const score = strategyScore(country, mode);
  const insight = countryInsights[country.id];
  return {
    country: country.name,
    countryId: country.id,
    location: country.key_locations[0],
    expansionMode: mode.name,
    modeId: mode.id,
    score,
    label: recommendationLabel(score),
    rationale: `${country.name} scores ${countryScore(country)} as a country platform and ${modeFitScore(country, mode.id)} for ${mode.name.toLowerCase()}. ${insight.strategy}`,
    keyRisks: country.risks.slice(0, 2),
    suggestedEntryApproach: entryApproach(country, mode),
    countryData: country,
    modeData: mode,
    modeFit: modeFitScore(country, mode.id),
    risk: riskAdjustment(country, mode),
    relevance: modeAttractiveness(mode)
  };
}

function entryApproach(country, mode) {
  if (mode.id === "foundry" && country.id === "singapore") return "brownfield expansion";
  if (mode.id === "foundry" && country.id === "malaysia") return "joint venture";
  if (mode.id === "advanced_packaging") return "partnership with OSAT / local supplier";
  return modeApproaches[mode.id] || "representative office";
}

function topStrategyForMode(modeId) {
  return strategies().filter((strategy) => strategy.modeId === modeId)[0];
}

function bestBy(predicate, sorter) {
  return strategies().filter(predicate).sort(sorter)[0];
}

function executiveRecommendations() {
  return [
    {
      title: "Best overall strategy",
      strategy: strategies()[0],
      reason: "Highest blended strategy score across country strength, mode fit, risk, and UMC relevance."
    },
    {
      title: "Fastest market entry",
      strategy: bestBy(() => true, (a, b) => b.countryData.time_to_market_score - a.countryData.time_to_market_score || b.score - a.score),
      reason: "Prioritizes speed of launch and practical execution."
    },
    {
      title: "Highest strategic upside",
      strategy: bestBy(() => true, (a, b) => (b.modeFit + b.relevance) - (a.modeFit + a.relevance)),
      reason: "Prioritizes strategic mode relevance and ecosystem fit."
    },
    {
      title: "Lowest execution risk",
      strategy: bestBy(() => true, (a, b) => b.risk - a.risk || b.score - a.score),
      reason: "Prioritizes infrastructure, stability, execution practicality, and time to market."
    },
    {
      title: "Best advanced packaging option",
      strategy: topStrategyForMode("advanced_packaging"),
      reason: "Best fit for OSAT adjacency, back-end ecosystem, engineering base, and customer access."
    },
    {
      title: "Best foundry option",
      strategy: topStrategyForMode("foundry"),
      reason: "Best current balance of infrastructure, ESG readiness, incentives, stability, and foundry relevance."
    }
  ];
}

function sourceBadgesForCountry(country) {
  return (countryInsights[country.id]?.badges || ["Source"]).map((badge) => `<span class="source-badge">${badge}</span>`).join("");
}

function render() {
  renderSummary();
  renderExecutiveCards();
  renderMatrix();
  renderWeights();
  renderDeepDive();
  renderCountryCards();
  renderCaseFilters();
  renderCases();
  renderRecommendations();
  renderSources();
}

function renderSummary() {
  const topStrategy = strategies()[0];
  document.getElementById("topRecommendation").textContent = `${topStrategy.country} + ${topStrategy.expansionMode}`;
  document.getElementById("topRecommendationText").textContent = `Score ${topStrategy.score}. ${topStrategy.rationale}`;
  document.getElementById("bestSales").textContent = topStrategyForMode("sales_office").country;
  document.getElementById("bestFoundry").textContent = topStrategyForMode("foundry").country;
  document.getElementById("bestPackaging").textContent = topStrategyForMode("advanced_packaging").country;
  document.getElementById("bestSupport").textContent = topStrategyForMode("customer_support_call_center").country;
}

function renderExecutiveCards() {
  document.getElementById("executiveCards").innerHTML = executiveRecommendations().map((item) => `
    <article class="executive-card">
      <span class="badge">${item.title}</span>
      <h3>${item.strategy.country} | ${item.strategy.expansionMode}</h3>
      <p><strong>Score ${item.strategy.score}: ${item.strategy.label}</strong></p>
      <p>${item.reason}</p>
      <p><strong>Entry:</strong> ${item.strategy.suggestedEntryApproach}</p>
    </article>
  `).join("");
}

function renderMatrix() {
  const topThreeKeys = new Set(strategies().slice(0, 3).map((item) => `${item.countryId}-${item.modeId}`));
  const rows = state.countries.map((country) => {
    const cells = state.modes.map((mode) => {
      const score = strategyScore(country, mode);
      const isTop = topThreeKeys.has(`${country.id}-${mode.id}`);
      return `
        <td class="heat-cell ${heatClass(score)} ${isTop ? "top-strategy-cell" : ""}">
          <strong>${score}</strong>
          <span>${recommendationLabel(score)}</span>
          <small>Risk ${riskAdjustment(country, mode)} | UMC ${modeAttractiveness(mode)}</small>
        </td>
      `;
    }).join("");

    return `<tr><th scope="row">${country.name}<br><small>Country ${countryScore(country)}</small></th>${cells}</tr>`;
  }).join("");

  document.getElementById("matrixBody").innerHTML = rows;
}

function renderWeights() {
  const controls = criteria.map(([key, label]) => {
    const value = state.weights[key];
    return `
      <div class="control">
        <label for="${key}">
          <span>${label}</span>
          <span id="${key}_value">${value}</span>
        </label>
        <input id="${key}" type="range" min="0" max="20" value="${value}" data-weight="${key}" aria-label="${label} weight">
      </div>
    `;
  }).join("");

  document.getElementById("scenarioPresets").innerHTML = Object.keys(scenarios).map((name) => `
    <button type="button" data-scenario="${name}" aria-label="Apply ${name} scenario">${name}</button>
  `).join("");

  document.getElementById("weightControls").innerHTML = `
    <div class="formula-card">
      <h3>Transparent scoring formula</h3>
      <p><strong>Country score</strong> = sum(country criterion score 1-5 x slider weight) / (sum weights x 5) x 100.</p>
      <p><strong>Heatmap score</strong> = 35% country weighted score + 30% mode fit + 20% risk adjustment + 15% UMC strategic relevance + recommended-mode bonus.</p>
      <p><strong>Risk adjustment</strong> combines geopolitical stability, time to market, infrastructure, capex practicality, and execution complexity.</p>
    </div>
    ${controls}
  `;

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.weights = { ...scenarios[button.dataset.scenario] };
      renderSummary();
      renderExecutiveCards();
      renderMatrix();
      renderWeights();
      renderRecommendations();
      renderDeepDive();
      renderCountryCards();
    });
  });

  document.querySelectorAll("[data-weight]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const key = event.target.dataset.weight;
      state.weights[key] = Number(event.target.value);
      document.getElementById(`${key}_value`).textContent = state.weights[key];
      document.getElementById("weightTotal").textContent = `${totalWeight()} total weight`;
      renderSummary();
      renderExecutiveCards();
      renderMatrix();
      renderRanking();
      renderRecommendations();
      renderDeepDive();
      renderCountryCards();
    });
  });

  document.getElementById("weightTotal").textContent = `${totalWeight()} total weight`;
  renderRanking();
}

function renderRanking() {
  const ranking = countryRanking();
  const max = Math.max(...ranking.map(countryScore), 1);

  document.getElementById("rankingList").innerHTML = `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Country</th>
          <th>Weighted score</th>
          <th>Best strategy</th>
        </tr>
      </thead>
      <tbody>
        ${ranking.map((country, index) => {
          const score = countryScore(country);
          const bestStrategy = strategies().find((item) => item.countryId === country.id);
          return `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${country.name}</strong><div class="rank-track" aria-hidden="true"><span style="width:${(score / max) * 100}%"></span></div></td>
              <td><strong>${score}</strong></td>
              <td>${bestStrategy.expansionMode} (${bestStrategy.score})</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderDeepDive() {
  const tabs = state.countries.map((country) => `
    <button type="button" class="${country.id === state.selectedCountry ? "active" : ""}" data-country="${country.id}" aria-label="Show ${country.name} deep dive">
      ${country.name}
    </button>
  `).join("");

  document.getElementById("countryTabs").innerHTML = tabs;
  document.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCountry = button.dataset.country;
      renderDeepDive();
    });
  });

  const country = state.countries.find((item) => item.id === state.selectedCountry) || state.countries[0];
  const insight = countryInsights[country.id];
  const bestStrategy = strategies().find((item) => item.countryId === country.id);
  document.getElementById("countryDetail").innerHTML = `
    <div class="detail-grid">
      <div>
        <span class="badge">${bestStrategy.expansionMode}</span>
        <h3>${country.name}</h3>
        <p>${country.summary}</p>
        <div class="source-badges">${sourceBadgesForCountry(country)}</div>
        <div class="stat-grid">
          <div class="stat"><span>Weighted country score</span><strong>${countryScore(country)}</strong></div>
          <div class="stat"><span>Best strategy score</span><strong>${bestStrategy.score}</strong></div>
          <div class="stat"><span>Mode fit</span><strong>${bestStrategy.modeFit}</strong></div>
          <div class="stat"><span>Entry approach</span><strong>${bestStrategy.suggestedEntryApproach}</strong></div>
        </div>
      </div>
      <div>
        <h4>Suggested UMC strategy</h4>
        <p>${insight.strategy}</p>
        <h4>Key risks</h4>
        <ul>${country.risks.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderCountryCards() {
  document.getElementById("countryCards").innerHTML = state.countries.map((country) => {
    const insight = countryInsights[country.id];
    const bestModes = strategies()
      .filter((item) => item.countryId === country.id)
      .slice(0, 2)
      .map((item) => item.expansionMode)
      .join(", ");
    const peerCases = state.cases.filter((item) => item.country === country.name);
    return `
      <article class="country-card">
        <button class="country-card-toggle" type="button" aria-expanded="false" aria-controls="${country.id}_body">
          <span>${country.name}</span>
          <span>${countryScore(country)}</span>
        </button>
        <div id="${country.id}_body" class="country-card-body">
          <p><strong>Top locations:</strong> ${country.key_locations.join(", ")}</p>
          <p><strong>Best expansion modes:</strong> ${bestModes}</p>
          <p><strong>Suggested UMC strategy:</strong> ${insight.strategy}</p>
          <div class="source-badges">${sourceBadgesForCountry(country)}</div>
          ${countrySection("Government policy", insight.policy)}
          ${countrySection("Talent and engineering base", insight.talent)}
          ${countrySection("Supply chain ecosystem", insight.ecosystem)}
          ${countrySection("Infrastructure and utilities", insight.infrastructure)}
          ${countrySection("Geopolitical and regulatory risks", insight.regulatory)}
          ${countrySection("Comparable peer cases", peerCases.length ? peerCases.map((item) => `${item.company}: ${item.why_it_matters}`).join(" ") : "No direct peer case in the current dataset.")}
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
  return `
    <details>
      <summary>${title}</summary>
      <p>${body}</p>
    </details>
  `;
}

function renderCaseFilters() {
  document.getElementById("caseFilters").innerHTML = filterOptions.map((filter) => `
    <button type="button" class="${state.activeCaseFilter === filter ? "active" : ""}" data-case-filter="${filter}" aria-label="Filter case studies by ${filter}">
      ${filter}
    </button>
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
    : state.cases.filter((study) => study.type === state.activeCaseFilter || study.country === state.activeCaseFilter);

  document.getElementById("caseStudyGrid").innerHTML = cases.map((study) => `
    <article class="case-card">
      <div class="source-badges">${study.source_badges.map((badge) => `<span class="source-badge">${badge}</span>`).join("")}</div>
      <h3>${study.company}</h3>
      <p><strong>${study.location}</strong></p>
      <p><strong>${study.investment}</strong> | ${study.type}</p>
      <p>${study.why_it_matters}</p>
      <p><strong>UMC lesson:</strong> ${study.strategic_lesson_for_umc}</p>
    </article>
  `).join("");
}

function renderRecommendations() {
  const topThree = strategies().slice(0, 3);
  document.getElementById("recommendationCards").innerHTML = topThree.map((strategy, index) => `
    <article class="recommendation-card top-strategy">
      <span class="badge">Top ${index + 1}</span>
      <h3>${strategy.country} + ${strategy.expansionMode}</h3>
      <p><strong>Strategy score: ${strategy.score} (${strategy.label})</strong></p>
      <p><strong>Location:</strong> ${strategy.location}</p>
      <p><strong>Entry:</strong> ${strategy.suggestedEntryApproach}</p>
      <p>${strategy.rationale}</p>
      <p><strong>Risks:</strong> ${strategy.keyRisks.join("; ")}</p>
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
