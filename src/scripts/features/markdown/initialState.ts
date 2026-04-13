import { isTheme, themeStorageKey, type Theme } from "./lib/constants";
import type { State, Document, ThemeSource } from "./types";

export function getInitialState(): State {
  const documents: Document[] = [];

  const activeDocumentId = null;

  const activeDocument = documents.find(
    (document) => document.id === activeDocumentId,
  );

  let theme: Theme = "light";

  const dataTheme = document.documentElement.dataset.theme;
  if (dataTheme && isTheme(dataTheme)) theme = dataTheme;

  return {
    auth: {
      status: "guest",
      userId: null,
    },
    documents,
    activeDocumentId,
    ui: {
      sidebarOpen: false,
      view: "markdown",
      isDeleteModalOpen: false,
      theme: theme,
      themeSource: localStorage.getItem(themeStorageKey) ? "user" : "system",
      toasts: [],
    },
    editor: {
      nameDraft: activeDocument?.name ?? "",
      nameError: null,
    },
    requests: {
      load: {
        status: "pending",
        message: null,
      },
      save: {
        status: "idle",
      },
      delete: {
        status: "idle",
      },
    },
  };
}
