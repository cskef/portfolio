(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reduceMotion && !isTouch && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.getElementById("explore-btn")?.addEventListener("click", () => {
    const target = document.getElementById("projets");
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else target.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------- Custom cursor (cercle + formes contextuelles) ---------------- */
  const cursor = document.getElementById("cursor");
  if (cursor && !isTouch) {
    const label = cursor.querySelector(".cursor-label");
    let mx = 0, my = 0, cx = 0, cy = 0, seeded = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!seeded) { cx = mx; cy = my; seeded = true; }
    });

    const render = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    render();

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
        label.textContent = magnetic.getAttribute("data-cursor") || "";
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
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        const dist = Math.hypot(relX, relY);
        if (dist < 80) {
          gsap.to(el, {
            x: Math.max(-15, Math.min(15, relX * 0.35)),
            y: Math.max(-15, Math.min(15, relY * 0.35)),
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------------- Tilt cards ---------------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateX: -py * 8,
          rotateY: px * 8,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 900,
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
      });
    });
  }

  /* ---------------- Hero entrance (single orchestrated sequence) ---------------- */
  const heroLines = document.querySelectorAll(".hero-title .line");
  if (reduceMotion) {
    heroLines.forEach((l) => (l.style.opacity = 1));
  } else {
    gsap.set(heroLines, { yPercent: 110, opacity: 0 });
    gsap.set(".hero-status, .hero-sub, .hero-actions", { opacity: 0, y: 14 });
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(".hero-status", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
      .to(heroLines, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power4.out" }, 0.1)
      .to(".hero-sub, .hero-actions", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.55)
      .fromTo(".hero-figure", { opacity: 0 }, { opacity: 0.9, duration: 1.2, ease: "power2.out" }, 0.6);
  }

  /* ---------------- Scroll-triggered section reveals ---------------- */
  if (!reduceMotion) {
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

  /* ---------------- GitHub stats (client-side, graceful fallback) ---------------- */
  const FALLBACK = { repos: 10, stars: 1, lang: "Python" };

  async function loadGithubStats() {
    const elRepos = document.getElementById("gh-repos");
    const elStars = document.getElementById("gh-stars");
    const elLang = document.getElementById("gh-lang");
    try {
      const res = await fetch("https://api.github.com/users/cskef/repos?per_page=100");
      if (!res.ok) throw new Error("rate-limited");
      const repos = await res.json();
      const own = repos.filter((r) => !r.fork);
      const stars = own.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      const langCount = {};
      own.forEach((r) => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || FALLBACK.lang;
      animateValue(elRepos, repos.length);
      animateValue(elStars, stars);
      elLang.textContent = topLang;
    } catch {
      animateValue(elRepos, FALLBACK.repos);
      animateValue(elStars, FALLBACK.stars);
      elLang.textContent = FALLBACK.lang;
    }
  }

  function animateValue(el, end) {
    if (!el) return;
    if (reduceMotion) { el.textContent = end; return; }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(obj.val)),
    });
  }

  loadGithubStats();
})();
