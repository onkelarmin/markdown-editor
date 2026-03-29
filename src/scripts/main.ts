import { initTheme } from "@shared/theme";
import { initMarkdown } from "./features/markdown";

document.addEventListener("DOMContentLoaded", () => {
  initMarkdown();
  initTheme();
});
