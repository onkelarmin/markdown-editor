import type { Action, Document, State } from "./types";
import { getNewDocumentName } from "./utils";

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

    // Select document
    case "document/select": {
      if (
        !state.documents.some((document) => document.id === action.payload.id)
      )
        return state;

      return { ...state, activeDocumentId: action.payload.id };
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
