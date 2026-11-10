/**
 * Entry point — starts every interactive component on the page.
 * Each component lives in its own folder under /components.
 */
import { initNavbar } from '../components/navbar/navbar.js';
import { initHeroIntro } from '../components/hero/hero.js';
import { initStatement } from '../components/statement/statement.js';
import { initHighlights } from '../components/highlights/highlights.js';
import { initProjects } from '../components/projects/projects.js';

initNavbar();
initHeroIntro();
initStatement();
initHighlights();
initProjects();

// The 3D scene is loaded separately so that if the Three.js CDN is slow or
// blocked, the rest of the page still works — the canvas is simply removed.
const sceneCanvas = document.querySelector('.hero__scene');
if (sceneCanvas) {
  import('../components/hero/hero-scene.js')
    .then(({ initHeroScene }) => initHeroScene(sceneCanvas))
    .catch((error) => {
      console.warn('3D scene unavailable:', error);
      sceneCanvas.remove();
    });
}
