import type { State } from "./types";

export function selectIsAuthenticated(state: State) {
  return state.auth.status === "authenticated";
}

export function selectIsGuest(state: State) {
  return state.auth.status === "guest";
}

export function selectActiveDocument(state: State) {
  return (
    state.documents.find(
      (document) => document.id === state.activeDocumentId,
    ) ?? null
  );
}

export function selectHasDocuments(state: State) {
  return state.documents.length > 0;
}

export function selectSidebarOpen(state: State) {
  return state.ui.sidebarOpen;
}

export function selectActiveToast(state: State) {
  return state.ui.toasts[0] ?? null;
}

export function selectDisableEditor(state: State) {
  const isLoadingDocuments = state.requests.load.status === "pending";
  const isDeletingDocument = state.requests.delete.status === "pending";
  const hasActiveDocument = state.activeDocumentId !== null;

  return isLoadingDocuments || isDeletingDocument || !hasActiveDocument;
}
