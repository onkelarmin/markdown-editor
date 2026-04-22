import { formatTime } from "@/scripts/shared/utils/helper";
import type { State } from "../types";
import type { DOM } from "./dom";
import {
  selectActiveDocument,
  selectActiveToast,
  selectDisableEditor,
  selectHasDocuments,
  selectHasSignInInputError,
  selectHasSignInProcessError,
  selectIsAuthenticated,
  selectIsGuest,
  selectIsLoadingAuth,
} from "../selectors";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { DURATIONS } from "@/scripts/shared/animations/global";

function updateSignInDialog(state: State, dom: DOM) {
  const showInputError = (
    inputEl: HTMLInputElement,
    errorEl: HTMLParagraphElement,
    message: string,
  ) => {
    errorEl.textContent = message;
    inputEl.setAttribute("aria-invalid", "true");
    inputEl.setAttribute("aria-describedby", errorEl.id);
  };
  const hideInputError = (
    inputEl: HTMLInputElement,
    errorEl: HTMLParagraphElement,
  ) => {
    errorEl.textContent = "";
    inputEl.removeAttribute("aria-invalid");
    inputEl.removeAttribute("aria-describedby");
  };
  const showProcessError = (errorEl: HTMLParagraphElement, message: string) => {
    errorEl.textContent = message;
    errorEl.role = "alert";
  };
  const hideProcessError = (errorEl: HTMLParagraphElement) => {
    errorEl.textContent = "";
    errorEl.removeAttribute("role");
  };

  const step = state.ui.signInModal.step;
  const status = state.ui.signInModal.status;

  dom.signInModal.dataset.step = step;

  dom.signInEmailSpan.textContent = state.ui.signInModal.email;

  switch (step) {
    case "closed": {
      dom.signInModal.close();
      break;
    }
    case "email": {
      dom.signInModal.showModal();

      dom.emailInput.focus();

      const inputEl = dom.emailInput;
      const inputErrorEl = dom.emailInputError;
      const processErrorEl = dom.emailProcessError;

      switch (status) {
        case "idle": {
          dom.emailSubmitButton.toggleAttribute("data-show-spinner", false);
          dom.emailSubmitButton.disabled = false;
          dom.emailSubmitButtonText.textContent = "Send code";
          break;
        }
        case "sending": {
          dom.emailSubmitButton.toggleAttribute("data-show-spinner", true);
          dom.emailSubmitButton.disabled = true;
          dom.emailSubmitButtonText.textContent = "Sending code";
          break;
        }
        case "error": {
          if (selectHasSignInProcessError(state)) {
            dom.emailSubmitButton.toggleAttribute("data-show-spinner", false);
            dom.emailSubmitButton.disabled = false;
            dom.emailSubmitButtonText.textContent = "Retry";
          }
          break;
        }
      }

      if (selectHasSignInInputError(state)) {
        const message = state.ui.signInModal.inputError;

        if (message) showInputError(inputEl, inputErrorEl, message);
      } else {
        hideInputError(inputEl, inputErrorEl);
      }

      if (selectHasSignInProcessError(state)) {
        const message = state.ui.signInModal.processError;

        if (message) showProcessError(processErrorEl, message);
      } else {
        hideProcessError(processErrorEl);
      }
      break;
    }

    case "otp": {
      dom.signInModal.showModal();

      dom.otpInput.focus();

      const inputEl = dom.otpInput;
      const inputErrorEl = dom.otpInputError;
      const processErrorEl = dom.otpProcessError;

      switch (status) {
        case "idle": {
          dom.otpSubmitButton.toggleAttribute("data-show-spinner", false);
          dom.otpSubmitButton.disabled = false;
          dom.otpSubmitButtonText.textContent = "Verify & sign in";
          break;
        }
        case "verifying": {
          dom.otpSubmitButton.toggleAttribute("data-show-spinner", true);
          dom.otpSubmitButton.disabled = true;
          dom.otpSubmitButtonText.textContent = "Verifying";
          break;
        }
        case "error": {
          dom.otpSubmitButton.toggleAttribute("data-show-spinner", false);
          dom.otpSubmitButton.disabled = false;
          dom.otpSubmitButtonText.textContent = "Retry";
          break;
        }
      }

      if (selectHasSignInInputError(state)) {
        const message = state.ui.signInModal.inputError;

        if (message) showInputError(inputEl, inputErrorEl, message);
      } else {
        hideInputError(inputEl, inputErrorEl);
      }

      if (selectHasSignInProcessError(state)) {
        const message = state.ui.signInModal.processError;

        if (message) showProcessError(processErrorEl, message);
      } else {
        hideProcessError(processErrorEl);
      }

      // Resend button
      const resendButton = dom.resendCodeButton;
      const resendButtonText = dom.resendCodeButtonText;

      switch (state.ui.signInModal.resendStatus) {
        case "idle": {
          resendButtonText.textContent = "Resend code";
          resendButton.disabled = false;
          resendButton.toggleAttribute("data-show-spinner", false);
          break;
        }
        case "sending": {
          resendButtonText.textContent = "Sending code";
          resendButton.disabled = true;
          resendButton.toggleAttribute("data-show-spinner", true);
          break;
        }
        case "success": {
          resendButtonText.textContent = "Code sent";
          resendButton.disabled = false;
          resendButton.toggleAttribute("data-show-spinner", false);
        }
      }
    }
  }
}

function updateThemeToggle(state: State, dom: DOM) {
  dom.themeToggle.checked = state.ui.theme === "dark" ? true : false;
}

function updateEditorView(state: State, dom: DOM) {
  dom.editor.dataset.view = state.ui.view;
  dom.viewToggle.setAttribute(
    "aria-pressed",
    state.ui.view === "preview" ? "true" : "false",
  );
}

function updateSidebar(state: State, dom: DOM) {
  if (state.ui.sidebarOpen) {
    dom.sidebarToggle.setAttribute("aria-expanded", "true");
    dom.appLayout.setAttribute("data-open", "true");
    dom.appLayout.removeAttribute("style");
    dom.sidebar.removeAttribute("inert");
    dom.openDeleteModalButton.tabIndex = -1;
    dom.saveChangesButton.tabIndex = -1;
    dom.viewToggle.tabIndex = -1;
  } else {
    dom.sidebarToggle.setAttribute("aria-expanded", "false");
    dom.appLayout.setAttribute("data-open", "false");
    dom.sidebar.setAttribute("inert", "");
    dom.openDeleteModalButton.tabIndex = 0;
    dom.saveChangesButton.tabIndex = 0;
    dom.viewToggle.tabIndex = 0;

    setTimeout(() => {
      dom.appLayout.style.transition = "none";
    }, DURATIONS.default * 1000);
  }
}

function updateNewDocumentButton(state: State, dom: DOM) {
  dom.newDocumentButton.disabled =
    selectIsGuest(state) || selectIsLoadingAuth(state) ? true : false;
}

function updateDocumentList(state: State, dom: DOM) {
  dom.documentList.replaceChildren();

  if (selectIsGuest(state) || selectIsLoadingAuth(state)) {
    dom.documentList.innerHTML = `<li class='status'><p>Sign in to create and manage documents</p></li>`;
    return;
  }

  switch (state.requests.load.status) {
    case "pending":
      const spinner =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'><circle cx='17' cy='2' r='2' fill='currentColor' /><circle cx='17' cy='32' r='2' fill='currentColor' opacity='0.3' /><circle cx='24.5' cy='4' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='4' r='2' fill='currentColor' opacity='0.93' /><circle cx='24.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='2' cy='17' r='2' fill='currentColor' opacity='0.65' /><circle cx='32' cy='17' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='9.5' r='2' fill='currentColor' opacity='0.86' /><circle cx='30' cy='24.5' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='24.5' r='2' fill='currentColor' opacity='0.44' /><circle cx='30' cy='9.5' r='2' fill='currentColor' opacity='0.3' /></svg>";

      dom.documentList.innerHTML = `<li class='status'>${spinner}<p>Loading documents...</p></li>`;
      break;

    case "error":
      dom.documentList.innerHTML = `<li class='status'><p>${state.requests.load.message ?? ""}</p></li>`;
      break;
    case "success":
      if (!selectHasDocuments(state)) {
        dom.documentList.innerHTML = `<li class='status'><p>No documents yet</p></li>`;
      } else {
        state.documents.forEach((document) => {
          const clone = dom.documentListItemTemplate.content.cloneNode(
            true,
          ) as DocumentFragment;

          const button = clone.querySelector<HTMLButtonElement>(
            ".document-list-button",
          );
          const time = clone.querySelector<HTMLButtonElement>(
            ".document-list-button-time",
          );
          const name = clone.querySelector<HTMLButtonElement>(
            ".document-list-button-name",
          );

          if (!button || !time || !name) return;

          button.dataset.id = document.id;
          button.dataset.status = document.persistStatus;
          time.textContent = formatTime(document.modifiedAt);
          name.textContent = document.name;

          if (document.id === state.activeDocumentId)
            button.setAttribute("aria-current", "true");

          dom.documentList.appendChild(clone);
        });
      }
  }
}

function updateAuthPanel(state: State, dom: DOM) {
  dom.authContainer.dataset.state = state.auth.status;

  const email = dom.authEmailSpan;
  const button = dom.authButton;
  const buttonText = dom.authButtonText;

  if (selectIsGuest(state)) {
    email.textContent = "";
    buttonText.textContent = "Sign in";
    button.disabled = false;
    button.toggleAttribute("data-show-spinner", false);
    return;
  }
  if (selectIsLoadingAuth(state)) {
    email.textContent = "";
    buttonText.textContent = "Signing in";
    button.disabled = true;
    button.toggleAttribute("data-show-spinner", true);
    return;
  }
  if (selectIsAuthenticated(state)) {
    email.textContent = state.auth.email ?? "";
    buttonText.textContent = "Sign out";
    button.disabled = false;
    button.toggleAttribute("data-show-spinner", false);
    return;
  }
}

function updateDeleteModalButton(state: State, dom: DOM) {
  dom.openDeleteModalButton.hidden =
    selectIsGuest(state) || selectIsLoadingAuth(state);
  dom.openDeleteModalButton.disabled =
    selectIsAuthenticated(state) && selectDisableEditor(state);
}

function updateDeleteModal(state: State, dom: DOM) {
  const activeDocument = selectActiveDocument(state);

  dom.deleteModalDocumentName.textContent = activeDocument?.name ?? "";

  if (state.ui.isDeleteModalOpen) {
    dom.deleteModal.showModal();
  } else {
    dom.deleteModal.close();
  }
}

function updateSaveButton(state: State, dom: DOM) {
  const button = dom.saveChangesButton;
  const text = dom.saveChangesText;

  if (selectIsGuest(state)) {
    button.dataset.status = "guest";
    text.textContent = "Save online";
    button.disabled = false;
    return;
  }

  button.dataset.status = state.requests.save.status;

  switch (state.requests.save.status) {
    case "pending": {
      text.textContent = "Saving...";
      button.disabled = true;
      break;
    }
    case "success": {
      text.textContent = "Saved";
      button.disabled = false;
      break;
    }
    case "error": {
      text.textContent = "Retry";
      button.disabled = false;
      break;
    }
    default: {
      text.textContent = "Save Changes";
      button.disabled = false;
    }
  }
}

function updateNameInput(state: State, dom: DOM) {
  dom.documentNameInput.disabled =
    selectIsGuest(state) ||
    selectIsLoadingAuth(state) ||
    (selectIsAuthenticated(state) && selectDisableEditor(state));

  dom.documentNameInput.value = state.editor.nameDraft;
  if (state.editor.nameError) {
    dom.documentNameError.textContent = state.editor.nameError;
    dom.documentNameInput.setAttribute("aria-invalid", "true");
    dom.documentNameInput.setAttribute(
      "aria-describedby",
      dom.documentNameError.id,
    );
  } else {
    dom.documentNameError.textContent = "";
    dom.documentNameInput.removeAttribute("aria-invalid");
    dom.documentNameInput.removeAttribute("aria-describedby");
  }
}

function updateMarkdownEditor(state: State, dom: DOM) {
  dom.markdownContent.disabled = selectDisableEditor(state);

  const activeDocument = selectActiveDocument(state);

  dom.markdownContent.value = activeDocument?.content ?? "";

  if (activeDocument) {
    marked.use({
      async: false,
    });
    dom.previewContent.innerHTML = DOMPurify.sanitize(
      marked.parse(activeDocument.content) as string,
    );
  }
}

function updateToast(state: State, dom: DOM) {
  const activeToast = selectActiveToast(state);

  if (activeToast) {
    dom.toastContainer.classList.add("show");
    dom.toastContainer.dataset.id = activeToast.id;
    dom.toastMessage.textContent = activeToast.message;
  } else {
    dom.toastContainer.classList.remove("show");
  }
}

export function render(state: State, dom: DOM) {
  // Sign in dialog
  updateSignInDialog(state, dom);

  // Theme toggle
  updateThemeToggle(state, dom);

  // Editor view
  updateEditorView(state, dom);

  // Sidebar
  updateSidebar(state, dom);

  // Auth panel
  updateAuthPanel(state, dom);

  // New document button
  updateNewDocumentButton(state, dom);

  // Document list
  updateDocumentList(state, dom);

  // Document name input
  updateNameInput(state, dom);

  // Delete modal button
  updateDeleteModalButton(state, dom);

  // Delete modal
  updateDeleteModal(state, dom);

  // Save button
  updateSaveButton(state, dom);

  // Content
  updateMarkdownEditor(state, dom);

  // Toasts
  updateToast(state, dom);
}
