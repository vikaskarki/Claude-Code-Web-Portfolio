/** Shared animation settings. */

/** True when the visitor asked their OS for reduced motion. */
export const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Recorder mode: open the site with ?rec=1 to play every scroll-driven
 * animation on a timer — handy for screen-recording the whole page in one take.
 */
export const isRecorderMode = new URLSearchParams(location.search).has('rec');

/** Same curve as --ease-out in styles/base/variables.css */
export const EASE_OUT = 'cubic-bezier(.2,.8,.2,1)';
