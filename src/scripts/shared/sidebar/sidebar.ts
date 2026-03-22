// Imports
import { customProp, cssTime } from "@shared/utils/helper";
import { DURATIONS } from "../animations/global";

export function initSidebar() {
  // Variables
  const btnToggle =
    document.querySelector<HTMLButtonElement>("#sidebar-toggle");
  const appLayout = document.querySelector<HTMLElement>("#app-layout");
  const sidebar = document.querySelector<HTMLElement>("#sidebar");
  const deleteButton =
    document.querySelector<HTMLButtonElement>("#delete-button");
  const saveChangesButton = document.querySelector<HTMLButtonElement>(
    "#save-changes-button",
  );

  if (
    !btnToggle ||
    !appLayout ||
    !sidebar ||
    !deleteButton ||
    !saveChangesButton
  )
    return;

  function isOpen() {
    return btnToggle?.getAttribute("aria-expanded") === "true";
  }

  const openMobileMenu = () => {
    btnToggle.setAttribute("aria-expanded", "true");
    appLayout.setAttribute("data-open", "true");
    appLayout.removeAttribute("style");
    sidebar.removeAttribute("inert");
    deleteButton.tabIndex = -1;
    saveChangesButton.tabIndex = -1;
    document.addEventListener("keydown", onEscape);
  };

  const closeMobileMenu = () => {
    btnToggle.setAttribute("aria-expanded", "false");
    appLayout.setAttribute("data-open", "false");
    sidebar.setAttribute("inert", "");
    deleteButton.tabIndex = 0;
    saveChangesButton.tabIndex = 0;
    document.removeEventListener("keydown", onEscape);

    setTimeout(() => {
      appLayout.style.transition = "none";
    }, DURATIONS.default * 1000);
  };

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeMobileMenu();
  };

  // EventListeners
  btnToggle.addEventListener("click", () => {
    isOpen() ? closeMobileMenu() : openMobileMenu();
  });
}
