import { prefersReducedMotion } from './motion.js';

/**
 * Counts a number up from 0.
 * Markup: <span data-count="10" data-count-suffix="+">0</span>
 */
export function animateCounter(element, duration = 1400) {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.countSuffix || '';

  if (prefersReducedMotion) {
    element.textContent = target + suffix;
    return;
  }

  const start = performance.now();
  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
