import type { State } from "./types";

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
