import type { Action, Document, State } from "./types";
import { getNewDocumentName } from "./lib/getNewDocumentName";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Create document
    case "document/create": {
      const now = Date.now();

      const names = state.documents.map((document) => document.name);
      const newName = getNewDocumentName(names);

      const document: Document = {
        id: crypto.randomUUID(),
        name: newName,
        content: "",
        createdAt: now,
        modifiedAt: now,
      };

      return {
        ...state,
        documents: [...state.documents, document],
        activeDocumentId: document.id,
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
            ? { ...document, name: action.payload.name }
            : document,
        ),
        nameDraft: action.payload.name,
        nameError: null,
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

    // set View
    case "view/set": {
      if (state.view === action.payload.view) return state;

      return { ...state, view: action.payload.view };
    }
    default:
      return state;
  }
}
