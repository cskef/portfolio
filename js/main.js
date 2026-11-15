(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  // Si le CDN de GSAP est indisponible, le site reste entièrement lisible et fonctionnel (sans animations)
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const animated = !!(gsap && ScrollTrigger) && !reduceMotion;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (animated && !isTouch && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (target) => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  document.getElementById("explore-btn")?.addEventListener("click", () => {
    scrollToTarget(document.getElementById("projets"));
  });

  /* ---------------- Custom cursor (cercle + formes contextuelles) ---------------- */
  const CURSOR_EN = { Ouvrir: "Open", Voir: "View", Lire: "Read" };
  const cursor = document.getElementById("cursor");
  if (cursor && !isTouch) {
    const label = cursor.querySelector(".cursor-label");
    let mx = 0, my = 0, cx = 0, cy = 0, seeded = false, running = false;

    // La boucle ne tourne que tant que le curseur n'a pas rejoint le pointeur
    const render = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(mx - cx) + Math.abs(my - cy) < 0.1) { running = false; return; }
      requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!seeded) { cx = mx; cy = my; seeded = true; }
      if (!running) { running = true; requestAnimationFrame(render); }
    }, { passive: true });

    const resetCursor = () => {
      cursor.classList.remove("is-active", "is-shape");
      cursor.removeAttribute("data-shape");
      label.textContent = "";
    };

    // Priorité : élément cliquable ([data-magnetic]) > zone à forme ([data-cursor-shape]) > cercle simple
    document.addEventListener("mouseover", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      const magnetic = t.closest("[data-magnetic]");
      const shaped = t.closest("[data-cursor-shape]");

      if (magnetic) {
        cursor.classList.remove("is-shape");
        cursor.removeAttribute("data-shape");
        cursor.classList.add("is-active");
        const text = magnetic.getAttribute("data-cursor") || "";
        const en = document.documentElement.getAttribute("lang") === "en";
        label.textContent = en ? CURSOR_EN[text] || text : text;
      } else if (shaped) {
        cursor.classList.remove("is-active");
        label.textContent = "";
        cursor.classList.add("is-shape");
        cursor.setAttribute("data-shape", shaped.getAttribute("data-cursor-shape"));
      } else {
        resetCursor();
      }
    });

    document.documentElement.addEventListener("mouseleave", resetCursor);
  }

  /* ---------------- Magnetic elements ---------------- */
  if (animated && !isTouch) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        if (Math.hypot(relX, relY) < 80) {
          xTo(Math.max(-15, Math.min(15, relX * 0.35)));
          yTo(Math.max(-15, Math.min(15, relY * 0.35)));
        }
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)", overwrite: true });
      });
    });
  }

  /* ---------------- Cartes projet : inclinaison + halo qui suit le pointeur ---------------- */
  if (!isTouch) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let rxTo, ryTo;
      if (animated) {
        gsap.set(card, { transformPerspective: 900 });
        rxTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
        ryTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
      }
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        if (rxTo) { rxTo(-(py - 0.5) * 6); ryTo((px - 0.5) * 6); }
      });
      card.addEventListener("mouseleave", () => {
        if (animated) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out", overwrite: true });
      });
    });
  }

  /* ---------------- Hero entrance (single orchestrated sequence) ---------------- */
  if (animated) {
    const heroLines = document.querySelectorAll(".hero-title .line");
    gsap.set(heroLines, { yPercent: 110, opacity: 0 });
    gsap.set(".hero-status, .hero-sub, .hero-actions", { opacity: 0, y: 14 });
    gsap.timeline({ delay: 0.15 })
      .to(".hero-status", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
      .to(heroLines, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power4.out" }, 0.1)
      .to(".hero-sub, .hero-actions", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.55)
      .fromTo(".hero-figure", { opacity: 0 }, { opacity: 0.9, duration: 1.2, ease: "power2.out" }, 0.6);
  }

  /* ---------------- Scroll : apparitions, parallaxe, progression ---------------- */
  if (animated) {
    gsap.utils.toArray(".section-head, .project-card, .more-work, .timeline-item, .skill-group, .github-panel").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    // Les figures se déplacent plus lentement que le texte : effet de profondeur
    gsap.utils.toArray(".graph-svg, .project-figure svg, .timeline-figure svg, .contact-figure svg").forEach((el) => {
      gsap.fromTo(el, { y: 36 }, {
        y: -36,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });

    // La ligne du parcours se trace au fil du défilement
    const list = document.querySelector(".timeline-list");
    if (list) {
      gsap.fromTo(list, { "--progress": 0 }, {
        "--progress": 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 55%", scrub: 0.4 },
      });
    }

    // Barre de progression de lecture
    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  /* ---------------- Navigation : section courante ---------------- */
  if (gsap && ScrollTrigger) {
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const section = document.querySelector(a.getAttribute("href"));
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          a.classList.toggle("is-current", self.isActive);
          if (self.isActive) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        },
      });
    });
  }

  /* ---------------- Email copy ---------------- */
  const emailBtn = document.getElementById("email-copy");
  if (emailBtn) {
    const hint = emailBtn.querySelector(".copy-hint");
    const t = (key) => {
      const lang = document.documentElement.getAttribute("lang") === "en" ? "en" : "fr";
      return window.fkI18n?.dict?.[key]?.[lang] ?? hint.textContent;
    };
    emailBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("kefra.ck@gmail.com");
        hint.textContent = t("contact.copied");
      } catch {
        hint.textContent = "kefra.ck@gmail.com";
      } finally {
        setTimeout(() => (hint.textContent = t("contact.copy")), 1800);
      }
    });
  }

  /* ---------------- GitHub stats (chargées à l'approche du panneau, mises en cache) ---------------- */
  const FALLBACK = { repos: 10, stars: 1, lang: "Python" };
  const CACHE_KEY = "fk-gh-stats";

  async function fetchGithubStats() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached) return cached;
    } catch {}
    try {
      const res = await fetch("https://api.github.com/users/cskef/repos?per_page=100");
      if (!res.ok) throw new Error("rate-limited");
      const repos = await res.json();
      const own = repos.filter((r) => !r.fork);
      const langCount = {};
      own.forEach((r) => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const stats = {
        repos: repos.length,
        stars: own.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
        lang: Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || FALLBACK.lang,
      };
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(stats)); } catch {}
      return stats;
    } catch {
      return FALLBACK;
    }
  }

  function animateValue(el, end) {
    if (!el) return;
    if (!animated) { el.textContent = end; return; }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(obj.val)),
    });
  }

  async function showGithubStats() {
    const stats = await fetchGithubStats();
    animateValue(document.getElementById("gh-repos"), stats.repos);
    animateValue(document.getElementById("gh-stars"), stats.stars);
    const elLang = document.getElementById("gh-lang");
    if (elLang) elLang.textContent = stats.lang;
  }

  const ghPanel = document.getElementById("github-stats");
  if (ghPanel && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      io.disconnect();
      showGithubStats();
    }, { rootMargin: "300px 0px" });
    io.observe(ghPanel);
  } else if (ghPanel) {
    showGithubStats();
  }
})();
