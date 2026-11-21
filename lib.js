import { defaults, ready, fb } from "./data.js";
export { defaults, ready };
let P; export const F = () => (P ||= fb());

export const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const U = s => { s = String(s || "").trim(); if (/^[\w-]+(\.[\w-]+)+\//.test(s)) s = "https://" + s; return /^(https?:\/\/|data:image\/|mailto:|tel:)/i.test(s) || !/^[a-z]+:/i.test(s) ? e(s) : "#"; };

export const SEED = {
  stats: [{ value: "12+", label: "National competitions" }, { value: "92.6%", label: "BCI model accuracy" }, { value: "7+", label: "Teams mentored" }, { value: "6th", label: "World rank, ARC 2026" }],
  education: [
    { degree: "B.Sc. in Electrical & Electronic Engineering", school: "Green University of Bangladesh", date: "2022 – 2026", detail: "CGPA 3.61 / 4.00" },
    { degree: "Higher Secondary Certificate", school: "Jalalpur College, Sylhet", date: "2019 – 2022", detail: "GPA 4.75 / 5.00" },
    { degree: "Secondary School Certificate", school: "Jalalpur High School, Sylhet", date: "2017 – 2019", detail: "GPA 4.50 / 5.00" }
  ]
};
SEED.services = [
  { title: "Embedded & IoT development", desc: "Firmware, sensors and connected devices on ESP32, Arduino and more." },
  { title: "PCB design & fabrication", desc: "Schematics and custom boards in Altium and EasyEDA, from prototype to fabrication." },
  { title: "Robotics & automation", desc: "Autonomous robots, rovers and PLC-based industrial automation." },
  { title: "Training & workshops", desc: "Hands-on sessions on electronics, microcontrollers and robotics." }
];
export const META = {
  projects: ["Projects", "Things I’ve designed, built and researched."],
  research: ["Research", "Published, under-review and ongoing work."],
  certificates: ["Certificates", "Courses and skill certifications."],
  press: ["In the media", "Where our work has been featured."],
  posts: ["Blog", "Notes, write-ups and lessons learned."]
};

// ---------- data ----------
export async function main() {
  if (!ready) return defaults;
  try { const { db, f } = await F(); const s = await f.getDoc(f.doc(db, "portfolio", "main")); return s.exists() ? s.data() : defaults; } catch { return defaults; }
}
export async function list(c, d) {
  if (ready) {
    try {
      const { db, f } = await F(); const s = await f.getDocs(f.collection(db, c));
      const a = s.docs.map(x => ({ ...x.data(), id: x.id }));
      if (a.length) return a.sort((x, y) => (y.ts || 0) - (x.ts || 0));
    } catch { }
  }
  return (d?.[c] || []).map(x => ({ ...x }));
}
export async function getOne(c, id) {
  if (!ready) return null;
  try { const { db, f } = await F(); const s = await f.getDoc(f.doc(db, c, id)); return s.exists() ? { ...s.data(), id } : null; } catch { return null; }
}
export async function send(m) { const { db, f } = await F(); await f.addDoc(f.collection(db, "messages"), { ...m, ts: Date.now() }); }

// ---------- rendering ----------
export const chips = t => t ? `<div class="chips">${String(t).split(",").filter(x => x.trim()).map(x => `<span class="chip">${e(x.trim())}</span>`).join("")}</div>` : "";
const sub = (c, x) => (c === "research" ? [x.status, x.venue] : c === "certificates" ? [x.kind, x.issuer] : c === "press" ? [x.outlet] : []).filter(Boolean);

export function card(c, x) {
  const href = c === "press" ? (x.link ? U(x.link) : "") : (x.id ? `page.html?c=${c}&id=${encodeURIComponent(x.id)}` : "");
  const img = x.image ? `<div class="im"><img loading="lazy" src="${U(x.image)}" alt="" onerror="this.remove()"></div>` : (c === "research" || c === "press" ? "" : `<div class="im">${e((x.title || "?")[0])}</div>`);
  const meta = [x.date, ...sub(c, x)].filter(Boolean).join(" · ");
  const open = href ? `a href="${href}"${c === "press" ? ' target="_blank" rel="noopener"' : ""}` : "div";
  return `<${open} class="card pc rv">${img}<div class="pb"><span class="d">${e(meta)}</span><h3>${e(x.title)}</h3><p>${e(x.desc)}</p>${chips(x.tags)}</div></${href ? "a" : "div"}>`;
}

const LBL = { projects: ["View project", "Source code"], research: ["Read paper", "Download PDF"], certificates: ["Verify credential"], press: ["Read article"] };
export function detail(c, x) {
  const meta = [x.date, ...sub(c, x)].filter(Boolean).join(" · ");
  const rt = c === "posts" ? ` · ${Math.max(1, Math.round(String(x.content || "").split(/\s+/).length / 200))} min read` : "";
  const L = LBL[c] || [];
  const btn = [x.link, x.link2].map((l, i) => l && L[i] ? `<a class="btn ${i ? "" : "p"}" href="${U(l)}" target="_blank" rel="noopener">${L[i]}</a>` : "").join("");
  return `<article class="w art"><a class="back" href="page.html?c=${c}">← All ${META[c][0].toLowerCase()}</a><div class="d">${e(meta + rt)}</div><h1>${e(x.title)}</h1>${chips(x.tags)}${x.image ? `<img class="cov" src="${U(x.image)}" alt="${e(x.title)}">` : ""}${x.desc ? `<p class="lead">${e(x.desc)}</p>` : ""}<div class="md">${md(x.content)}</div>${btn ? `<div class="cta">${btn}</div>` : ""}</article>`;
}

// Small Markdown: headings, bold/italic, lists, quotes, code, links, images
export function md(s) {
  const inl = t => t
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, b) => `<img loading="lazy" src="${U(b.replace(/&amp;/g, "&"))}" alt="${a}">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, b) => `<a href="${U(b.replace(/&amp;/g, "&"))}" target="_blank" rel="noopener">${a}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, "<i>$1</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
  let o = "", ul = false, code = false, para = [];
  const fp = () => { if (para.length) { o += `<p>${inl(para.join(" "))}</p>`; para = []; } };
  const fu = () => { if (ul) { o += "</ul>"; ul = false; } };
  for (const l of e(s).split("\n")) {
    if (l.trim().startsWith("```")) { fp(); fu(); o += code ? "</code></pre>" : "<pre><code>"; code = !code; continue; }
    if (code) { o += l + "\n"; continue; }
    let m;
    if ((m = l.trim().match(/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/))) { fp(); fu(); o += `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" loading="lazy" allowfullscreen title="Video"></iframe></div>`; continue; }
    if (!l.trim()) { fp(); fu(); }
    else if ((m = l.match(/^(#{1,3})\s+(.*)/))) { fp(); fu(); const n = m[1].length + 1; o += `<h${n}>${inl(m[2])}</h${n}>`; }
    else if ((m = l.match(/^[-*]\s+(.*)/))) { fp(); if (!ul) { o += "<ul>"; ul = true; } o += `<li>${inl(m[1])}</li>`; }
    else if ((m = l.match(/^&gt;\s?(.*)/))) { fp(); fu(); o += `<blockquote>${inl(m[1])}</blockquote>`; }
    else para.push(l.trim());
  }
  fp(); fu(); return o + (code ? "</code></pre>" : "");
}

export function initTheme(btn) {
  const r = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) r.dataset.theme = t; } catch { }
  btn.onclick = () => {
    const dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    r.dataset.theme = dark ? "light" : "dark"; try { localStorage.setItem("theme", r.dataset.theme); } catch { }
  };
}
export function extras() {
  const nav = document.querySelector("nav"), mb = document.getElementById("mb");
  if (mb) { mb.onclick = () => nav.classList.toggle("open"); nav.addEventListener("click", ev => ev.target.closest(".nl a") && nav.classList.remove("open")); }
  const t = document.createElement("button"); t.id = "top"; t.setAttribute("aria-label", "Back to top"); t.textContent = "↑";
  t.onclick = () => scrollTo({ top: 0, behavior: "smooth" }); document.body.appendChild(t);
  addEventListener("scroll", () => t.classList.toggle("show", scrollY > 600), { passive: true });
}
export function reveal() {
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add("in"), io.unobserve(x.target))), { threshold: .08 }) : null;
  document.querySelectorAll(".rv:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in"));
}
