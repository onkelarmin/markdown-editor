import { queueAutoSave } from "../effects/autoSave";
import { createNewDocument } from "../effects/createDocument";
import { deleteDocument } from "../effects/deleteDocument";
import { resendAuthCode } from "../effects/resendAuthCode";
import { saveActiveDocument } from "../effects/saveDocument";
import { sendAuthCode } from "../effects/sendAuthCode";
import { signOutUser } from "../effects/signOut";
import { verifyAuthCode } from "../effects/verifyAuthCode";
import { normalizeDocumentName } from "../lib/normalizeDocumentName";
import {
  documentNameSchemaFull,
  documentNameSchemaLight,
  emailSchema,
  otpSchema,
} from "../schema";
import {
  selectCanCreateDocuments,
  selectCanDeleteDocuments,
  selectCanManageDocuments,
  selectCanPersistDocuments,
  selectCanRenameDocuments,
  selectDeleteModalOpen,
  selectHasSignInInputError,
  selectIsAuthenticated,
  selectIsGuest,
  selectSidebarOpen,
  selectSignInModalOpen,
} from "../selectors";
import type { Store } from "../store";
import type { DOM } from "./dom";

function handleDocumentNameChange(store: Store, input: HTMLInputElement) {
  const normalized = normalizeDocumentName(input.value);

  const result = documentNameSchemaFull.safeParse(normalized);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid value";

    store.dispatch({
      type: "document/updateNameDraft",
      payload: { name: normalized, error: message },
    });
  } else {
    store.dispatch({
      type: "document/commitName",
      payload: { name: normalized },
    });
    void saveActiveDocument(store);
    input.blur();
  }
}

export function bindEvents(dom: DOM, store: Store) {
  // Auth button click
  const onAuthButtonClick = () => {
    if (selectIsGuest(store.getState()))
      store.dispatch({ type: "modal/openSignInEmail" });

    if (selectIsAuthenticated(store.getState())) void signOutUser(store, dom);
  };
  dom.authButton.addEventListener("click", onAuthButtonClick);

  // Email input
  const onEmailInput = () => {
    if (
      !selectIsGuest(store.getState()) ||
      !selectHasSignInInputError(store.getState())
    )
      return;

    store.dispatch({ type: "auth/clearInputError" });
  };

  const onEmailChange = (e: Event) => {
    if (!selectIsGuest(store.getState())) return;

    const input = e.currentTarget;

    if (!(input instanceof HTMLInputElement)) return;

    const result = emailSchema.safeParse(input.value);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Invalid email address";

      store.dispatch({ type: "auth/setInputError", payload: { message } });
    }
  };

  const onEmailSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!selectIsGuest(store.getState())) return;

    const form = e.currentTarget;

    if (!(form instanceof HTMLFormElement)) return;

    const input = form.elements.namedItem("email");

    if (!(input instanceof HTMLInputElement)) return;

    const result = emailSchema.safeParse(input.value);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Invalid email address";

      store.dispatch({ type: "auth/setInputError", payload: { message } });
    } else {
      store.dispatch({ type: "auth/sendCodeStart" });

      void sendAuthCode(store, input.value);
    }
  };

  dom.emailInput.addEventListener("input", onEmailInput);
  dom.emailInput.addEventListener("change", onEmailChange);
  dom.emailForm.addEventListener("submit", onEmailSubmit);

  // OTP input
  const onOtpInput = (e: Event) => {
    if (
      !selectIsGuest(store.getState()) ||
      !selectHasSignInInputError(store.getState())
    )
      return;

    store.dispatch({ type: "auth/clearInputError" });
  };

  const onOtpChange = (e: Event) => {
    if (!selectIsGuest(store.getState())) return;

    const input = e.currentTarget;

    if (!(input instanceof HTMLInputElement)) return;

    const result = otpSchema.safeParse(input.value);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Incorrect code format";

      store.dispatch({ type: "auth/setInputError", payload: { message } });
    }
  };

  const onOtpSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!selectIsGuest(store.getState())) return;

    const form = e.currentTarget;

    if (!(form instanceof HTMLFormElement)) return;

    const input = form.elements.namedItem("otp");

    if (!(input instanceof HTMLInputElement)) return;

    const result = otpSchema.safeParse(input.value);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Incorrect code format";

      store.dispatch({ type: "auth/setInputError", payload: { message } });
    } else {
      store.dispatch({ type: "auth/verifyCodeStart" });

      void verifyAuthCode(store, input.value);
    }
  };

  dom.otpInput.addEventListener("input", onOtpInput);
  dom.otpInput.addEventListener("change", onOtpChange);
  dom.otpForm.addEventListener("submit", onOtpSubmit);

  // Resend code
  const onResendCodeClick = () => {
    const email = store.getState().ui.signInModal.email;

    if (!email) return;

    store.dispatch({ type: "auth/resendCodeStart" });

    void resendAuthCode(store, email);
  };
  dom.resendCodeButton.addEventListener("click", onResendCodeClick);

  // Change email
  const onChangeEmailClick = () => {
    store.dispatch({ type: "auth/changeEmail" });
  };

  dom.changeEmailButton.addEventListener("click", onChangeEmailClick);

  // Close sign-in modal
  const onCloseSignInModalClick = () => {
    store.dispatch({ type: "modal/closeSignIn" });
  };
  const onSignInModalOverlayClick = (e: MouseEvent) => {
    const modal = e.currentTarget;

    if (!(modal instanceof HTMLDialogElement)) return;
    if (e.target !== modal) return;

    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      store.dispatch({ type: "modal/closeSignIn" });
    }
  };

  dom.closeSignInModalButton.addEventListener("click", onCloseSignInModalClick);
  dom.signInModal.addEventListener("click", onSignInModalOverlayClick);

  // Create document
  const onNewDocumentClick = () => {
    if (!selectCanCreateDocuments(store.getState())) return;

    store.dispatch({ type: "document/createOptimistic" });

    void createNewDocument(store);
  };
  dom.newDocumentButton.addEventListener("click", onNewDocumentClick);

  // Save changes
  const onSaveClick = () => {
    if (selectCanPersistDocuments(store.getState())) {
      void saveActiveDocument(store);
    } else {
      store.dispatch({ type: "modal/openSignInEmail" });
    }
  };
  dom.saveChangesButton.addEventListener("click", onSaveClick);

  // Delete document
  const onDeleteConfirmationClick = () => {
    if (!selectCanDeleteDocuments(store.getState())) return;

    const state = store.getState();

    const activeDocument = state.documents.find(
      (document) => document.id === state.activeDocumentId,
    );

    if (!activeDocument) return;

    store.dispatch({
      type: "document/deleteOptimistic",
      payload: { id: activeDocument.id },
    });
    store.dispatch({ type: "modal/closeDelete" });

    void deleteDocument(store, activeDocument);
  };
  dom.deleteModalConfirmationButton.addEventListener(
    "click",
    onDeleteConfirmationClick,
  );

  // Change document name
  const onDocumentNameInput = (e: Event) => {
    if (!selectCanRenameDocuments(store.getState())) return;

    const input = e.currentTarget;

    if (!(input instanceof HTMLInputElement)) return;

    const { value } = input;

    const result = documentNameSchemaLight.safeParse(value);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Invalid value";

      store.dispatch({
        type: "document/updateNameDraft",
        payload: { name: value, error: message },
      });
    } else {
      store.dispatch({
        type: "document/updateNameDraft",
        payload: { name: value },
      });
    }
  };

  const onDocumentNameChange = (e: Event) => {
    if (!selectCanRenameDocuments(store.getState())) return;

    const input = e.currentTarget;

    if (!(input instanceof HTMLInputElement)) return;

    handleDocumentNameChange(store, input);
  };

  const onDocumentNameSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!selectCanRenameDocuments(store.getState())) return;

    const form = e.currentTarget;

    if (!(form instanceof HTMLFormElement)) return;

    const input = form.elements.namedItem("document-name");

    if (!(input instanceof HTMLInputElement)) return;

    handleDocumentNameChange(store, input);
  };

  dom.documentNameInput.addEventListener("input", onDocumentNameInput);
  dom.documentNameInput.addEventListener("change", onDocumentNameChange);
  dom.documentNameForm.addEventListener("submit", onDocumentNameSubmit);

  // Update content
  const onMarkdownInput = (e: Event) => {
    const textArea = e.currentTarget;

    if (!(textArea instanceof HTMLTextAreaElement)) return;

    store.dispatch({
      type: "document/updateContent",
      payload: { content: textArea.value },
    });

    queueAutoSave(store, dom);
  };
  dom.markdownContent.addEventListener("input", onMarkdownInput);

  // Select document
  const onDocumentClick = (e: MouseEvent) => {
    if (!selectCanManageDocuments(store.getState())) return;

    if (!(e.target instanceof Element)) return;

    const button = e.target.closest<HTMLButtonElement>(".document-list-button");

    if (!button) return;

    const id = button.dataset.id;

    if (!id) {
      console.error("Document button missing data-id");
      return;
    }

    store.dispatch({ type: "document/select", payload: { id } });
  };
  dom.documentList.addEventListener("click", onDocumentClick);

  // Preview toggle
  const onPreviewClick = (e: MouseEvent) => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) return;

    const newView =
      button.getAttribute("aria-pressed") === "false" ? "preview" : "markdown";

    store.dispatch({ type: "view/set", payload: { view: newView } });
  };
  dom.viewToggle.addEventListener("click", onPreviewClick);

  // Sidebar toggle
  const onSidebarToggleClick = (e: MouseEvent) => {
    const toggle = e.currentTarget;

    if (!(toggle instanceof HTMLButtonElement)) return;

    if (toggle.getAttribute("aria-expanded") === "true")
      store.dispatch({ type: "sidebar/close" });
    else store.dispatch({ type: "sidebar/open" });
  };

  dom.sidebarToggle.addEventListener("click", onSidebarToggleClick);

  // Open delete modal
  const onDeleteModalButtonClick = () => {
    if (!selectCanDeleteDocuments(store.getState())) return;

    store.dispatch({ type: "modal/openDelete" });
  };
  dom.openDeleteModalButton.addEventListener("click", onDeleteModalButtonClick);

  // Close delete modal
  const onDeleteModalOverlayClick = (e: MouseEvent) => {
    const modal = e.currentTarget;

    if (!(modal instanceof HTMLDialogElement)) return;
    if (e.target !== modal) return;

    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      store.dispatch({ type: "modal/closeDelete" });
    }
  };
  dom.deleteModal.addEventListener("click", onDeleteModalOverlayClick);

  // Theme toggle
  const onThemeToggleClick = (e: Event) => {
    store.dispatch({ type: "theme/toggle" });
  };
  dom.themeToggle.addEventListener("change", onThemeToggleClick);

  // Close toast button
  const onCloseToastClick = (e: MouseEvent) => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) return;

    const toast = button.closest("#toast");

    if (!(toast instanceof HTMLElement)) return;

    const id = toast.dataset.id;

    if (!id) return;

    store.dispatch({ type: "toast/dismiss", payload: { id } });
  };
  dom.closeToastButton.addEventListener("click", onCloseToastClick);

  // Escape key
  const onEscape = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    if (selectSidebarOpen(store.getState())) {
      store.dispatch({ type: "sidebar/close" });
    }
    if (selectDeleteModalOpen(store.getState())) {
      store.dispatch({ type: "modal/closeDelete" });
    }
    if (selectSignInModalOpen(store.getState())) {
      store.dispatch({ type: "modal/closeSignIn" });
    }
  };
  document.addEventListener("keydown", onEscape);

  return () => {
    dom.authButton.removeEventListener("click", onAuthButtonClick);
    dom.emailInput.removeEventListener("input", onEmailInput);
    dom.emailInput.removeEventListener("change", onEmailChange);
    dom.emailForm.removeEventListener("submit", onEmailSubmit);
    dom.otpInput.removeEventListener("input", onOtpInput);
    dom.otpInput.removeEventListener("change", onOtpChange);
    dom.otpForm.removeEventListener("submit", onOtpSubmit);
    dom.resendCodeButton.removeEventListener("click", onResendCodeClick);
    dom.changeEmailButton.removeEventListener("click", onChangeEmailClick);
    dom.closeSignInModalButton.removeEventListener(
      "click",
      onCloseSignInModalClick,
    );
    dom.signInModal.removeEventListener("click", onSignInModalOverlayClick);
    dom.newDocumentButton.removeEventListener("click", onNewDocumentClick);
    dom.saveChangesButton.removeEventListener("click", onSaveClick);
    dom.deleteModalConfirmationButton.removeEventListener(
      "click",
      onDeleteConfirmationClick,
    );
    dom.documentNameInput.removeEventListener("input", onDocumentNameInput);
    dom.documentNameInput.removeEventListener("change", onDocumentNameChange);
    dom.documentNameForm.removeEventListener("submit", onDocumentNameSubmit);
    dom.markdownContent.removeEventListener("input", onMarkdownInput);
    dom.documentList.removeEventListener("click", onDocumentClick);
    dom.viewToggle.removeEventListener("click", onPreviewClick);
    dom.sidebarToggle.removeEventListener("click", onSidebarToggleClick);
    dom.openDeleteModalButton.removeEventListener(
      "click",
      onDeleteModalButtonClick,
    );
    dom.deleteModal.removeEventListener("click", onDeleteModalOverlayClick);

    dom.themeToggle.removeEventListener("change", onThemeToggleClick);
    dom.closeToastButton.removeEventListener("click", onCloseToastClick);
    document.removeEventListener("keydown", onEscape);
  };
}
