import { isTheme, themeStorageKey, type Theme } from "./lib/constants";
import type { State, Document, ThemeSource } from "./types";

export function getInitialState(): State {
  const now = Date.now();

  const documents: Document[] = [];

  const activeDocumentId = null;

  const activeDocument = documents.find(
    (document) => document.id === activeDocumentId,
  );

  let theme: Theme = "light";

  const dataTheme = document.documentElement.dataset.theme;
  if (dataTheme && isTheme(dataTheme)) theme = dataTheme;

  return {
    documents,
    activeDocumentId,
    nameDraft: activeDocument?.name ?? "",
    nameError: null,
    view: "markdown",
    sidebarOpen: false,
    isDeleteModalOpen: false,
    isLoading: false,
    errorMessage: null,
    saveStatus: "idle",
    theme: theme,
    themeSource: localStorage.getItem(themeStorageKey) ? "user" : "system",
  };
}
