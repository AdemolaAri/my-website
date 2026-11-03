// Renders the Work Pulse widget into a root element from activity.json + projects.json.
// Plain DOM APIs only (no innerHTML with data), so the same file works in Astro and the preview.
// Only period totals are shown: no per-day or per-month view, so the page can't be read as a timeline.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"];

function el(tag, attrs = {}, text) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
}
// Month and year only. Exact days add nothing for a reader and date the page more than it needs to.
function fmtMonth(iso) {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}
// "January to October 2026" when both ends share a year, otherwise "December 2025 to March 2026".
function fmtRange(from, to) {
  if (from.slice(0, 4) !== to.slice(0, 4)) return `${fmtMonth(from)} to ${fmtMonth(to)}`;
  return `${MONTHS[Number(from.slice(5, 7)) - 1]} to ${fmtMonth(to)}`;
}

export function renderPulse(root, activity, projects, opts = {}) {
  const t = activity.totals;
  root.classList.add("wp");
  root.replaceChildren();

  const head = el("header", { class: "wp-head" });
  // The range is the period the totals and cards cover, not how long the role has lasted,
  // so it goes with the note rather than next to a role label in the eyebrow.
  const range = fmtRange(activity.range.from, activity.range.to);
  head.appendChild(el("span", { class: "wp-eyebrow" }, opts.eyebrow || range));
  head.appendChild(el("h2", {}, opts.title || "Work Pulse"));
  head.appendChild(el("p", {}, opts.intro ||
    "Most of my work happens in private company repositories, so it doesn't show on my public GitHub profile. This page summarizes that work with every company detail removed: only totals, the kind of work, and what it changed."));
  if (opts.note || opts.eyebrow) {
    const period = `Figures and projects are from ${range}.`;
    head.appendChild(el("p", { class: "wp-head-note" }, opts.note ? `${opts.note} ${period}` : period));
  }
  root.appendChild(head);

  const stats = el("div", { class: "wp-stats" });
  [[t.prs_merged, "pull requests merged"], [t.reviews, "pull requests reviewed"],
   [t.docs, "design docs and runbooks"]].forEach(([n, label]) => {
    const s = el("div", { class: "wp-stat" });
    s.appendChild(el("b", {}, String(n)));
    s.appendChild(el("span", {}, label));
    stats.appendChild(s);
  });
  root.appendChild(stats);

  const tech = el("section", { class: "wp-section" });
  tech.appendChild(el("h3", {}, "Where the code went"));
  const list = el("div", { class: "wp-tech" });
  const top = activity.tech[0]?.share || 1;
  activity.tech.forEach(({ label, share }) => {
    const row = el("div", { class: "wp-tech-row" });
    row.appendChild(el("span", {}, label));
    const track = el("div", { class: "track" });
    const fill = el("div", { class: "fill" }); fill.style.width = `${(share / top) * 100}%`;
    track.appendChild(fill); row.appendChild(track);
    row.appendChild(el("span", { class: "pct" }, `${Math.round(share * 100)}%`));
    list.appendChild(row);
  });
  tech.appendChild(list);
  tech.appendChild(el("p", { class: "wp-note" }, "Share of lines changed, by file type. Lockfiles and generated JSON excluded."));
  root.appendChild(tech);

  const pr = el("section", { class: "wp-section" });
  pr.appendChild(el("h3", {}, "Selected work"));
  const cards = el("div", { class: "wp-cards" });
  projects.forEach((p) => {
    const c = el("article", { class: "wp-card" });
    c.appendChild(el("span", { class: "period" }, p.period));
    c.appendChild(el("h4", {}, p.title));
    c.appendChild(el("p", {}, p.summary));
    c.appendChild(el("span", { class: "outcome" }, p.outcome));
    // Optional write-up link. Only site-relative or https links, so card data can't inject a javascript: URL.
    if (p.link && /^(\/(?!\/)|https:\/\/)/.test(p.link.href)) {
      c.appendChild(el("a", { class: "wp-card-link", href: p.link.href }, `${p.link.label} →`));
    }
    const chips = el("div", { class: "wp-chips" });
    p.stack.forEach((s) => chips.appendChild(el("span", {}, s)));
    c.appendChild(chips);
    cards.appendChild(c);
  });
  pr.appendChild(cards);
  root.appendChild(pr);

  root.appendChild(el("p", { class: "wp-foot" },
    `Last updated ${fmtMonth(activity.generated)}. Totals come from GitHub pull request search and local git history. Project descriptions are written by hand and leave out company names, systems, and people.`));
}
