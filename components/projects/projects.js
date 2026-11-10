/**
 * Projects
 * Tilts each large project card in 3D toward the mouse and moves the soft
 * glow to follow the cursor. Only on devices with a real mouse.
 */
import { $$ } from '../../scripts/utils/dom.js';
import { prefersReducedMotion } from '../../scripts/utils/motion.js';

const MAX_TILT_DEGREES = 5;

export function initProjects() {
  if (prefersReducedMotion || !matchMedia('(hover: hover)').matches) return;

  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;  // 0 → 1
      const y = (event.clientY - rect.top) / rect.height;  // 0 → 1

      card.style.transform =
        `rotateY(${(x - 0.5) * MAX_TILT_DEGREES * 2}deg) rotateX(${(0.5 - y) * MAX_TILT_DEGREES * 2}deg)`;
      card.style.setProperty('--glow-x', `${x * 100}%`);
      card.style.setProperty('--glow-y', `${y * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
