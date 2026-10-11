// Generates the placeholder desert artwork in /public/media.
// Run with: node scripts/generate-art.mjs
// Swap these out for real stills whenever they exist.
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../public/media/", import.meta.url);
mkdirSync(OUT, { recursive: true });

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hex = (c) => c.match(/\w\w/g).map((h) => parseInt(h, 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

function ridge(r, w, h, base, amp, opts) {
  const { step = 8, mesa = 0, freq = 1 } = opts;
  const phases = [r() * 10, r() * 10, r() * 10];
  const pts = [];
  for (let x = -step; x <= w + step; x += step) {
    const u = (x / w) * freq;
    let n =
      Math.sin(u * 3.1 + phases[0]) * 0.55 +
      Math.sin(u * 7.3 + phases[1]) * 0.28 +
      Math.sin(u * 15.7 + phases[2]) * 0.12 +
      (mesa ? 0 : (r() - 0.5) * 0.05);
    if (mesa) {
      // Flat-topped benches with steep, smooth risers, like Southern Utah mesas.
      const k = n * mesa;
      const fl = Math.floor(k);
      const f = Math.min(1, Math.max(0, (k - fl - 0.42) / 0.16));
      n = (fl + f * f * (3 - 2 * f)) / mesa;
    }
    pts.push([x, base - n * amp]);
  }
  return `M${-step},${h} ` + pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + ` L${w + step},${h} Z`;
}

function scene(name, cfg) {
  const { w = 1600, h = 1000, seed, sky, sun, layers, haze, stars = 0, figure = false, tower = false } = cfg;
  const r = rng(seed);
  let body = "";
  if (stars) {
    for (let i = 0; i < stars; i++) {
      const o = (0.2 + r() * 0.7).toFixed(2);
      body += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h * 0.55).toFixed(0)}" r="${(r() * 1.3 + 0.3).toFixed(1)}" fill="#f3e9da" opacity="${o}"/>`;
    }
  }
  if (sun) {
    body += `<circle cx="${sun.x * w}" cy="${sun.y * h}" r="${sun.r * w * 4}" fill="url(#glow)"/>`;
    body += `<circle cx="${sun.x * w}" cy="${sun.y * h}" r="${sun.r * w}" fill="${sun.color}" opacity="${sun.opacity ?? 0.95}"/>`;
  }
  if (tower) {
    const tx = w * tower.x, tw = w * 0.07, top = h * tower.top;
    body += `<path d="M${tx - tw * 2.2},${h} C${tx - tw * 1.3},${h * 0.8} ${tx - tw * 1.1},${top + 200} ${tx - tw * 0.85},${top + 90} L${tx - tw * 0.7},${top + 30} L${tx - tw * 0.4},${top + 8} L${tx},${top} L${tx + tw * 0.4},${top + 12} L${tx + tw * 0.6},${top + 50} L${tx + tw * 0.62},${top + 140} C${tx + tw * 0.9},${top + 260} ${tx + tw * 1.2},${h * 0.75} ${tx + tw * 2},${h} Z" fill="${tower.color}"/>`;
  }
  layers.forEach((l, i) => {
    body += `<path d="${ridge(r, w, h, l.base * h, l.amp * h, l)}" fill="${l.color}"/>`;
    if (haze && i < layers.length - 1) {
      body += `<rect x="0" y="${(l.base - l.amp * 1.4) * h}" width="${w}" height="${h}" fill="url(#haze)" opacity="${haze}"/>`;
    }
  });
  if (figure) {
    const fx = w * figure.x, fy = h * figure.y, s = figure.s;
    body += `<g fill="${figure.color}">
      <circle cx="${fx}" cy="${fy - 34 * s}" r="${5 * s}"/>
      <path d="M${fx - 6 * s},${fy - 28 * s} L${fx + 6 * s},${fy - 28 * s} L${fx + 5 * s},${fy - 6 * s} L${fx + 4 * s},${fy + 14 * s} L${fx + 1 * s},${fy + 14 * s} L${fx},${fy - 4 * s} L${fx - 1 * s},${fy + 14 * s} L${fx - 4 * s},${fy + 14 * s} L${fx - 5 * s},${fy - 6 * s} Z"/>
      <rect x="${fx + 8 * s}" y="${fy - 26 * s}" width="${9 * s}" height="${6 * s}"/>
      <path d="M${fx + 12 * s},${fy - 20 * s} L${fx + 6 * s},${fy + 14 * s} M${fx + 12 * s},${fy - 20 * s} L${fx + 18 * s},${fy + 14 * s} M${fx + 12 * s},${fy - 20 * s} L${fx + 12 * s},${fy + 14 * s}" stroke="${figure.color}" stroke-width="${1.2 * s}"/>
    </g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${sky.map((c, i) => `<stop offset="${(i / (sky.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("")}</linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="${sun?.glow ?? "#000"}" stop-opacity="0.55"/><stop offset="1" stop-color="${sun?.glow ?? "#000"}" stop-opacity="0"/></radialGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[sky.length - 1]}" stop-opacity="0"/><stop offset="0.1" stop-color="${sky[sky.length - 1]}" stop-opacity="0.28"/><stop offset="0.3" stop-color="${sky[sky.length - 1]}" stop-opacity="0"/></linearGradient>
  <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#sky)"/>
${body}
<rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
  writeFileSync(new URL(`${name}.svg`, OUT), svg);
}

const layersFrom = (colors, opts) =>
  colors.map((color, i) => ({
    color,
    base: opts.start + i * opts.gap,
    amp: opts.amp * (1 - i * 0.12),
    mesa: opts.mesa?.[i] ?? 0,
    freq: opts.freq?.[i] ?? 1 + i * 0.3,
    step: 6,
  }));

const ramp = (from, to, n) => Array.from({ length: n }, (_, i) => mix(from, to, i / (n - 1)));

// Amber dusk over mesas
scene("hero", {
  seed: 11, sky: ["#0d0907", "#2a160d", "#7a3a1a", "#d07a3a"],
  sun: { x: 0.68, y: 0.6, r: 0.03, color: "#f4b46a", glow: "#e0803a" },
  layers: layersFrom(ramp("#8a4a2a", "#0a0706", 5), { start: 0.6, gap: 0.08, amp: 0.1, mesa: [4, 3, 0, 2, 0] }),
  haze: 0.9,
});
scene("showreel", {
  seed: 23, sky: ["#07080b", "#151a22", "#3a3f48", "#b06a3c"],
  sun: { x: 0.3, y: 0.66, r: 0.022, color: "#f0c08a", glow: "#c0703a", opacity: 0.8 },
  layers: layersFrom(ramp("#3a3434", "#060506", 5), { start: 0.64, gap: 0.07, amp: 0.09, mesa: [0, 3, 0, 0, 2] }),
  haze: 0.7,
});
// Projects
scene("work-kayenta", {
  seed: 31, h: 1200, sky: ["#120b08", "#3b1d10", "#a2532a", "#e6a064"],
  sun: { x: 0.5, y: 0.58, r: 0.035, color: "#ffd8a0", glow: "#f09040" },
  layers: layersFrom(ramp("#9a5634", "#0b0706", 4), { start: 0.62, gap: 0.1, amp: 0.12, mesa: [3, 0, 2, 0] }),
  haze: 0.8,
});
scene("work-ridgeline", {
  seed: 47, sky: ["#06070a", "#10141c", "#273041", "#5d6676"],
  stars: 220,
  layers: layersFrom(ramp("#2a2e38", "#040405", 4), { start: 0.62, gap: 0.09, amp: 0.13, freq: [1.8, 1.4, 2.2, 1] }),
  figure: { x: 0.62, y: 0.6, s: 1.3, color: "#040405" },
});
scene("work-reef", {
  seed: 59, w: 1200, h: 1500, sky: ["#1a0f0c", "#4a2418", "#b2603a", "#e8b080"],
  sun: { x: 0.3, y: 0.42, r: 0.05, color: "#ffe0b0", glow: "#f0a060" },
  tower: { x: 0.68, top: 0.24, color: "#2a130c" },
  layers: layersFrom(ramp("#7a3a22", "#0a0605", 4), { start: 0.68, gap: 0.08, amp: 0.08, mesa: [3, 2, 0, 0] }),
  haze: 0.7,
});
scene("work-coral", {
  seed: 67, w: 1200, h: 1500, sky: ["#1c1014", "#4a2228", "#c06a5a", "#f0b89a"],
  sun: { x: 0.55, y: 0.5, r: 0.06, color: "#ffe6cc", glow: "#f08870" },
  layers: layersFrom(ramp("#c27a5e", "#140a0a", 5), { start: 0.56, gap: 0.09, amp: 0.07, freq: [0.8, 1.1, 0.9, 1.3, 0.7] }),
  haze: 0.6,
});
scene("work-sandhollow", {
  seed: 73, sky: ["#0b0c0f", "#1d2026", "#4e4a48", "#c9946a"],
  sun: { x: 0.82, y: 0.64, r: 0.025, color: "#f8d2a0", glow: "#d08a50", opacity: 0.9 },
  layers: layersFrom(ramp("#5e4436", "#070606", 4), { start: 0.66, gap: 0.08, amp: 0.07, mesa: [0, 4, 0, 3] }),
  haze: 0.8,
});
scene("work-ironsage", {
  seed: 89, sky: ["#0e0d0b", "#22201b", "#4a4436", "#8a7a5a"],
  sun: { x: 0.2, y: 0.5, r: 0.04, color: "#e8dcc0", glow: "#a89060", opacity: 0.7 },
  layers: layersFrom(ramp("#5a5040", "#070605", 5), { start: 0.58, gap: 0.08, amp: 0.1, freq: [1.2, 2, 1.6, 2.4, 1] }),
  haze: 0.6,
});
// Services
scene("service-realestate", {
  seed: 101, w: 1000, h: 1250, sky: ["#100a08", "#3a1e12", "#b0643a", "#f0b070"],
  sun: { x: 0.6, y: 0.62, r: 0.05, color: "#ffdcaa", glow: "#f09a50" },
  layers: layersFrom(ramp("#7a4026", "#0a0605", 3), { start: 0.66, gap: 0.1, amp: 0.08, mesa: [3, 0, 2] }),
  haze: 0.8,
});
scene("service-brand", {
  seed: 113, w: 1000, h: 1250, sky: ["#070708", "#16161a", "#36343a", "#7a6a5e"],
  stars: 120,
  layers: layersFrom(ramp("#2e2a2c", "#050405", 3), { start: 0.66, gap: 0.1, amp: 0.1 }),
  figure: { x: 0.45, y: 0.64, s: 2, color: "#050405" },
});
scene("service-aerial", {
  seed: 127, w: 1000, h: 1250, sky: ["#1a0e0a", "#4a2214", "#c06a38", "#f2b27a"],
  tower: { x: 0.5, top: 0.3, color: "#2c140c" },
  layers: layersFrom(ramp("#8a4628", "#0a0605", 4), { start: 0.64, gap: 0.08, amp: 0.06, mesa: [3, 3, 0, 0] }),
  haze: 0.7,
});
scene("service-social", {
  seed: 131, w: 1000, h: 1250, sky: ["#1a1012", "#3e2026", "#a86058", "#e8a888"],
  sun: { x: 0.4, y: 0.5, r: 0.07, color: "#ffe2c8", glow: "#f08870" },
  layers: layersFrom(ramp("#b06a54", "#120909", 4), { start: 0.58, gap: 0.1, amp: 0.06, freq: [0.8, 1.2, 0.9, 1.1] }),
  haze: 0.6,
});
// Portrait
scene("portrait", {
  seed: 149, w: 1000, h: 1300, sky: ["#0c0806", "#2a150c", "#8a4422", "#e09050"],
  sun: { x: 0.62, y: 0.58, r: 0.06, color: "#ffd59a", glow: "#f08a40" },
  layers: layersFrom(ramp("#6a3620", "#080504", 3), { start: 0.66, gap: 0.12, amp: 0.06, mesa: [3, 0, 0] }),
  figure: { x: 0.4, y: 0.665, s: 2.6, color: "#080504" },
  haze: 0.8,
});
console.log("art generated");
