/* Champ de profondeur : un réseau de points en 3D, traversé au fil du scroll
   et légèrement décalé par le pointeur. Canvas 2D, sans dépendance. */
(() => {
  "use strict";

  const canvas = document.getElementById("field");
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const DEPTH = 1600;      // profondeur du volume, en unités « monde »
  const FOCAL = 520;       // focale de la projection
  const NEAR = 80;
  const LINK = 130;        // distance max (px écran) pour relier deux points
  const POINTER_LINK = 190;
  const DRIFT = 14;        // avance automatique, unités / seconde

  let w = 0, h = 0, pts = [];
  let ink = "#8C8C93", accent = "#00F5A0";
  let pointerX = 0, pointerY = 0, hasPointer = false; // px écran
  let ox = 0, oy = 0;      // décalage parallaxe lissé (-1..1)
  let cam = 0, scrollSmooth = window.scrollY, travelled = 0;
  let raf = 0, last = 0;

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue("--ink-dim").trim() || ink;
    accent = cs.getPropertyValue("--accent").trim() || accent;
  }

  function build() {
    const count = Math.round(Math.max(28, Math.min(110, (w * h) / 15000)));
    const sx = Math.max(w, 900) * 0.9;
    const sy = Math.max(h, 700) * 0.9;
    pts = Array.from({ length: count }, () => ({
      x: (Math.random() * 2 - 1) * sx,
      y: (Math.random() * 2 - 1) * sy,
      z: Math.random() * DEPTH,
      accent: Math.random() < 0.09,
      sx: 0, sy: 0, s: 0, a: 0, zr: 0,
    }));
  }

  function resize() {
    const nw = window.innerWidth, nh = window.innerHeight;
    // Sur mobile, la barre d'adresse change la hauteur en continu : on ignore ces micro-variations
    if (nw === w && Math.abs(nh - h) < 140 && pts.length) return;
    const widthChanged = nw !== w;
    w = nw; h = nh;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (widthChanged || !pts.length) build();
    if (!raf) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    for (const p of pts) {
      const zr = (((p.z - cam) % DEPTH) + DEPTH) % DEPTH;
      const s = FOCAL / (zr + NEAR);
      p.zr = zr;
      p.s = s;
      p.sx = cx + (p.x - ox * 70) * s;
      p.sy = cy + (p.y - oy * 50) * s;
      // fondu à l'approche et au loin : le bouclage en profondeur reste invisible
      p.a = Math.min(1, zr / 220) * (1 - zr / DEPTH);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = ink;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      if (a.a < 0.05) continue;
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        if (b.a < 0.05 || Math.abs(a.zr - b.zr) > 320) continue;
        const dx = a.sx - b.sx, dy = a.sy - b.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * Math.min(a.a, b.a) * 0.55;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    // le pointeur devient un nœud du réseau
    if (hasPointer) {
      ctx.strokeStyle = accent;
      for (const p of pts) {
        if (p.a < 0.05) continue;
        const d = Math.hypot(p.sx - pointerX, p.sy - pointerY);
        if (d > POINTER_LINK) continue;
        ctx.globalAlpha = (1 - d / POINTER_LINK) * p.a * 0.8;
        ctx.beginPath();
        ctx.moveTo(pointerX, pointerY);
        ctx.lineTo(p.sx, p.sy);
        ctx.stroke();
      }
    }

    for (const p of pts) {
      if (p.a < 0.02) continue;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.accent ? accent : ink;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.min(3.6, (p.accent ? 2.1 : 1.5) * p.s), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    travelled += DRIFT * dt;
    scrollSmooth += (window.scrollY - scrollSmooth) * 0.09;
    cam = travelled + scrollSmooth * 0.55;

    const tx = hasPointer ? (pointerX / w) * 2 - 1 : 0;
    const ty = hasPointer ? (pointerY / h) * 2 - 1 : 0;
    ox += (tx - ox) * 0.05;
    oy += (ty - oy) * 0.05;

    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || reduceMotion || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  readColors();
  resize();

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("fk:themechange", () => { readColors(); if (!raf) draw(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  if (!isTouch && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      pointerX = e.clientX; pointerY = e.clientY; hasPointer = true;
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => (hasPointer = false));
  }

  if (reduceMotion) {
    // image fixe : on suit seulement la position de scroll, sans animation continue
    cam = window.scrollY * 0.55;
    draw();
  } else {
    start();
  }
})();
