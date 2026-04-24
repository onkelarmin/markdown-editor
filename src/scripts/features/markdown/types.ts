import type { z } from "astro/zod";
import { type Theme } from "./lib/constants";
import type { guestDocumentSchema } from "./schema";

export type AuthStatus = "guest" | "authenticated" | "loading";

export type AuthState = {
  status: AuthStatus;
  userId: string | null;
  email: string | null;
};

export type SignInModalStep = "closed" | "email" | "otp";

export type SignInModalStatus = "idle" | "sending" | "verifying" | "error";

export type ResendStatus = "idle" | "sending" | "success";

export type View = "markdown" | "preview";

export type ThemeSource = "system" | "user";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
} | null;

export type PersistStatus = "local" | "creating" | "created" | "error";

export type LoadRequestState = {
  status: "idle" | "pending" | "success" | "error";
  message: string | null;
};

export type SaveRequestState = {
  status: "idle" | "dirty" | "pending" | "success" | "error";
};

export type SavePayload = {
  id: string;
  name: string;
  content: string;
  modifiedAt: number;
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

export type GuestDocument = z.infer<typeof guestDocumentSchema>;

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
  auth: AuthState;

  documents: Document[];
  activeDocumentId: string | null;

  ui: {
    sidebarOpen: boolean;
    view: View;
    isDeleteModalOpen: boolean;
    theme: Theme;
    themeSource: ThemeSource;
    toasts: Toast[];
    signInModal: {
      step: SignInModalStep;
      email: string;
      inputError: string | null;
      processError: string | null;
      status: SignInModalStatus;
      resendStatus: ResendStatus;
    };
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
  // Auth
  | { type: "auth/clearInputError" }
  | { type: "auth/setInputError"; payload: { message: string } }
  | { type: "auth/setProcessError"; payload: { message: string } }
  | { type: "auth/sendCodeStart" }
  | { type: "auth/sendCodeSuccess"; payload: { email: string } }
  | { type: "auth/verifyCodeStart" }
  | { type: "auth/verifyCodeSuccess" }
  | { type: "auth/resendCodeStart" }
  | { type: "auth/resendCodeError"; payload: { message: string } }
  | { type: "auth/resendCodeSuccess" }
  | { type: "auth/resendCodeReset" }
  | { type: "auth/changeEmail" }
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
  | { type: "document/deleteOptimistic"; payload: { id: string } }
  | { type: "document/deleteSuccess"; payload: { result: DeleteSuccessResult } }
  | { type: "document/deleteError" }
  // Domain
  | { type: "document/setGuest"; payload: { document: GuestDocument } }
  | { type: "document/migrateGuest"; payload: { document: GuestDocument } }
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
  | { type: "modal/openSignInEmail" }
  | { type: "modal/closeSignIn" }
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
