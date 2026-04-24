import type { Action, Document, PersistStatus, State } from "./types";
import { getNewDocumentName } from "./lib/getNewDocumentName";

function createEmptyDocument(
  name: string,
  order: number,
  persistStatus: PersistStatus,
): Document {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    name,
    content: "",
    order,
    createdAt: now,
    modifiedAt: now,
    persistStatus,
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Set input error
    case "auth/setInputError": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: action.payload.message,
            processError: null,
            status: "error",
          },
        },
      };
    }

    // Clear input error
    case "auth/clearInputError": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            status: "idle",
          },
        },
      };
    }

    // Set process error
    case "auth/setProcessError": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: action.payload.message,
            status: "error",
          },
        },
      };
    }

    // Send OTP code
    case "auth/sendCodeStart": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: null,
            status: "sending",
          },
        },
      };
    }

    case "auth/sendCodeSuccess": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            step: "otp",
            email: action.payload.email,
            inputError: null,
            processError: null,
            status: "idle",
          },
        },
      };
    }

    // Verify OTP code
    case "auth/verifyCodeStart": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: null,
            status: "verifying",
          },
        },
      };
    }

    case "auth/verifyCodeSuccess": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            step: "closed",
            inputError: null,
            processError: null,
            status: "idle",
          },
        },
      };
    }

    // Resend code
    case "auth/resendCodeStart": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: null,
            resendStatus: "sending",
          },
        },
      };
    }

    case "auth/resendCodeError": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: action.payload.message,
            resendStatus: "idle",
          },
        },
      };
    }

    case "auth/resendCodeSuccess": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            inputError: null,
            processError: null,
            resendStatus: "success",
          },
        },
      };
    }

    case "auth/resendCodeReset": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            resendStatus: "idle",
          },
        },
      };
    }

    // Change email
    case "auth/changeEmail": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            step: "email",
            email: "",
            inputError: null,
            processError: null,
            status: "idle",
            resendStatus: "idle",
          },
        },
      };
    }

    // Load documents
    case "documents/loadStart": {
      return {
        ...state,
        requests: {
          ...state.requests,
          load: { status: "pending", message: null },
        },
      };
    }

    case "documents/loadError": {
      return {
        ...state,
        requests: {
          ...state.requests,
          load: { status: "error", message: action.payload.message },
        },
      };
    }

    case "documents/loadSuccess": {
      const documents = action.payload.documents;

      const activeDocument =
        documents.find((document) => document.id === state.activeDocumentId) ??
        documents[0] ??
        null;

      return {
        ...state,
        documents,
        activeDocumentId: activeDocument?.id ?? null,
        editor: {
          ...state.editor,
          nameDraft: activeDocument?.name ?? "",
          nameError: null,
        },
        requests: {
          ...state.requests,
          load: { status: "success", message: null },
        },
      };
    }

    // Create document
    case "document/createOptimistic": {
      const newName = getNewDocumentName(
        state.documents.map((document) => document.name),
      );

      const newOrder = state.documents.length + 1;

      const document = createEmptyDocument(newName, newOrder, "creating");

      return {
        ...state,
        documents: [...state.documents, document],
        activeDocumentId: document.id,
        editor: { ...state.editor, nameDraft: document.name, nameError: null },
      };
    }

    case "document/createSuccess": {
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === action.payload.id
            ? { ...document, persistStatus: "created" }
            : document,
        ),
      };
    }

    case "document/createError": {
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === action.payload.id
            ? { ...document, persistStatus: "error" }
            : document,
        ),
      };
    }

    // Update document name
    case "document/updateNameDraft": {
      return {
        ...state,
        editor: {
          ...state.editor,
          nameDraft: action.payload.name,
          nameError: action.payload.error ? action.payload.error : null,
        },
      };
    }

    case "document/commitName": {
      const names = state.documents
        .filter((document) => document.id !== state.activeDocumentId)
        .map((document) => document.name);

      if (names.includes(action.payload.name))
        return {
          ...state,
          editor: {
            ...state.editor,
            nameError: "Document name already exists",
          },
        };

      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === state.activeDocumentId
            ? { ...document, name: action.payload.name, modifiedAt: Date.now() }
            : document,
        ),
        editor: {
          ...state.editor,
          nameDraft: action.payload.name,
          nameError: null,
        },
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
        requests: { ...state.requests, save: { status: "dirty" } },
      };
    }

    // Save document
    case "document/saveStart": {
      return {
        ...state,
        requests: { ...state.requests, save: { status: "pending" } },
      };
    }

    case "document/saveSuccess": {
      return {
        ...state,
        requests: { ...state.requests, save: { status: "success" } },
      };
    }

    case "document/saveReset": {
      return {
        ...state,
        requests: { ...state.requests, save: { status: "idle" } },
      };
    }

    case "document/saveError": {
      return {
        ...state,
        requests: { ...state.requests, save: { status: "error" } },
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
        editor: { ...state.editor, nameDraft: selected.name, nameError: null },
      };
    }

    // Delete document
    case "document/deleteOptimistic": {
      const toBeDeleted = state.documents.find(
        (document) => document.id === action.payload.id,
      );

      if (!toBeDeleted)
        return { ...state, ui: { ...state.ui, isDeleteModalOpen: false } };

      if (state.documents.length === 1) {
        return {
          ...state,
          documents: [],
          activeDocumentId: null,
          editor: { ...state.editor, nameDraft: "" },
          requests: { ...state.requests, delete: { status: "pending" } },
        };
      }

      const index = state.documents.indexOf(toBeDeleted);

      const newIndex = index === 0 ? 1 : index - 1;

      const newActiveId = state.documents[newIndex].id;

      return {
        ...state,
        documents: state.documents
          .filter((document) => document !== toBeDeleted)
          .map((document, index) => ({ ...document, order: index + 1 })),
        activeDocumentId: newActiveId,
        editor: { ...state.editor, nameDraft: state.documents[newIndex].name },
        requests: { ...state.requests, delete: { status: "pending" } },
      };
    }

    case "document/deleteSuccess": {
      if (action.payload.result.fallbackDocument) {
        const fallback = action.payload.result.fallbackDocument;

        return {
          ...state,
          documents: [{ ...fallback, persistStatus: "created" }],
          activeDocumentId: fallback.id,
          editor: { nameDraft: fallback.name, nameError: null },
          requests: { ...state.requests, delete: { status: "idle" } },
        };
      }

      return {
        ...state,
        requests: { ...state.requests, delete: { status: "idle" } },
      };
    }

    case "document/deleteError": {
      return {
        ...state,
        requests: { ...state.requests, delete: { status: "idle" } },
      };
    }

    // Set guest document
    case "document/setGuest": {
      const guestDocument = {
        id: "guest-document",
        name: action.payload.document.name,
        content: action.payload.document.content,
        order: 1,
        createdAt: action.payload.document.createdAt,
        modifiedAt: action.payload.document.modifiedAt,
        persistStatus: "local" as const,
      };

      return {
        ...state,
        documents: [guestDocument],
        activeDocumentId: guestDocument.id,
        editor: { nameDraft: guestDocument.name, nameError: null },
      };
    }

    // Migrate guest document
    case "document/migrateGuest": {
      const guestDocument = action.payload.document;

      const newName = getNewDocumentName(
        state.documents.map((document) => document.name),
      );

      const newOrder = state.documents.length + 1;

      const newDocument: Document = {
        id: crypto.randomUUID(),
        name: newName,
        content: guestDocument.content,
        order: newOrder,
        createdAt: guestDocument.createdAt,
        modifiedAt: guestDocument.modifiedAt,
        persistStatus: "creating",
      };

      return {
        ...state,
        documents: [...state.documents, newDocument],
        activeDocumentId: newDocument.id,
        editor: {
          ...state.editor,
          nameDraft: newDocument.name,
          nameError: null,
        },
      };
    }

    // Reorder documents
    case "document/reorder": {
      const { orderedIds } = action.payload;

      const documentMap = new Map(
        state.documents.map((document) => [document.id, document]),
      );

      const reorderedDocuments = orderedIds
        .map((id, index) => {
          const document = documentMap.get(id);

          if (!document) {
            console.error(`Missing document for reorder id: ${id}`);
            return null;
          }

          return document;
        })
        .filter((document) => document !== null)
        .map((document, index) => ({ ...document, order: index + 1 }));
      return { ...state, documents: reorderedDocuments };
    }

    // Open delete modal
    case "modal/openDelete": {
      return { ...state, ui: { ...state.ui, isDeleteModalOpen: true } };
    }

    // Close delete modal
    case "modal/closeDelete": {
      return { ...state, ui: { ...state.ui, isDeleteModalOpen: false } };
    }

    // Open sign-in modal
    case "modal/openSignInEmail": {
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: false,
          signInModal: {
            step: "email",
            email: "",
            inputError: null,
            processError: null,
            status: "idle",
            resendStatus: "idle",
          },
        },
      };
    }

    // Close sign-in modal
    case "modal/closeSignIn": {
      return {
        ...state,
        ui: {
          ...state.ui,
          signInModal: {
            ...state.ui.signInModal,
            step: "closed",
            email: "",
            inputError: null,
            processError: null,
            status: "idle",
          },
        },
      };
    }

    // Sidebar
    case "sidebar/open": {
      return { ...state, ui: { ...state.ui, sidebarOpen: true } };
    }

    case "sidebar/close": {
      return { ...state, ui: { ...state.ui, sidebarOpen: false } };
    }

    // set View
    case "view/set": {
      if (state.ui.view === action.payload.view) return state;

      return { ...state, ui: { ...state.ui, view: action.payload.view } };
    }

    // Themes
    case "theme/toggle": {
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: state.ui.theme === "light" ? "dark" : "light",
          themeSource: "user",
        },
      };
    }

    case "theme/set": {
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload.theme,
          themeSource: action.payload.themeSource,
        },
      };
    }

    case "toast/enqueue": {
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [
            ...state.ui.toasts,
            {
              id: action.payload.id,
              message: action.payload.message,
              variant: action.payload.variant,
            },
          ],
        },
      };
    }

    case "toast/dismiss": {
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: state.ui.toasts.filter(
            (toast) => toast?.id !== action.payload.id,
          ),
        },
      };
    }

    default:
      return state;
  }
}
