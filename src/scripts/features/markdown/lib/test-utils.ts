import type { Document, State } from "@features/types";

export function makeDocument(overrides: Partial<Document> = {}): Document {
  return {
    id: "doc-1",
    name: "Document-1.md",
    content: "",
    order: 1,
    createdAt: 1,
    modifiedAt: 1,
    persistStatus: "created",
    ...overrides,
  };
}

export function makeState(overrides: Partial<State> = {}): State {
  return {
    auth: {
      status: "guest",
      userId: null,
      email: null,
    },

    documents: [],
    activeDocumentId: null,

    ui: {
      sidebarOpen: false,
      view: "markdown",
      isDeleteModalOpen: false,
      theme: "light",
      themeSource: "system",
      toasts: [],
      signInModal: {
        step: "closed",
        email: "",
        inputError: null,
        processError: null,
        status: "idle",
        resendStatus: "idle",
      },
    },

    editor: {
      nameDraft: "",
      nameError: null,
    },

    requests: {
      load: {
        status: "idle",
        message: null,
      },
      save: {
        status: "idle",
      },
      delete: {
        status: "idle",
      },
    },
    ...overrides,
  };
}
