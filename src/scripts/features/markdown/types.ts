import { type Theme } from "./lib/constants";

export type PersistStatus = "creating" | "created" | "error";

export type LoadRequestState = {
  status: "idle" | "pending" | "success" | "error";
  message: string | null;
};

export type SaveRequestState = {
  status: "idle" | "dirty" | "pending" | "success" | "error";
};

export type DeleteRequestState = {
  status: "idle" | "pending";
};

export type DeleteSuccessResult = {
  deletedId: string;
  fallbackDocument: {
    id: string;
    userId: string;
    name: string;
    content: string;
    order: number;
    createdAt: number;
    modifiedAt: number;
  } | null;
};

export type View = "markdown" | "preview";

export type ThemeSource = "system" | "user";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
} | null;

export type Document = {
  id: string;
  name: string;
  content: string;
  order: number;
  createdAt: number;
  modifiedAt: number;
  persistStatus: PersistStatus;
};

export type State = {
  documents: Document[];
  activeDocumentId: string | null;

  ui: {
    sidebarOpen: boolean;
    view: View;
    isDeleteModalOpen: boolean;
    theme: Theme;
    themeSource: ThemeSource;
    toasts: Toast[];
  };

  editor: {
    nameDraft: string;
    nameError: string | null;
  };

  requests: {
    load: LoadRequestState;
    save: SaveRequestState;
    delete: DeleteRequestState;
  };
};

export type Action =
  // Requests
  | { type: "document/createOptimistic" }
  | { type: "document/createSuccess"; payload: { id: string } }
  | { type: "document/createError"; payload: { id: string } }
  | { type: "documents/loadStart" }
  | { type: "documents/loadSuccess"; payload: { documents: Document[] } }
  | { type: "documents/loadError"; payload: { message: string } }
  | { type: "document/saveStart" }
  | { type: "document/saveSuccess" }
  | { type: "document/saveError" }
  | { type: "document/saveReset" }
  | { type: "document/deleteStart"; payload: { id: string } }
  | { type: "document/deleteSuccess"; payload: { result: DeleteSuccessResult } }
  | { type: "document/deleteError" }
  // Domain
  | {
      type: "document/updateNameDraft";
      payload: { name: string; error?: string };
    }
  | { type: "document/commitName"; payload: { name: string } }
  | {
      type: "document/updateContent";
      payload: { content: string };
    }
  | { type: "document/select"; payload: { id: string } }
  | { type: "document/reorder"; payload: { orderedIds: string[] } }
  // UI
  | { type: "view/set"; payload: { view: View } }
  | { type: "sidebar/open" }
  | { type: "sidebar/close" }
  | { type: "modal/openDelete" }
  | { type: "modal/closeDelete" }
  | { type: "theme/toggle" }
  | { type: "theme/set"; payload: { theme: Theme; themeSource: ThemeSource } }
  // App
  | {
      type: "toast/enqueue";
      payload: { id: string; message: string; variant: ToastVariant };
    }
  | { type: "toast/dismiss"; payload: { id: string } };

export type subscribeOptions = {
  fireImmediately?: boolean;
};
