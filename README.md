# Portfolio — Frank Kenne Keyanyem

Site statique (HTML / CSS / JS vanilla), sans étape de build, prêt à héberger sur
GitHub Pages avec un nom de domaine personnalisé.

## Structure

```
.
├── index.html
├── css/style.css
├── js/main.js
├── js/field.js        (fond animé : réseau de points en profondeur)
├── js/i18n.js
├── js/theme.js
├── assets/CV_Frank_Kenne_Keyanyem.pdf
├── assets/logos/enspy.jpg
├── assets/logos/inp-toulouse.png
└── CNAME              (à créer, voir ci-dessous)
```

## Déploiement sur GitHub Pages

1. Crée un dépôt GitHub (par ex. `cskef/portfolio` ou `cskef.github.io` pour un
   sous-domaine direct) et pousse ces fichiers sur la branche `main`.
2. Dans **Settings → Pages**, choisis la branche `main` et le dossier `/root`.
3. Attends la première publication (quelques minutes) — l'URL `https://cskef.github.io/...`
   devient active.

## Nom de domaine personnalisé

1. Chez ton registrar, crée un enregistrement **CNAME** (sous-domaine, ex. `www`) ou
   des enregistrements **A** (domaine racine) pointant vers les IP GitHub Pages :
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
2. Ajoute un fichier `CNAME` à la racine du dépôt contenant uniquement ton domaine,
   par exemple :
   ```
   frankkenne.dev
   ```
3. Dans **Settings → Pages → Custom domain**, saisis le même domaine puis active
   **Enforce HTTPS** une fois le certificat généré.

## Mode clair / sombre & bilingue FR/EN

- Le bouton rond dans la barre de navigation bascule entre thème sombre et clair
  (`js/theme.js`), avec persistance dans `localStorage` et détection de la
  préférence système au premier chargement.
- Le sélecteur `FR / EN` bascule l'intégralité des textes du site
  (`js/i18n.js`), lui aussi persistant. Le dictionnaire de traduction est
  centralisé en tête de `js/i18n.js` — pour ajouter une langue ou corriger un
  texte, il suffit d'éditer les entrées `fr` / `en` de l'objet `DICT`.
- Un script inline dans `<head>` applique thème et langue mémorisés avant le
  premier rendu, pour éviter tout flash de contenu non stylé ou mal traduit.

## Curseur contextuel & figures

- Toute zone portant l'attribut `data-cursor-shape="..."` transforme le curseur en
  forme dédiée au survol : `planet`, `crowd`, `search`, `ui` (projets), `enspy`, `inp` (parcours).
  Les formes sont définies dans le bloc `<div class="cursor">` en haut de `index.html`
  et stylées dans `css/style.css` (section « forme contextuelle »).
- **Logos** : `assets/logos/enspy.jpg` et `assets/logos/inp-toulouse.png` (logos officiels,
  redimensionnés). Pour les changer, remplace les fichiers en gardant les mêmes noms
  ou mets à jour les `src` dans le bloc `.cursor` de `index.html`. Ils s'affichent sur fond blanc.
- Les figures à droite (projets, parcours, contact) n'apparaissent qu'à partir de
  1100 px de large ; en dessous, la mise en page reste inchangée. Les couleurs
  suivent le thème via `--figure-line` et `--accent`.
- Curseur, tilt et effets magnétiques sont désactivés sur écrans tactiles.

## Mettre à jour le contenu

- **Projets** : édite directement les blocs `<article class="project-card">` dans
  `index.html` (textes FR/EN dans `js/i18n.js`, clés `project1` à `project4`). Les liens
  pointent vers les dépôts `github.com/cskef/...`.
- **CV** : remplace `assets/CV_Frank_Kenne_Keyanyem.pdf` par la version à jour en
  conservant le même nom de fichier.
- **Statistiques GitHub** : récupérées côté client depuis l'API publique GitHub
  (`api.github.com/users/cskef/repos`) ; en cas de limite de débit atteinte,
  des valeurs de repli s'affichent automatiquement (voir `FALLBACK` dans `js/main.js`).

## Accessibilité & performance

- Contrastes conformes WCAG AA, focus clavier visible, `prefers-reduced-motion`
  respecté (animations désactivées si l'utilisateur le demande côté système).
- Curseur personnalisé et effets magnétiques désactivés automatiquement sur
  écrans tactiles.
- Aucune dépendance de build : les polices (Cabinet Grotesk / Switzer via
  Fontshare) et les bibliothèques d'animation (GSAP, Lenis) sont chargées par CDN.
