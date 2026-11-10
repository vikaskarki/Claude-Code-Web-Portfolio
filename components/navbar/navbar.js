/**
 * Navbar
 * - Slides the dark indicator pill under the hovered link.
 * - Returns it to the active link when the mouse leaves.
 * - Updates the active link as you scroll through the sections.
 */
import { $, $$ } from '../../scripts/utils/dom.js';

const ACTIVE_CLASS = 'navbar__link--active';

export function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const indicator = $('.navbar__indicator', navbar);
  const links = $$('.navbar__link', navbar);
  let activeLink = links[0];

  function moveIndicatorTo(link) {
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    links.forEach((l) => l.classList.toggle(ACTIVE_CLASS, l === link));
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => moveIndicatorTo(link));
    link.addEventListener('click', () => {
      activeLink = link;
      moveIndicatorTo(link);
    });
  });

  navbar.addEventListener('mouseleave', () => moveIndicatorTo(activeLink));
  window.addEventListener('resize', () => moveIndicatorTo(activeLink));
  document.fonts.ready.then(() => moveIndicatorTo(activeLink)); // widths change once fonts load
  moveIndicatorTo(activeLink);

  // Highlight the link of the section currently in the middle of the screen
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activeLink = links.find((l) => l.getAttribute('href') === `#${entry.target.id}`);
        if (activeLink && !navbar.matches(':hover')) moveIndicatorTo(activeLink);
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}
