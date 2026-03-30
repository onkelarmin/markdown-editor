import { type Theme } from "./lib/constants";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export type Document = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
};

export type View = "markdown" | "preview";

export type ThemeSource = "system" | "user";

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
};

export type Action =
  | { type: "documents/loadStart" }
  | { type: "documents/loadSuccess"; payload: { documents: Document[] } }
  | { type: "documents/loadError"; payload: { message: string } }
  | {
      type: "document/create";
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
  | { type: "save/start" }
  | { type: "view/set"; payload: { view: View } }
  | { type: "sidebar/open" }
  | { type: "sidebar/close" }
  | { type: "modal/openDelete" }
  | { type: "modal/closeDelete" }
  | { type: "theme/toggle" }
  | { type: "theme/set"; payload: { theme: Theme; themeSource: ThemeSource } };

export type subscribeOptions = {
  fireImmediately?: boolean;
};
