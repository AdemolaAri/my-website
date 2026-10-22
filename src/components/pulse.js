// Renders the Work Pulse widget into a root element from activity.json + projects.json.
// Plain DOM APIs only (no innerHTML with data), so the same file works in Astro and the preview.
const SVG = "http://www.w3.org/2000/svg";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function el(tag, attrs = {}, text) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
}
function svg(tag, attrs = {}, text) {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text != null) n.textContent = text;
  return n;
}
function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function makeTip() {
  const tip = el("div", { class: "wp-tip", role: "tooltip" });
  tip.hidden = true;
  document.body.appendChild(tip);
  return {
    show(lines, x, y) {
      tip.replaceChildren();
      lines.forEach((l, i) => {
        if (i) tip.appendChild(el("br"));
        tip.appendChild(i === 0 ? el("b", {}, l) : document.createTextNode(l));
      });
      tip.hidden = false;
      const r = tip.getBoundingClientRect();
      const left = Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8);
      const top = y - r.height - 10 < 8 ? y + 16 : y - r.height - 10;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    },
    hide() { tip.hidden = true; },
  };
}

function level(n) {
  // Breakpoints follow this year's quartiles of active days (2 / 3 / 5).
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n <= 3) return 2;
  if (n <= 5) return 3;
  return 4;
}

function calendar(days, tip) {
  const cell = 11, gap = 3, step = cell + gap, left = 28, top = 18;
  const first = new Date(days[0].date + "T00:00:00");
  const offset = first.getDay(); // weeks start on Sunday
  const weeks = Math.ceil((days.length + offset) / 7);
  const w = left + weeks * step, h = top + 7 * step;
  const s = svg("svg", { class: "wp-cal", width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: "img",
    "aria-label": "Daily contributions calendar" });

  ["Mon", "Wed", "Fri"].forEach((d, i) =>
    s.appendChild(svg("text", { x: 0, y: top + (1 + i * 2) * step + 9 }, d)));

  let lastMonth = -1;
  days.forEach((d, i) => {
    const idx = i + offset, col = Math.floor(idx / 7), row = idx % 7;
    const x = left + col * step, y = top + row * step;
    const month = Number(d.date.slice(5, 7)) - 1;
    if (month !== lastMonth && row <= 1) {
      s.appendChild(svg("text", { x, y: 10 }, MONTHS[month]));
      lastMonth = month;
    }
    const r = svg("rect", { class: "cell", x, y, width: cell, height: cell, tabindex: "-1",
      fill: `var(--wp-heat-${level(d.total)})` });
    const lines = [fmtDate(d.date),
      d.total ? `${d.total} contribution${d.total === 1 ? "" : "s"}` : "No activity"];
    if (d.merged) lines.push(`${d.merged} PR${d.merged === 1 ? "" : "s"} merged`);
    if (d.reviews) lines.push(`${d.reviews} review${d.reviews === 1 ? "" : "s"}`);
    r.addEventListener("mouseenter", () => {
      const b = r.getBoundingClientRect();
      tip.show(lines, b.left + b.width / 2, b.top);
    });
    r.addEventListener("mouseleave", () => tip.hide());
    s.appendChild(r);
  });
  return s;
}

function monthly(days, tip) {
  const by = new Map();
  for (const d of days) {
    const k = d.date.slice(0, 7);
    const m = by.get(k) || { merged: 0, reviews: 0 };
    m.merged += d.merged; m.reviews += d.reviews;
    by.set(k, m);
  }
  const rows = [...by.entries()];
  const max = Math.max(...rows.map(([, v]) => Math.max(v.merged, v.reviews)));
  const nice = Math.ceil(max / 10) * 10;
  const W = 380, H = 190, L = 26, B = 22, T = 8;
  const band = (W - L) / rows.length, bw = Math.min(10, (band - 8) / 2);
  const y = (v) => T + (H - T - B) * (1 - v / nice);
  const s = svg("svg", { class: "wp-bars", viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img",
    "aria-label": "PRs merged and reviews per month" });

  [0, nice / 2, nice].forEach((t) => {
    s.appendChild(svg("line", { x1: L, x2: W, y1: y(t), y2: y(t) }));
    s.appendChild(svg("text", { x: L - 6, y: y(t) + 3, "text-anchor": "end" }, String(t)));
  });
  rows.forEach(([k, v], i) => {
    const g = svg("g", { class: "month" });
    const x0 = L + i * band;
    g.appendChild(svg("rect", { class: "hit", x: x0, y: T, width: band, height: H - T - B, rx: 4 }));
    const cx = x0 + band / 2;
    // 2px gap between the paired bars; rounded tops anchored to the baseline.
    [[v.merged, "var(--wp-s1)", cx - bw - 1], [v.reviews, "var(--wp-s2)", cx + 1]].forEach(([val, fill, x]) => {
      if (!val) return;
      const hgt = y(0) - y(val);
      g.appendChild(svg("path", { fill,
        d: `M${x},${y(0)}V${y(val) + 3}a3,3 0 0 1 3,-3h${bw - 6}a3,3 0 0 1 3,3V${y(0)}Z` }));
      if (hgt < 3) g.lastChild.setAttribute("d", `M${x},${y(0)}h${bw}v${-hgt}h${-bw}Z`);
    });
    g.appendChild(svg("text", { x: cx, y: H - 6, "text-anchor": "middle" },
      MONTHS[Number(k.slice(5)) - 1]));
    g.addEventListener("mousemove", (e) =>
      tip.show([`${MONTHS[Number(k.slice(5)) - 1]} ${k.slice(0, 4)}`, `${v.merged} PRs merged`,
        `${v.reviews} reviews`], e.clientX, e.clientY));
    g.addEventListener("mouseleave", () => tip.hide());
    s.appendChild(g);
  });

  const table = el("table", { class: "wp-sr" });
  const head = el("tr");
  ["Month", "PRs merged", "Reviews"].forEach((h) => head.appendChild(el("th", {}, h)));
  table.appendChild(head);
  rows.forEach(([k, v]) => {
    const tr = el("tr");
    [MONTHS[Number(k.slice(5)) - 1], v.merged, v.reviews].forEach((c) => tr.appendChild(el("td", {}, String(c))));
    table.appendChild(tr);
  });
  return [s, table];
}

export function renderPulse(root, activity, projects, opts = {}) {
  const tip = makeTip();
  const t = activity.totals;
  root.classList.add("wp");
  if (opts.heat) root.dataset.heat = opts.heat;
  root.replaceChildren();

  const head = el("header", { class: "wp-head" });
  const range = `${fmtDate(activity.range.from)} to ${fmtDate(activity.range.to)}`;
  head.appendChild(el("span", { class: "wp-eyebrow" }, opts.eyebrow ? `${opts.eyebrow} · ${range}` : range));
  head.appendChild(el("h2", {}, opts.title || "Work Pulse"));
  head.appendChild(el("p", {}, opts.intro ||
    "Most of my work happens in private company repositories, so it doesn't show on my public GitHub profile. This page shows the same activity with every company detail removed: only dates, counts, and the kind of work."));
  root.appendChild(head);

  const stats = el("div", { class: "wp-stats" });
  [[t.contributions, "contributions"], [t.prs_merged, "pull requests merged"],
   [t.reviews, "pull requests reviewed"], [t.docs, "design docs and runbooks"],
   [t.active_days, "active days"]].forEach(([n, label]) => {
    const s = el("div", { class: "wp-stat" });
    s.appendChild(el("b", {}, String(n)));
    s.appendChild(el("span", {}, label));
    stats.appendChild(s);
  });
  root.appendChild(stats);

  const cal = el("section", { class: "wp-section" });
  const ch = el("div", { class: "wp-section-head" });
  ch.appendChild(el("h3", {}, "Daily activity"));
  const legend = el("div", { class: "wp-legend", "aria-hidden": "true" });
  legend.appendChild(document.createTextNode("Less"));
  for (let i = 0; i <= 4; i++) {
    const sw = el("i"); sw.style.background = `var(--wp-heat-${i})`; legend.appendChild(sw);
  }
  legend.appendChild(document.createTextNode("More"));
  ch.appendChild(legend);
  cal.appendChild(ch);
  const scroll = el("div", { class: "wp-cal-scroll" });
  scroll.appendChild(calendar(activity.days, tip));
  cal.appendChild(scroll);
  cal.appendChild(el("p", { class: "wp-note" },
    "Commits, pull requests, reviews, and issues in private repositories, as counted by GitHub."));
  root.appendChild(cal);

  const two = el("div", { class: "wp-two" });
  const mo = el("section", { class: "wp-section" });
  const mh = el("div", { class: "wp-section-head" });
  mh.appendChild(el("h3", {}, "Shipping and reviewing"));
  const key = el("div", { class: "wp-key" });
  [["PRs merged", "var(--wp-s1)"], ["Reviews", "var(--wp-s2)"]].forEach(([l, c]) => {
    const sp = el("span"); const i = el("i"); i.style.background = c;
    sp.appendChild(i); sp.appendChild(document.createTextNode(l)); key.appendChild(sp);
  });
  mh.appendChild(key);
  mo.appendChild(mh);
  monthly(activity.days, tip).forEach((n) => mo.appendChild(n));
  two.appendChild(mo);

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
  two.appendChild(tech);
  root.appendChild(two);

  const pr = el("section", { class: "wp-section" });
  pr.appendChild(el("h3", {}, "Selected work"));
  const cards = el("div", { class: "wp-cards" });
  projects.forEach((p) => {
    const c = el("article", { class: "wp-card" });
    c.appendChild(el("span", { class: "period" }, p.period));
    c.appendChild(el("h4", {}, p.title));
    c.appendChild(el("p", {}, p.summary));
    c.appendChild(el("span", { class: "outcome" }, p.outcome));
    const chips = el("div", { class: "wp-chips" });
    p.stack.forEach((s) => chips.appendChild(el("span", {}, s)));
    c.appendChild(chips);
    cards.appendChild(c);
  });
  pr.appendChild(cards);
  root.appendChild(pr);

  root.appendChild(el("p", { class: "wp-foot" },
    `Updated ${fmtDate(activity.generated)}. Counts come from GitHub's private contribution calendar and local git history. Project descriptions are written by hand and leave out company names, systems, and people.`));
}
