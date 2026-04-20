import type { State } from "./types";

// Auth

export function selectIsGuest(state: State) {
  return state.auth.status === "guest";
}

export function selectIsLoadingAuth(state: State) {
  return state.auth.status === "loading";
}

export function selectIsAuthenticated(state: State) {
  return state.auth.status === "authenticated";
}

export function selectCanManageDocuments(state: State) {
  return state.auth.status === "authenticated";
}

export function selectCanCreateDocuments(state: State) {
  return selectCanManageDocuments(state);
}

export function selectCanDeleteDocuments(state: State) {
  return selectCanManageDocuments(state);
}

export function selectCanRenameDocuments(state: State) {
  return selectCanManageDocuments(state);
}

export function selectCanReorderDocuments(state: State) {
  return selectCanManageDocuments(state);
}

export function selectCanPersistDocuments(state: State) {
  return selectCanManageDocuments(state);
}

// Domain

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

export function selectDisableEditor(state: State) {
  const isLoadingDocuments = state.requests.load.status === "pending";
  const isDeletingDocument = state.requests.delete.status === "pending";
  const hasActiveDocument = state.activeDocumentId !== null;

  return isLoadingDocuments || isDeletingDocument || !hasActiveDocument;
}

// UI

export function selectSidebarOpen(state: State) {
  return state.ui.sidebarOpen;
}

export function selectActiveToast(state: State) {
  return state.ui.toasts[0] ?? null;
}

export function selectDeleteModalOpen(state: State) {
  return state.ui.isDeleteModalOpen;
}

export function selectSignInModalOpen(state: State) {
  return state.ui.signInModal.step !== "closed";
}

export function selectHasSignInInputError(state: State) {
  return state.ui.signInModal.inputError !== null;
}

export function selectHasSignInProcessError(state: State) {
  return state.ui.signInModal.processError !== null;
}
