import type { State, Document } from "./types";

export function getInitialState(): State {
  const now = Date.now();

  const documents: Document[] = [];

  const activeDocumentId = null;

  const activeDocument = documents.find(
    (document) => document.id === activeDocumentId,
  );

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
  };
}
