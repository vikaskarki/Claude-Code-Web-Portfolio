/**
 * Statement
 * Wraps every word of the statement paragraph in a span, then fills the
 * words from grey to ivory in reading order as the section scrolls into view
 * (with a soft 3-word edge).
 */
import { $, $$ } from '../../scripts/utils/dom.js';
import { prefersReducedMotion, isRecorderMode } from '../../scripts/utils/motion.js';

const FROM_RGB = [0x5A, 0x5A, 0x5F]; // --color-grey-dark
const TO_RGB = [0xF2, 0xEF, 0xEA];   // --color-ivory
const SOFT_EDGE_WORDS = 3;

/** Turn the paragraph's text into one <span> per word, keeping <br> and <strong>. */
function splitIntoWords(paragraph) {
  const fragment = document.createDocumentFragment();

  const addWords = (text, isKey) => {
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(' ');
        return;
      }
      const span = document.createElement('span');
      span.className = isKey ? 'statement__word statement__word--key' : 'statement__word';
      span.textContent = part;
      fragment.append(span);
    });
  };

  paragraph.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) addWords(node.textContent, false);
    else if (node.nodeName === 'STRONG') addWords(node.textContent, true);
    else fragment.append(node.cloneNode(true)); // <br>
  });

  paragraph.replaceChildren(fragment);
  return $$('.statement__word', paragraph);
}

export function initStatement() {
  const section = $('.statement');
  const paragraph = $('.statement__text', section);
  if (!paragraph) return;

  const words = splitIntoWords(paragraph);

  /** progress: 0 = all grey, 1 = all ivory */
  function fill(progress) {
    const position = progress * (words.length + SOFT_EDGE_WORDS);
    words.forEach((word, index) => {
      const t = Math.max(0, Math.min(1, (position - index) / SOFT_EDGE_WORDS));
      const rgb = FROM_RGB.map((from, i) => Math.round(from + (TO_RGB[i] - from) * t));
      word.style.color = `rgb(${rgb.join(',')})`;
    });
  }

  if (prefersReducedMotion) {
    fill(1);
    return;
  }

  // Recorder mode (?rec=1): fill on a timer instead of on scroll
  if (isRecorderMode) {
    const start = performance.now();
    const tick = (now) => {
      const seconds = (now - start) / 1000;
      fill(Math.max(0, Math.min(1, (seconds - 1.3) / 2.9)));
      if (seconds < 4.5) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return;
  }

  const onScroll = () => {
    const rect = section.getBoundingClientRect();
    const progress = (window.innerHeight * 0.85 - rect.top) / (rect.height * 0.75);
    fill(Math.max(0, Math.min(1, progress)));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
