import { themeStorageKey, type Theme } from "../lib/constants";
import type { Store } from "../store";

export function applyTheme(theme: Theme) {
  if (!document.startViewTransition) {
    document.documentElement.dataset.theme = theme;
  }

  document.startViewTransition(() => {
    document.documentElement.dataset.theme = theme;
  });
}

export function saveThemePreference(theme: Theme) {
  localStorage.setItem(themeStorageKey, theme);
}

export function setupSystemThemeListener(store: Store) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) => {
    const state = store.getState();

    if (state.themeSource !== "system") return;

    store.dispatch({
      type: "theme/set",
      payload: { theme: e.matches ? "dark" : "light", themeSource: "system" },
    });
  };

  media.addEventListener("change", handleChange);

  return () => media.removeEventListener("change", handleChange);
}
