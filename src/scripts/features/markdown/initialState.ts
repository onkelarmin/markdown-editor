import { isTheme, themeStorageKey, type Theme } from "./lib/constants";
import type { State, Document, AuthState } from "./types";

function getInitialAuthfromDom(): AuthState {
  const authScript = document.querySelector("#initial-auth");

  if (!authScript?.textContent) {
    console.error("Missing serialized auth state");
    return {
      status: "guest",
      userId: null,
      email: null,
    };
  }
  try {
    return JSON.parse(authScript.textContent) as AuthState;
  } catch (error) {
    console.error("Failed parsing serialized auth state");
    return {
      status: "guest",
      userId: null,
      email: null,
    };
  }
}

export function getInitialState(): State {
  const initialAuth = getInitialAuthfromDom();

  const documents: Document[] = [];

  const activeDocumentId = null;

  const activeDocument = documents.find(
    (document) => document.id === activeDocumentId,
  );

  let theme: Theme = "light";

  const dataTheme = document.documentElement.dataset.theme;
  if (dataTheme && isTheme(dataTheme)) theme = dataTheme;

  return {
    auth: initialAuth,
    documents,
    activeDocumentId,
    ui: {
      sidebarOpen: false,
      view: "markdown",
      isDeleteModalOpen: false,
      theme: theme,
      themeSource: localStorage.getItem(themeStorageKey) ? "user" : "system",
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
      nameDraft: activeDocument?.name ?? "",
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
  };
}
