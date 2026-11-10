/**
 * Highlights
 * When the panel scrolls into view: count up the numbers and pop in the
 * skill chips one after another.
 */
import { $, $$ } from '../../scripts/utils/dom.js';
import { prefersReducedMotion, isRecorderMode } from '../../scripts/utils/motion.js';
import { animateCounter } from '../../scripts/utils/counter.js';

export function initHighlights() {
  const section = $('.highlights');
  if (!section) return;

  let hasPlayed = false;

  function reveal() {
    if (hasPlayed) return;
    hasPlayed = true;

    $$('[data-count]', section).forEach((el) => animateCounter(el));

    if (prefersReducedMotion) return;
    $$('.skill-chips__chip', section).forEach((chip, index) => {
      chip.animate(
        [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 600, delay: index * 70, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' }
      );
    });
  }

  // Recorder mode (?rec=1): play on a timer instead of on scroll
  if (isRecorderMode) {
    setTimeout(reveal, 3500);
    setTimeout(() => $('.highlight-card--experience', section)?.classList.add('is-lifted'), 5300);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        reveal();
        observer.disconnect();
      }
    },
    { rootMargin: '0px 0px -20% 0px' }
  );
  observer.observe(section);
}
