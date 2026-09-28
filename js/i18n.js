(() => {
  "use strict";

  const DICT = {
    "meta.title": {
      fr: "Frank KEYANYEM",
      en: "Frank KEYANYEM",
    },
    "meta.description": {
      fr: "Portfolio de Frank KEYANYEM, élève-ingénieur en double diplôme ENSPY / INP Toulouse N7",
      en: "Portfolio of Frank KEYANYEM, dual-degree engineering student at ENSPY / INP Toulouse N7",
    },
    "nav.skip": { fr: "Aller au contenu", en: "Skip to content" },
    "nav.projects": { fr: "Projets", en: "Projects" },
    "nav.path": { fr: "Parcours", en: "Path" },
    "nav.skills": { fr: "Compétences", en: "Skills" },
    "nav.contact": { fr: "Contact", en: "Contact" },
    "nav.cv": { fr: "CV", en: "Resume" },

    "hero.status": {
      fr: "À la recherche d'un stage de fin d'études",
      en: "Looking for a final-year engineering internship",
    },
    "hero.title": {
      fr: '<span class="line">Je conçois des <em>systèmes</em></span><span class="line">qui apprennent à <em>décider.</em></span>',
      en: '<span class="line">I build <em>systems</em></span><span class="line">that learn to <em>decide.</em></span>',
    },
    "hero.title.aria": {
      fr: "Je conçois des systèmes qui apprennent à décider.",
      en: "I build systems that learn to decide.",
    },
    "hero.sub": {
      fr: "Frank KEYANYEM, élève-ingénieur en double diplôme entre l'École Nationale Supérieure Polytechnique de Yaoundé et l'INP Toulouse N7. Je développe des compétences utile pour un travail de frontière entre intelligence artificielle et logiciel embarqué.",
      en: "Frank KEYANYEM, dual-degree engineering student between the École Nationale Supérieure Polytechnique de Yaoundé and INP Toulouse N7. I am developing skills useful for work at the intersection of artificial intelligence and embedded software.",
    },
    "hero.explore": { fr: "Explorer les projets", en: "Explore the projects" },
    "hero.github": { fr: "GitHub ↗", en: "GitHub ↗" },

    "projects.title": { fr: "Quelques projets développés", en: "Some projects" },
    "projects.subtitle": { fr: "La démarche compte plus que le nombre.", en: "The approach matters more than the count." },

    "project1.index": { fr: "Réalité augmentée · équipe de 3", en: "Augmented reality · team of 3" },
    "project1.title": { fr: "Solar System AR : explorer le système solaire en réalité augmentée", en: "Solar System AR: exploring the solar system in augmented reality" },
    "project1.problem": {
      fr: "Application mobile pédagogique : un marqueur (une carte du système solaire) fait apparaître les planètes en orbite. Toucher une planète affiche ses données et lance un audio explicatif, et un quiz teste les connaissances.",
      en: "Educational mobile app: a marker (a map of the solar system) makes the planets appear in orbit. Tapping a planet shows its data and plays an audio explanation, and a quiz tests what you learned.",
    },
    "project1.architecture": {
      fr: "Unity + Vuforia pour l'AR, scripts C# modulaires : orbites, placement par tap, détection des touches, gestion du quiz et de l'audio",
      en: "Unity + Vuforia for AR, modular C# scripts: orbits, tap-to-place, touch detection, quiz and audio management",
    },

    "project2.index": { fr: "Vision par ordinateur", en: "Computer vision" },
    "project2.title": { fr: "CountAI : comptage de personnes sur photo par IA locale", en: "CountAI: counting people in photos with local AI" },
    "project2.problem": {
      fr: "Compter des personnes sur une image à la main est lent et sujet à erreur. L'application détecte et compte automatiquement, sans envoyer aucune image sur le cloud.",
      en: "Counting people in an image by hand is slow and error-prone. The app detects and counts automatically, without sending any image to the cloud.",
    },
    "project2.architecture": {
      fr: "YOLOv8 Nano (Ultralytics) exécuté en local derrière une API Flask ; import d'image ou capture webcam, résultat avec niveau de confiance",
      en: "YOLOv8 Nano (Ultralytics) running locally behind a Flask API; image upload or webcam capture, result with a confidence level",
    },

    "project3.index": { fr: "Recherche multimodale", en: "Multimodal search" },
    "project3.title": { fr: "M2 : moteur de scoring multimodal texte + image", en: "M2: multimodal text + image scoring engine" },
    "project3.problem": {
      fr: "Le moteur compare une requête (texte et/ou image) à l'ensemble du catalogue produits et les classe par pertinence, en fusionnant similarité textuelle et similarité visuelle.",
      en: "The engine compares a query (text and/or image) against the whole product catalog and ranks products by relevance, fusing textual and visual similarity.",
    },
    "project3.architecture": {
      fr: "Embeddings texte (USE) et image (Xception), similarité cosinus, fusion pondérée α/β, API REST FastAPI et MongoDB (Beanie)",
      en: "Text (USE) and image (Xception) embeddings, cosine similarity, weighted α/β fusion, FastAPI REST API and MongoDB (Beanie)",
    },

    "project4.index": { fr: "IHM & UX", en: "HCI & UX" },
    "project4.title": { fr: "Compteur de personnes IA : application web mobile-first", en: "AI people counter: mobile-first web app" },
    "project4.problem": {
      fr: "Application « Mobile First » qui compte les personnes sur une photo prise à la caméra ou importée depuis la galerie, et renvoie une brève description de la scène. Le dépôt inclut un rapport de conception (personas, HTA, critères de Bastien et Scapin).",
      en: "Mobile-first app that counts the people in a photo taken with the camera or imported from the gallery, and returns a short description of the scene. The repo includes a design report (personas, HTA, Bastien & Scapin criteria).",
    },
    "project4.architecture": {
      fr: "React 19 et Tailwind CSS ; analyse d'image déléguée au modèle Gemini via le SDK @google/genai",
      en: "React 19 and Tailwind CSS; image analysis delegated to the Gemini model through the @google/genai SDK",
    },

    "more.title": { fr: "Autres travaux", en: "Other work" },
    "more.tp1": {
      fr: "Entraînement d'un modèle MNIST exposé via une API Flask (/predict), avec Dockerfile et suivi MLflow.",
      en: "Training of an MNIST model exposed through a Flask API (/predict), with a Dockerfile and MLflow tracking.",
    },
    "more.all": { fr: "Tous les dépôts ↗", en: "All repositories ↗" },

    "meta.architecture": { fr: "Architecture", en: "Architecture" },
    "meta.stack": { fr: "Stack", en: "Stack" },
    "project.repo": { fr: "Dépôt GitHub ↗", en: "GitHub repo ↗" },
    "project.report": { fr: "Rapport de conception ↗", en: "Design report ↗" },

    "path.title": { fr: "Parcours", en: "Path" },
    "path.subtitle": { fr: "Mobilité encadrée.", en: "Structured mobility." },

    "path1.date": { fr: "Sept 2026 - en cours", en: "Sept 2026 - ongoing" },
    "path1.title": { fr: "Ingénieur en Systèmes Logiciels", en: "Software Systems Engineering" },
    "path1.desc": { fr: "Double diplôme, spécialisation systèmes logiciels.", en: "Dual degree, software systems specialization." },

    "path2.date": { fr: "Sept 2022 - en cours", en: "Sept 2022 - ongoing" },
    "path2.title": { fr: "Ingénieur en Art & Intelligence Artificielle", en: "Art & Artificial Intelligence Engineering" },
    "path2.desc": {
      fr: "4ème au concours national d'entrée (+1500 candidats). ",
      en: "Ranked 4th nationwide at the entrance exam (1,500+ candidates).",
    },

    "skills.title": { fr: "Compétences", en: "Skills" },
    "skills.subtitle": { fr: "Regroupées par famille d'ingénierie.", en: "Grouped by engineering discipline." },
    "skills.group1": { fr: "Programmation", en: "Programming" },
    "skills.group1.item1": { fr: "Python : scikit-learn, NumPy, Pandas, Matplotlib", en: "Python : scikit-learn, NumPy, Pandas, Matplotlib" },
    "skills.group1.item2": { fr: "Java (POO)", en: "Java (OOP)" },
    "skills.group1.item3": { fr: "JavaScript", en: "JavaScript" },
    "skills.group2": { fr: "Mathématiques & IA", en: "Mathematics & AI" },
    "skills.group2.item1": { fr: "Analyse numérique, probabilités, statistique", en: "Numerical analysis, probability, statistics" },
    "skills.group2.item2": { fr: "Optimisation, théorie des graphes", en: "Optimization, graph theory" },
    "skills.group2.item3": { fr: "Deep Learning, agents intelligents", en: "Deep learning, intelligent agents" },
    "skills.group3": { fr: "Données", en: "Data" },
    "skills.group3.item1": { fr: "Modélisation prédictive & régression", en: "Predictive modeling & regression" },
    "skills.group3.item2": { fr: "Power BI, Seaborn", en: "Power BI, Seaborn" },
    "skills.group3.item3": { fr: "OCR, vision par ordinateur", en: "OCR, computer vision" },
    "skills.group4": { fr: "Outils & environnement", en: "Tools & environment" },
    "skills.group4.item1": { fr: "Git, Jupyter, Google Colab, VS Code", en: "Git, Jupyter, Google Colab, VS Code" },
    "skills.group4.item2": { fr: "LaTeX", en: "LaTeX" },
    "skills.group4.item3": { fr: "Figma, Photoshop, Illustrator", en: "Figma, Photoshop, Illustrator" },

    "github.title": { fr: "Activité GitHub", en: "GitHub activity" },
    "github.repos": { fr: "dépôts publics", en: "public repos" },
    "github.stars": { fr: "étoiles cumulées", en: "stars combined" },
    "github.lang": { fr: "langage principal", en: "main language" },

    "contact.title": { fr: "Vous pouvez me contacter.", en: "Feel free to reach out." },
    "contact.copy": { fr: "Copier", en: "Copy" },
    "contact.copied": { fr: "Copié !", en: "Copied!" },
    "contact.cv": { fr: "CV (PDF) ↓", en: "Resume (PDF) ↓" },

    "footer.name": { fr: "Frank KEYANYEM - Toulouse", en: "Frank KEYANYEM - Toulouse" },
  };

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const entry = DICT[key];
      if (entry && entry[lang] !== undefined) el.textContent = entry[lang];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const entry = DICT[key];
      if (entry && entry[lang] !== undefined) el.innerHTML = entry[lang];
      const ariaEntry = DICT[key + ".aria"];
      if (ariaEntry && ariaEntry[lang] !== undefined) el.setAttribute("aria-label", ariaEntry[lang]);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const [attr, key] = el.getAttribute("data-i18n-attr").split(":");
      const entry = DICT[key];
      if (entry && entry[lang] !== undefined) el.setAttribute(attr, entry[lang]);
    });

    document.querySelectorAll(".lang-switch [data-lang-option]").forEach((opt) => {
      opt.classList.toggle("is-current", opt.getAttribute("data-lang-option") === lang);
    });

    try { localStorage.setItem("fk-lang", lang); } catch (e) {}
    window.__fkLang = lang;
    document.dispatchEvent(new CustomEvent("fk:langchange", { detail: { lang } }));
  }

  function initLang() {
    let lang = "fr";
    try { lang = localStorage.getItem("fk-lang") || "fr"; } catch (e) {}
    applyLang(lang);

    document.getElementById("lang-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("lang") === "en" ? "en" : "fr";
      applyLang(current === "fr" ? "en" : "fr");
    });
  }

  window.fkI18n = { applyLang, dict: DICT };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLang);
  } else {
    initLang();
  }
})();
