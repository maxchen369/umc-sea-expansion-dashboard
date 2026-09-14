"use strict";

const DATA_FILES = {
  frame: "data/frame.json",
  summary: "data/summary.json",
  profiles: "data/country_profiles.json",
  demand: "data/demand_drivers.json",
  competition: "data/competitive_map.json",
  valuechain: "data/valuechain_credibility.json",
  feasibility: "data/feasibility_inputs.json",
  cases: "data/cases_signals.json",
  gaps: "data/view_changing_gaps.json",
  sources: "data/source_index.json"
};

const STATUS_ORDER = ["credible", "emerging", "absent"];
const WEAK_GRADES = new Set(["C", "D"]);

const state = {
  data: {},
  hideWeak: false,
  sourceById: new Map(),
  tipNode: null
};

// Tooltip content builders, keyed by the element that owns the tooltip.
const tipBuilders = new WeakMap();

init().catch((error) => {
  document.getElementById("main").replaceChildren(
    el("section", { class: "load-error" }, [
      el("h1", { text: "The data could not be loaded" }),
      el("p", { text: error.message }),
      el("p", { text: "Serve this folder over HTTP (for example: python -m http.server 8000). Browsers block fetch() on pages opened from file://." })
    ])
  );
});

async function init() {
  await loadData();
  state.sourceById = new Map(state.data.sources.map((source) => [source.id, source]));

  renderGradeLegend();
  renderTakeaways();
  renderStatusLegend();
  renderMatrix();
  renderCountries();
  renderDrivers();
  renderEndMarkets();
  renderInvesting();
  renderConstraints();
  renderCases();
  renderUnknowns();
  renderSources();
  renderAbout();

  setupFilter();
  setupTooltip();
  setupDisclosure();
  openTarget(window.location.hash, { scroll: true });
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([key, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
      return [key, await response.json()];
    })
  );
  entries.forEach(([key, value]) => {
    state.data[key] = value;
  });
}

/* ---------- DOM helpers (all text goes through textContent) ---------- */

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else node.setAttribute(key, value === true ? "" : String(value));
  });
  [].concat(children).forEach((child) => {
    if (child === undefined || child === null || child === false) return;
    node.append(child instanceof Node ? child : String(child));
  });
  return node;
}

function mount(id, ...nodes) {
  document.getElementById(id).replaceChildren(...nodes);
}

function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isWeak(grade) {
  return WEAK_GRADES.has(grade);
}

function isHidden(grade) {
  return state.hideWeak && isWeak(grade);
}

function countryId(country) {
  return `country-${slug(country)}`;
}

function gradeInfo(tag) {
  return state.data.frame.quality_legend.find((item) => item.tag === tag);
}

function grade(tag, { compact = false } = {}) {
  const info = gradeInfo(tag);
  const spoken = info ? `Evidence grade ${tag}: ${info.label}` : `Evidence grade ${tag}`;
  return el(
    "span",
    {
      class: compact ? "q q-compact" : "q",
      dataset: { level: tag },
      title: info ? `Grade ${tag}: ${info.label}. ${info.definition}` : spoken
    },
    [
      el("span", { class: "q-dot", "aria-hidden": "true" }),
      el("span", { class: "q-letter", "aria-hidden": "true", text: tag }),
      el("span", { class: "visually-hidden", text: spoken })
    ]
  );
}

function statusLabel(key) {
  return state.data.summary.status_labels[key] || key;
}

function status(key) {
  return el("span", { class: "status" }, [
    el("span", { class: `swatch lvl-${key}`, "aria-hidden": "true" }),
    el("span", { text: statusLabel(key) })
  ]);
}

function layerLabel(layer) {
  return state.data.summary.layer_labels[layer] || { label: layer, short: layer, note: "" };
}

function fieldLabel(field) {
  return state.data.summary.field_labels[field.key] || field.label;
}

function sources(ids) {
  const line = el("p", { class: "source-line" }, [el("span", { class: "source-label", text: "Sources: " })]);
  if (!ids || !ids.length) {
    line.append("none linked");
    return line;
  }
  ids.forEach((id, index) => {
    if (index) line.append(", ");
    const source = state.sourceById.get(id);
    line.append(
      source
        ? el("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", text: source.publisher })
        : id
    );
  });
  return line;
}

function qItem(tag, content) {
  return el("li", { class: "qitem", dataset: { q: tag } }, [...[].concat(content), " ", grade(tag, { compact: true })]);
}

// A titled list whose items can all be hidden by the filter; shows a note when that happens.
function filterGroup(className, title, items, listClass) {
  const group = el("div", { class: `${className} filter-group` }, [el("h4", { text: title })]);
  if (!items.length) {
    group.append(el("p", { class: "empty-note", text: "Nothing recorded." }));
    return group;
  }
  group.append(
    el("ul", { class: listClass }, items),
    el("p", { class: "empty-note", hidden: true, text: "Only estimates or judgment calls here, hidden by the filter." })
  );
  return group;
}

/* ---------- Summary layer ---------- */

function renderGradeLegend() {
  const { frame, summary } = state.data;
  mount(
    "gradeLegend",
    ...frame.quality_legend.map((item) =>
      el("span", { class: "legend-item" }, [grade(item.tag), el("span", { text: summary.grade_short[item.tag] || item.label })])
    )
  );
}

function renderTakeaways() {
  mount(
    "takeawayGrid",
    ...state.data.summary.takeaways.map((item, index) =>
      el("article", { class: "takeaway" }, [
        el("span", { class: "takeaway-number", "aria-hidden": "true", text: String(index + 1) }),
        el("h3", { text: item.headline }),
        el("p", { text: item.body }),
        el("div", { class: "takeaway-foot" }, [
          el("span", { class: "evidence-label" }, ["Evidence", grade(item.quality)]),
          el("a", { href: item.link.href, text: `${item.link.label} →` })
        ])
      ])
    )
  );
}

function renderStatusLegend() {
  const definitions = state.data.summary.status_definitions;
  mount(
    "statusLegend",
    ...STATUS_ORDER.map((key) =>
      el("div", { class: "status-legend-item" }, [status(key), el("span", { class: "status-definition", text: definitions[key] })])
    )
  );
}

function renderMatrix() {
  const { valuechain } = state.data;

  mount(
    "matrixHead",
    el("tr", {}, [
      el("th", { scope: "col", text: "Supply-chain layer" }),
      ...valuechain.countries.map((country) =>
        el("th", { scope: "col" }, [el("a", { href: `#${countryId(country)}`, text: country })])
      )
    ])
  );

  mount(
    "matrixBody",
    ...valuechain.layers.map((layer) => {
      const label = layerLabel(layer.layer);
      return el("tr", {}, [
        el("th", { scope: "row" }, [
          el("span", { class: "row-label", text: label.label }),
          el("span", { class: "row-caption", text: label.note })
        ]),
        ...valuechain.countries.map((country) => {
          const cell = layer.cells[country] || {};
          const td = el("td", { class: "qcell", tabindex: "0", dataset: { q: cell.quality, count: "" } }, [
            el("div", { class: "cell" }, [status(cell.status), grade(cell.quality, { compact: true })])
          ]);
          tipBuilders.set(td, () => matrixTip(country, label.label, cell));
          return td;
        })
      ]);
    })
  );
}

function matrixTip(country, layer, cell) {
  const nodes = [el("div", { class: "tip-context", text: `${country} · ${layer}` })];
  if (isHidden(cell.quality)) {
    nodes.push(el("div", { class: "tip-value", text: `Hidden by the filter (grade ${cell.quality})` }));
    return nodes;
  }
  nodes.push(
    el("div", { class: "tip-value" }, [el("span", { class: `swatch lvl-${cell.status}`, "aria-hidden": "true" }), statusLabel(cell.status)]),
    el("div", { class: "tip-detail", text: cell.note }),
    el("div", { class: "tip-grade" }, [grade(cell.quality)])
  );
  return nodes;
}

function renderCountries() {
  const { profiles, valuechain, feasibility, competition, cases } = state.data;
  const allCases = [
    ...cases.manufacturing_relevant.map((item) => ({ ...item, kind: "Being built or running" })),
    ...cases.signals_not_actionable.map((item) => ({ ...item, kind: "Announced or planned" }))
  ];

  mount(
    "countryGrid",
    ...valuechain.countries.map((country) => {
      const profile = profiles.find((item) => item.country === country);
      const facts = feasibility.countries.find((item) => item.country === country) || {};
      const players = competition.players.filter((player) => String(player.location).includes(country));
      const related = allCases.filter((item) => String(item.country).includes(country));

      return el("article", { class: "country-card", id: countryId(country) }, [
        el("header", { class: "country-head" }, [el("h3", { text: country }), el("p", { class: "role", text: profile.role })]),
        el(
          "ul",
          { class: "strip", "aria-label": `${country}: supply-chain presence` },
          valuechain.layers.map((layer) => {
            const cell = layer.cells[country] || {};
            const label = layerLabel(layer.layer);
            return el("li", { title: `${label.label}: ${statusLabel(cell.status)}` }, [
              el("span", { class: `swatch lvl-${cell.status}`, "aria-hidden": "true" }),
              el("span", { text: label.short }),
              el("span", { class: "visually-hidden", text: `: ${statusLabel(cell.status)}` })
            ]);
          })
        ),
        filterGroup("list-block", "Strengths", profile.strengths.map((item) => qItem(item.quality, item.text)), "bullets"),
        filterGroup("list-block", "Constraints", profile.constraints.map((item) => qItem(item.quality, item.text)), "bullets"),
        filterGroup("list-block", "What to watch", profile.watch.map((item) => qItem(item.quality, item.text)), "bullets"),
        el("details", { class: "card-evidence" }, [
          el("summary", { text: "Evidence behind this profile" }),
          filterGroup(
            "evidence-group",
            "Supply chain",
            valuechain.layers.map((layer) => {
              const cell = layer.cells[country] || {};
              return qItem(cell.quality, [el("strong", { text: `${layerLabel(layer.layer).label}: ` }), `${statusLabel(cell.status)}. ${cell.note}`]);
            }),
            "evidence-list"
          ),
          filterGroup(
            "evidence-group",
            "Practical factors",
            feasibility.field_order.map((field) => {
              const fact = facts[field.key] || {};
              return qItem(fact.quality, [el("strong", { text: `${fieldLabel(field)}: ` }), fact.value || "Data gap"]);
            }),
            "evidence-list"
          ),
          filterGroup(
            "evidence-group",
            "Companies and signals",
            [
              ...players.map((player) => qItem(player.quality, [el("strong", { text: `${player.player}: ` }), player.move])),
              ...related.map((item) => qItem(item.quality, [el("strong", { text: `${item.kind}: ` }), item.title]))
            ],
            "evidence-list"
          )
        ])
      ]);
    })
  );
}

/* ---------- Evidence layer ---------- */

function renderDrivers() {
  const { demand, summary } = state.data;
  mount(
    "driverGrid",
    ...demand.structural_drivers.map((driver) =>
      el("article", { class: "info-card qitem", dataset: { q: driver.quality, count: "" } }, [
        el("div", { class: "card-top" }, [el("h4", { text: summary.driver_labels[driver.driver] || driver.driver }), grade(driver.quality)]),
        el("p", { text: driver.what_it_is }),
        el("p", {}, [el("strong", { text: "Why it matters: " }), driver.relevance_to_specialty_foundry]),
        sources(driver.sources)
      ])
    )
  );
}

function renderEndMarkets() {
  mount(
    "endMarketBody",
    ...state.data.demand.end_market_gravity.map((row) =>
      el("tr", { class: "qitem", dataset: { q: row.quality, count: "" } }, [
        el("th", { scope: "row", text: row.country }),
        el("td", { text: row.end_markets }),
        el("td", { text: row.foundry_relevant_pull }),
        el("td", {}, [grade(row.quality)])
      ])
    )
  );
}

function renderInvesting() {
  const { competition, summary } = state.data;
  const readsLabel = (key) => summary.reads_as_labels[key] || key;

  mount(
    "readsLegend",
    ...Object.entries(competition.reads_as_legend).map(([key, definition]) =>
      el("li", {}, [el("span", { class: "reads", text: readsLabel(key) }), definition])
    )
  );

  mount(
    "investingBody",
    ...competition.players.map((player) =>
      el("tr", { class: "qitem", dataset: { q: player.quality, count: "" } }, [
        el("th", { scope: "row" }, [
          el("span", { class: "row-label", text: player.player }),
          el("span", { class: "row-caption", text: player.type })
        ]),
        el("td", { text: player.location }),
        el("td", {}, [player.move, el("span", { class: "secondary", text: player.read_note }), sources(player.sources)]),
        el("td", {}, [el("span", { class: "reads", text: readsLabel(player.reads_as) })]),
        el("td", {}, [grade(player.quality)])
      ])
    )
  );

  mount("investingSynthesis", el("p", {}, [el("strong", { text: "Analyst synthesis: " }), competition.synthesis]));
}

function renderConstraints() {
  const { feasibility } = state.data;

  mount(
    "constraintsHead",
    el("tr", {}, [
      el("th", { scope: "col", text: "Factor" }),
      ...feasibility.countries.map((item) => el("th", { scope: "col", text: item.country }))
    ])
  );

  mount(
    "constraintsBody",
    ...feasibility.field_order.map((field) =>
      el("tr", {}, [
        el("th", { scope: "row", text: fieldLabel(field) }),
        ...feasibility.countries.map((item) => {
          const fact = item[field.key] || {};
          return el("td", { class: "qcell", dataset: { q: fact.quality, count: "" } }, [
            el("div", {}, [fact.value || "Data gap", " ", grade(fact.quality, { compact: true })])
          ]);
        })
      ])
    )
  );
}

function renderCases() {
  const card = (item) =>
    el("article", { class: "info-card qitem", dataset: { q: item.quality, count: "" } }, [
      el("div", { class: "card-top" }, [el("h4", { text: item.title }), grade(item.quality)]),
      el("p", { class: "meta", text: `${item.country} · ${item.layer}` }),
      el("dl", { class: "facts" }, [
        el("dt", { text: "What happened" }),
        el("dd", { text: item.what_happened }),
        el("dt", { text: "What it shows" }),
        el("dd", { text: item.what_it_shows }),
        el("dt", { text: "What it does not show" }),
        el("dd", { text: item.what_it_does_not_show })
      ]),
      sources(item.sources)
    ]);

  mount("realCases", ...state.data.cases.manufacturing_relevant.map(card));
  mount("signalCases", ...state.data.cases.signals_not_actionable.map(card));
}

function renderUnknowns() {
  mount(
    "gapList",
    ...state.data.gaps.gaps.map((gap) =>
      el("li", { class: "qitem", dataset: { q: gap.quality, count: "" } }, [
        el("div", { class: "card-top" }, [el("h4", { text: gap.unknown }), grade(gap.quality)]),
        el("dl", { class: "facts" }, [
          el("dt", { text: "Why it matters" }),
          el("dd", { text: gap.would_change }),
          el("dt", { text: "Why it is still open" }),
          el("dd", { text: gap.why_open }),
          el("dt", { text: "How to close it" }),
          el("dd", { text: gap.how_to_close })
        ])
      ])
    )
  );
}

function renderSources() {
  const list = state.data.sources;
  document.getElementById("sourcesSub").textContent = `${list.length} public sources, graded the same way as the data`;
  mount(
    "sourceList",
    ...list.map((source) =>
      el("li", {}, [
        el("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", text: source.title }),
        el("span", { class: "source-meta" }, [`${source.publisher} · ${source.data_year || "n/a"}`, grade(source.quality, { compact: true })])
      ])
    )
  );
}

function renderAbout() {
  const { frame, summary } = state.data;
  mount(
    "aboutScope",
    el("h3", { class: "block-title", text: "Scope" }),
    el("p", { text: frame.lens }),
    el("p", { text: summary.not_a_ranking }),
    el("p", { text: frame.knowledge_note })
  );
  mount(
    "aboutGrades",
    ...frame.quality_legend.map((item) => el("li", {}, [grade(item.tag), " ", el("strong", { text: `${item.label}. ` }), item.definition]))
  );
  mount(
    "aboutStatus",
    ...STATUS_ORDER.map((key) => el("li", {}, [status(key), " ", summary.status_definitions[key]]))
  );
}

/* ---------- Interactions ---------- */

function setupFilter() {
  const toggle = document.getElementById("hideWeak");
  toggle.addEventListener("change", () => {
    state.hideWeak = toggle.checked;
    applyFilter();
  });
  applyFilter();
}

function applyFilter() {
  document.body.classList.toggle("hide-weak", state.hideWeak);

  const counted = [...document.querySelectorAll("[data-count]")];
  const shown = counted.filter((node) => !isHidden(node.dataset.q)).length;
  document.getElementById("filterCount").textContent = state.hideWeak
    ? `Showing ${shown} of ${counted.length} data points (grades A and B)`
    : `Showing all ${counted.length} data points`;

  document.querySelectorAll(".filter-group").forEach((group) => {
    const items = [...group.querySelectorAll(".qitem")];
    const note = group.querySelector(":scope > .empty-note");
    if (!note || !items.length) return;
    note.hidden = items.some((item) => !isHidden(item.dataset.q));
  });

  hideTip();
}

function setupTooltip() {
  document.addEventListener("pointerover", (event) => {
    const node = event.target.closest(".qcell[tabindex]");
    if (node && tipBuilders.has(node)) showTip(node);
  });
  document.addEventListener("pointerout", (event) => {
    const node = event.target.closest(".qcell[tabindex]");
    if (node && !node.contains(event.relatedTarget)) hideTip();
  });
  document.addEventListener("focusin", (event) => {
    if (tipBuilders.has(event.target)) showTip(event.target);
  });
  document.addEventListener("focusout", (event) => {
    if (tipBuilders.has(event.target)) hideTip();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideTip();
  });
  window.addEventListener("scroll", hideTip, { passive: true });
  window.addEventListener("resize", hideTip);
}

function showTip(node) {
  if (state.tipNode === node) return;
  const tip = document.getElementById("tooltip");
  tip.replaceChildren(...tipBuilders.get(node)());
  tip.hidden = false;
  state.tipNode = node;

  const gap = 8;
  const anchor = node.getBoundingClientRect();
  const box = tip.getBoundingClientRect();
  let top = anchor.bottom + gap;
  if (top + box.height > window.innerHeight - gap) top = anchor.top - box.height - gap;
  const left = Math.min(
    Math.max(gap, anchor.left + anchor.width / 2 - box.width / 2),
    window.innerWidth - box.width - gap
  );
  tip.style.top = `${Math.max(gap, top)}px`;
  tip.style.left = `${left}px`;
}

function hideTip() {
  const tip = document.getElementById("tooltip");
  if (tip) tip.hidden = true;
  state.tipNode = null;
}

function setupDisclosure() {
  const button = document.getElementById("toggleAll");
  const sections = [...document.querySelectorAll("details.evidence")];
  const sync = () => {
    button.textContent = sections.every((section) => section.open) ? "Collapse all" : "Expand all";
  };

  button.addEventListener("click", () => {
    const open = !sections.every((section) => section.open);
    sections.forEach((section) => {
      section.open = open;
    });
    sync();
  });
  sections.forEach((section) => section.addEventListener("toggle", sync));

  // In-page links to a collapsed section open it before the browser scrolls.
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link) openTarget(link.getAttribute("href"));
  });
  window.addEventListener("hashchange", () => openTarget(window.location.hash));
  sync();
}

function openTarget(hash, { scroll = false } = {}) {
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  const details = target.matches("details") ? target : target.closest("details");
  if (details) details.open = true;
  if (scroll) target.scrollIntoView();
}
