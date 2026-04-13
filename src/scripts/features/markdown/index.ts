import { loadDocuments } from "./effects/loadDocuments";
import {
  applyTheme,
  saveThemePreference,
  setupSystemThemeListener,
} from "./effects/theme";
import { clearToastTimer, startToastTimer } from "./effects/toast";
import { createStore, type Store } from "./store";
import { getDOM, type DOM } from "./ui/dom";
import { setupDragDrop } from "./ui/dragDrop";
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
  let previousTheme = store.getState().ui.theme;

  let activeToastId: string | null = null;

  let unsubscribes: Array<() => void> = [];

  unsubscribes.push(
    store.subscribe(
      (state) => {
        if (state.ui.theme !== previousTheme) {
          applyTheme(state.ui.theme);
          previousTheme = state.ui.theme;

          if (state.ui.themeSource === "user")
            saveThemePreference(state.ui.theme);
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
  unsubscribes.push(
    store.subscribe(
      (state) => {
        const activeToast = state.ui.toasts[0] ?? null;

        if (!activeToast) {
          clearToastTimer();
          activeToastId = null;
          return;
        }

        if (activeToast.id === activeToastId) return;

        activeToastId = activeToast.id;
        startToastTimer(store, activeToastId);
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
  const destroyDragDrop = setupDragDrop(dom, store);

  return () => {
    detachEvents();
    destroyDragDrop();
  };
}
