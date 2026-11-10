# Bikash Karki — Portfolio

A 3D personal portfolio site with a Ralph Lauren–inspired burgundy and grey palette.

**Live:** https://vikaskarki.github.io/Claude-Code-Web-Portfolio/

## Stack
- Plain HTML, CSS and vanilla JavaScript in a single `index.html`, with no build step
- [Three.js](https://threejs.org/) (via CDN) for the interactive brass gyroscope in the hero
- Inter Tight and Archivo from Google Fonts

## Features
- A 3D hero object that reacts to the mouse and to scrolling
- A statement section whose words fill in as you scroll
- Animated counters, 3D tilt project cards and a sliding nav pill
- Responsive phone layout, plus a `prefers-reduced-motion` fallback
- `?rec=1` recorder mode, which plays the scroll animations on a timer

## Run locally
```bash
python -m http.server 5173
```
Then open http://localhost:5173.