import { initAnimations } from "@shared/animations";
import { initTheme } from "@shared/theme";
import { initNav } from "@/scripts/shared/sidebar";
import { initMarkdown } from "./features/markdown";

document.addEventListener("DOMContentLoaded", () => {
  initMarkdown();
  initAnimations();
  initTheme();
  initNav();
});
