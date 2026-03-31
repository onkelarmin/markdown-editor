import { type Theme } from "./lib/constants";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export type PersistStatus = "creating" | "saved" | "error";

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
  createdAt: number;
  modifiedAt: number;
  persistStatus: PersistStatus;
};

export type State = {
  documents: Document[];
  activeDocumentId: string | null;
  nameDraft: string;
  nameError: string | null;
  sidebarOpen: boolean;
  view: View;
  isDeleteModalOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  saveStatus: SaveStatus;
  theme: Theme;
  themeSource: ThemeSource;
  toasts: Toast[];
};

export type Action =
  | { type: "documents/loadStart" }
  | { type: "documents/loadSuccess"; payload: { documents: Document[] } }
  | { type: "documents/loadError"; payload: { message: string } }
  | {
      type: "document/create";
    }
  | {
      type: "document/createSuccess";
      payload: { id: string };
    }
  | {
      type: "document/createError";
      payload: { id: string };
    }
  | { type: "document/select"; payload: { id: string } }
  | { type: "document/delete"; payload: { id: string } }
  | {
      type: "document/updateName";
      payload: { name: string };
    }
  | {
      type: "document/updateNameDraft";
      payload: { name: string; error?: string };
    }
  | {
      type: "document/updateContent";
      payload: { content: string };
    }
  | { type: "document/saveStart" }
  | { type: "document/saveSuccess" }
  | { type: "document/saveReset" }
  | { type: "document/saveError" }
  | { type: "view/set"; payload: { view: View } }
  | { type: "sidebar/open" }
  | { type: "sidebar/close" }
  | { type: "modal/openDelete" }
  | { type: "modal/closeDelete" }
  | { type: "theme/toggle" }
  | { type: "theme/set"; payload: { theme: Theme; themeSource: ThemeSource } }
  | {
      type: "toast/enqueue";
      payload: { id: string; message: string; variant: ToastVariant };
    }
  | { type: "toast/dismiss"; payload: { id: string } };

export type subscribeOptions = {
  fireImmediately?: boolean;
};
