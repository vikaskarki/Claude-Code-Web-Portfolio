/** Shorthand DOM helpers used by every component. */

/** First element matching `selector` (inside `root`, default: whole page). */
export const $ = (selector, root = document) => root.querySelector(selector);

/** All elements matching `selector`, as a real array. */
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
