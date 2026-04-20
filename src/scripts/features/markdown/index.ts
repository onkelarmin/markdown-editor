import { createNewDocument } from "./effects/createDocument";
import { loadDocuments } from "./effects/loadDocuments";
import {
  applyTheme,
  saveThemePreference,
  setupSystemThemeListener,
} from "./effects/theme";
import { clearToastTimer, startToastTimer } from "./effects/toast";
import { getInitialState } from "./initialState";
import { guestDocumentSchema } from "./schema";
import { selectCanReorderDocuments, selectIsGuest } from "./selectors";
import { createStore, type Store } from "./store";
import type { GuestDocument } from "./types";
import { getDOM, type DOM } from "./ui/dom";
import { setupDragDrop } from "./ui/dragDrop";
import { bindEvents } from "./ui/events";
import { render } from "./ui/render";

function loadGuestDocument(): GuestDocument | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("guest-document");

  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    const result = guestDocumentSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function createGuestDocument(): GuestDocument {
  const now = Date.now();

  return {
    name: "undefined.md",
    content: "",
    createdAt: now,
    modifiedAt: now,
  };
}

async function initAuthenticatedFlow(store: Store) {
  await loadDocuments(store);

  const guestDocument = loadGuestDocument();

  if (!guestDocument || guestDocument.content === "") return;

  store.dispatch({
    type: "document/migrateGuest",
    payload: { document: guestDocument },
  });

  await createNewDocument(store);

  localStorage.removeItem("guest-document");
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
  const destroyDragDrop = selectCanReorderDocuments(store.getState())
    ? setupDragDrop(dom, store)
    : () => {};

  return () => {
    detachEvents();
    destroyDragDrop();
  };
}

export function initMarkdown() {
  const initialState = getInitialState();

  const dom = getDOM();

  const store = createStore(initialState);

  // Subscriptions
  const cleanupSubscribers = registerMarkdownSubscribers(dom, store);

  // UI events
  const cleanupInteractions = registerMarkdownInteractions(dom, store);

  // Environment/effects
  const cleanupThemeListener = setupSystemThemeListener(store);

  // Data bootstrap
  if (selectIsGuest(store.getState())) {
    const guestDocument = loadGuestDocument() ?? createGuestDocument();

    store.dispatch({
      type: "document/setGuest",
      payload: { document: guestDocument },
    });
  } else {
    void initAuthenticatedFlow(store);
  }

  // Cleanup handling
  return () => {
    cleanupSubscribers();
    cleanupInteractions();
    cleanupThemeListener();
  };
}
