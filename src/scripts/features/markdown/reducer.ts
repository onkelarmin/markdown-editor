import type { Action, Document, State } from "./types";
import { getNewDocumentName } from "./lib/getNewDocumentName";

function createEmptyDocument(documents?: Document[]): Document {
  const now = Date.now();

  let names: string[] = [];

  if (documents) names = documents.map((document) => document.name);

  const newName = getNewDocumentName(names);

  return {
    id: crypto.randomUUID(),
    name: newName,
    content: "",
    createdAt: now,
    modifiedAt: now,
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Create document
    case "document/create": {
      const document = createEmptyDocument(state.documents);

      return {
        ...state,
        documents: [...state.documents, document],
        activeDocumentId: document.id,
        nameDraft: document.name,
        nameError: null,
      };
    }

    // Update document name
    case "document/updateNameDraft": {
      return {
        ...state,
        nameDraft: action.payload.name,
        nameError: action.payload.error ? action.payload.error : null,
      };
    }

    case "document/updateName": {
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === state.activeDocumentId
            ? { ...document, name: action.payload.name, modifiedAt: Date.now() }
            : document,
        ),
        nameDraft: action.payload.name,
        nameError: null,
      };
    }

    // Update document content
    case "document/updateContent": {
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === state.activeDocumentId
            ? {
                ...document,
                content: action.payload.content,
                modifiedAt: Date.now(),
              }
            : document,
        ),
      };
    }

    // Select document
    case "document/select": {
      const id = action.payload.id;

      const selected = state.documents.find((document) => document.id === id);

      if (!selected) return state;

      return {
        ...state,
        activeDocumentId: id,
        nameDraft: selected.name,
        nameError: null,
      };
    }

    // Open delete modal
    case "modal/openDelete": {
      return { ...state, isDeleteModalOpen: true };
    }

    // Close delete modal
    case "modal/closeDelete": {
      return { ...state, isDeleteModalOpen: false };
    }

    // Delete document
    case "document/delete": {
      const id = action.payload.id;
      const toBeDeleted = state.documents.find(
        (document) => document.id === id,
      );

      if (!toBeDeleted) return { ...state, isDeleteModalOpen: false };

      if (state.documents.length === 1) {
        const document = createEmptyDocument();

        return {
          ...state,
          documents: [document],
          activeDocumentId: document.id,
          isDeleteModalOpen: false,
          nameDraft: document.name,
          nameError: null,
        };
      }

      const index = state.documents.indexOf(toBeDeleted);

      const newIndex = index === 0 ? 1 : index - 1;
      const newId = state.documents[newIndex].id;

      return {
        ...state,
        documents: state.documents.filter(
          (document) => document !== toBeDeleted,
        ),
        activeDocumentId: newId,
        isDeleteModalOpen: false,
        nameDraft: state.documents[newIndex].name,
      };
    }

    // set View
    case "view/set": {
      if (state.view === action.payload.view) return state;

      return { ...state, view: action.payload.view };
    }
    default:
      return state;
  }
}
