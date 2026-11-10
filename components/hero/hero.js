/**
 * Hero intro animation (runs once on page load)
 * - Title lines slide up out of their masks
 * - 3D scene fades and scales in
 * - Navbar drops in
 * - Every element marked data-intro rises and fades in, one after another
 * - Featured-project progress line draws in
 * - Hero counters count up
 */
import { $, $$ } from '../../scripts/utils/dom.js';
import { prefersReducedMotion, EASE_OUT } from '../../scripts/utils/motion.js';
import { animateCounter } from '../../scripts/utils/counter.js';

export function initHeroIntro() {
  const hero = $('.hero');
  if (!hero) return;

  const counters = $$('[data-count]', hero);

  if (prefersReducedMotion) {
    counters.forEach((el) => animateCounter(el));
    return;
  }

  const options = (duration, delay = 0) => ({ duration, delay, easing: EASE_OUT, fill: 'backwards' });

  $$('.hero__title-text', hero).forEach((line, i) =>
    line.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], options(1000, 150 + i * 110))
  );

  $('.hero__scene', hero)?.animate(
    [{ opacity: 0, scale: '.92' }, { opacity: 1, scale: '1' }],
    options(1600)
  );

  $('.navbar')?.animate(
    [{ translate: '0 -24px', opacity: 0 }, { translate: '0 0', opacity: 1 }],
    options(800, 100)
  );

  $$('[data-intro]').forEach((el, i) =>
    el.animate([{ translate: '0 14px', opacity: 0 }, { translate: '0 0', opacity: 1 }], options(900, 300 + i * 55))
  );

  $('.featured-project__progress-bar', hero)?.animate(
    [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    options(1400, 900)
  );

  setTimeout(() => counters.forEach((el) => animateCounter(el)), 600);
}
