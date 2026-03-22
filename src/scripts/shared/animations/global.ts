import { cssTime } from "@shared/utils/helper";
import { gsap } from "./gsap";
import { ScrollTrigger } from "./gsap";

// Refresh ScrollTrigger on resize
let resizeTimeout: number;

export function initScrollTriggerRefresh() {
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });
}

// Durations
export const DURATIONS = {
  xFast: cssTime("--motion-x-fast"),
  fast: cssTime("--motion-fast"),
  default: cssTime("--motion-default"),
  slow: cssTime("--motion-slow"),
  xSlow: cssTime("--motion-x-slow"),
};

// Defaults
export function initGsapDefaults() {
  gsap.defaults({
    duration: DURATIONS.slow,
    ease: "power2.out",
  });
}
