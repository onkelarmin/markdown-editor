import { initAnimations } from "@shared/animations";
import { initScroll } from "@shared/scroll";
import { initTheme } from "@shared/theme";
import { initNav } from "@shared/nav";

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  initScroll();
  initTheme();
  initNav();
});
