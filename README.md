# Bikash Karki — Portfolio

A 3D personal portfolio site with a Ralph Lauren–inspired burgundy and grey palette.

**Live:** https://vikaskarki.github.io/Claude-Code-Web-Portfolio/

Plain HTML, CSS and JavaScript (ES modules), with **no build step**. GitHub Pages serves the files exactly as they are in the repo.

---

## Folder structure

```
portfolio/
├── index.html                    ← all page content, one commented block per section
├── assets/
│   └── icons/favicon.svg
├── styles/
│   └── base/                     ← site-wide styles, loaded first
│       ├── variables.css         ← colours, fonts, sizing unit (edit the palette here)
│       ├── reset.css             ← browser reset, page background, reduced-motion
│       ├── typography.css        ← .text-display, .text-wide
│       ├── buttons.css           ← .btn, .btn--outline
│       └── utilities.css         ← .dot, .glass, .visually-hidden
├── components/                   ← one folder per section of the page
│   ├── header/        header.css                    ← top bar: status text + Contact button
│   ├── navbar/        navbar.css, navbar.js         ← tab bar: Home · Works · About · Contact
│   ├── hero/          hero.css                      ← first screen: title, intro, badge, name plate
│   │                  hero-stats.css                ← "10+ Core skills" and "8+ Projects" cards
│   │                  hero-featured.css             ← "Featured: AI Order Mgmt" card
│   │                  hero.js                       ← load-in animation
│   │                  hero-scene.js                 ← Three.js 3D gyroscope
│   ├── scroll-strip/  scroll-strip.css              ← "EST 2020 · SCROLL DOWN · BASED IN NEPAL"
│   ├── statement/     statement.css, statement.js   ← paragraph that fills in on scroll
│   ├── highlights/    highlights.css, highlights.js ← "Bridging Code, Data…" panel + 3 cards
│   ├── section-heading/ section-heading.css         ← big "WORKS" / "ABOUT" titles (shared)
│   ├── projects/      projects.css, projects.js     ← project cards + 3D tilt
│   ├── about/         about.css                     ← experience, education, toolkit
│   ├── contact/       contact.css                   ← "Let's build something." + buttons
│   └── footer/        footer.css
└── scripts/
    ├── main.js                   ← entry point: starts every component
    └── utils/
        ├── dom.js                ← $ and $$ selector helpers
        ├── motion.js             ← reduced-motion flag, ?rec=1 recorder mode, easing
        └── counter.js            ← count-up number animation
```

## Where do I change…?

| I want to change… | Edit |
|---|---|
| Any text, link or project | `index.html`: each section has a comment banner naming its files |
| Colours or fonts | `styles/base/variables.css` |
| The navbar links | `index.html` → `<nav class="navbar">` (the indicator adjusts by itself) |
| The 3D object (colours, shapes, speed) | `components/hero/hero-scene.js` → the `COLORS` object at the top |
| Add a project | Copy an `<article class="project-card">` (large) or `<a class="project-mini">` (small) in `index.html` |
| The statement paragraph | `index.html` → `.statement__text`; wrap a word in `<strong>` for the wide font |
| A number that counts up | Any element with `data-count="10" data-count-suffix="+"` |

## Conventions

- **Class names use BEM**: `block__element--modifier`, for example `project-card__title` or `navbar__link--active`. Each block's styles live in `components/<block>/`.
- **JavaScript hooks are data attributes**, not classes: `data-intro` (fades in on load), `data-count` (counts up), `data-tilt` (3D tilt on hover).
- **Sizes use the artboard unit**: `calc(var(--u) * 340)` means "340px on a 1440px-wide design". On phones the artboard is 390px wide. See `variables.css`.
- **Each CSS file holds its own phone styles** in a `@media (max-width: 760px)` block at the bottom.
- **The 3D scene loads separately** (`scripts/main.js`), so if the Three.js CDN is down the rest of the site still works.

## Run locally

ES modules need a local server; opening the file directly won't work:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Extras

- `?rec=1` (for example `…/index.html?rec=1`) plays the scroll animations on a timer, for screen recordings.
- The site respects the "reduce motion" setting in the visitor's OS.
