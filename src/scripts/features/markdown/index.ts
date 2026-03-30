import { loadDocuments } from "./effects/loadDocuments";
import {
  applyTheme,
  saveThemePreference,
  setupSystemThemeListener,
} from "./effects/theme";
import { createStore, type Store } from "./store";
import { getDOM, type DOM } from "./ui/dom";
import { bindEvents } from "./ui/events";
import { render } from "./ui/render";

export function initMarkdown() {
  const dom = getDOM();
  const store = createMarkdownStore();

  // Subscriptions
  const cleanupSubscribers = registerMarkdownSubscribers(dom, store);

  // UI events
  const cleanupInteractions = registerMarkdownInteractions(dom, store);

  // Environment/effects
  const cleanupThemeListener = setupSystemThemeListener(store);

  // Data bootstrap
  void loadDocuments(store);

  // Cleanup handling
  return () => {
    cleanupSubscribers();
    cleanupInteractions();
    cleanupThemeListener();
  };
}

function createMarkdownStore() {
  return createStore();
}

function registerMarkdownSubscribers(dom: DOM, store: Store) {
  let previousTheme = store.getState().theme;

  let unsubscribes: Array<() => void> = [];

  unsubscribes.push(
    store.subscribe(
      (state) => {
        if (state.theme !== previousTheme) {
          applyTheme(state.theme);
          previousTheme = state.theme;

          if (state.themeSource === "user") saveThemePreference(state.theme);
        }
      },
      { fireImmediately: true },
    ),
  );
  unsubscribes.push(
    store.subscribe(
      (state) => {
        render(state, dom);
      },
      { fireImmediately: true },
    ),
  );

  return () => {
    unsubscribes.forEach((fn) => fn());
  };
}

function registerMarkdownInteractions(dom: DOM, store: Store) {
  const detachEvents = bindEvents(dom, store);

  return () => {
    detachEvents();
  };
}
