// Imports
import { customProp, cssTime } from "@shared/utils/helper";

export function initMobileNav() {
  // Variables
  const btnToggle = document.querySelector<HTMLButtonElement>(
    "#primary-nav-toggle",
  );
  const primaryNav = document.querySelector<HTMLElement>(".primary-nav");
  const primaryNavMenu =
    primaryNav?.querySelector<HTMLElement>("#primary-nav-menu");
  const primaryNavLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".nav-link"),
  );

  const mobileNavOverlay = document.querySelector<HTMLDivElement>(
    "#mobile-nav-overlay",
  );
  const main = document.querySelector<HTMLElement>("main");

  if (
    !btnToggle ||
    !primaryNav ||
    !primaryNavMenu ||
    primaryNavLinks.length === 0 ||
    !main
  )
    return;

  const media = window.matchMedia(`(width < ${customProp("--bp-large")})`);

  function isOpen() {
    return btnToggle?.getAttribute("aria-expanded") === "true";
  }

  const setupPrimaryNav = (isMobile: boolean) => {
    if (isMobile) {
      // is mobile
      primaryNavMenu.setAttribute("inert", "");
      primaryNavMenu.style.transition = "none";
      primaryNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });
    } else {
      // is tablet/desktop
      primaryNavMenu?.removeAttribute("inert");
    }
  };

  const openMobileMenu = () => {
    btnToggle.setAttribute("aria-expanded", "true");
    primaryNavMenu.setAttribute("data-open", "true");
    primaryNavMenu.removeAttribute("inert");
    primaryNavMenu.removeAttribute("style");
    main.setAttribute("inert", "");
    document.addEventListener("keydown", onEscape);
  };

  const closeMobileMenu = () => {
    btnToggle.setAttribute("aria-expanded", "false");
    primaryNavMenu.setAttribute("data-open", "false");
    primaryNavMenu.setAttribute("inert", "");
    main?.removeAttribute("inert");
    document.removeEventListener("keydown", onEscape);

    setTimeout(
      () => {
        primaryNavMenu.style.transition = "none";
      },
      cssTime("--motion-slow") * 1000,
    );
  };

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeMobileMenu();
  };

  // EventListeners
  btnToggle.addEventListener("click", () => {
    isOpen() ? closeMobileMenu() : openMobileMenu();
  });

  mobileNavOverlay?.addEventListener("click", closeMobileMenu);

  media.addEventListener("change", (e) => {
    setupPrimaryNav(e.matches);
  });

  setupPrimaryNav(media.matches);
}
