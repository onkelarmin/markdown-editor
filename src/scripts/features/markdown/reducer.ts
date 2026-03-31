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
    // Load documents
    case "documents/loadStart": {
      return { ...state, isLoading: true, errorMessage: null };
    }
    case "documents/loadError": {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.message,
      };
    }
    case "documents/loadSuccess": {
      const activeDocument = action.payload.documents.find(
        (document) => document.id === state.activeDocumentId,
      );

      if (activeDocument) {
        return {
          ...state,
          documents: action.payload.documents,
          activeDocumentId: state.activeDocumentId,
          nameDraft: activeDocument.name,
          isLoading: false,
          errorMessage: null,
        };
      } else if (action.payload.documents.length > 0) {
        return {
          ...state,
          documents: action.payload.documents,
          activeDocumentId: action.payload.documents[0].id,
          nameDraft: action.payload.documents[0].name,
          isLoading: false,
          errorMessage: null,
        };
      } else {
        return {
          ...state,
          documents: [],
          activeDocumentId: null,
          nameDraft: "",
          isLoading: false,
          errorMessage: null,
        };
      }
    }

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
      const names = state.documents
        .filter((document) => document.id !== state.activeDocumentId)
        .map((document) => document.name);

      if (names.includes(action.payload.name))
        return { ...state, nameError: "Document name already exists" };

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

    // Save document
    case "document/saveStart": {
      return { ...state, saveStatus: "saving" };
    }
    case "document/saveSuccess": {
      return { ...state, saveStatus: "saved" };
    }
    case "document/saveReset": {
      return { ...state, saveStatus: "idle" };
    }
    case "document/saveError": {
      return { ...state, saveStatus: "error" };
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

    // Open delete modal
    case "modal/openDelete": {
      return { ...state, isDeleteModalOpen: true };
    }

    // Close delete modal
    case "modal/closeDelete": {
      return { ...state, isDeleteModalOpen: false };
    }

    // Sidebar
    case "sidebar/open": {
      return { ...state, sidebarOpen: true };
    }
    case "sidebar/close": {
      return { ...state, sidebarOpen: false };
    }

    // set View
    case "view/set": {
      if (state.view === action.payload.view) return state;

      return { ...state, view: action.payload.view };
    }

    // Themes
    case "theme/toggle": {
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
        themeSource: "user",
      };
    }

    case "theme/set": {
      return {
        ...state,
        theme: action.payload.theme,
        themeSource: action.payload.themeSource,
      };
    }

    case "toast/enqueue": {
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: action.payload.id,
            message: action.payload.message,
            variant: action.payload.variant,
          },
        ],
      };
    }

    case "toast/dismiss": {
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast?.id !== action.payload.id),
      };
    }

    default:
      return state;
  }
}
