import { formatTime } from "@/scripts/shared/utils/helper";
import type { State } from "../types";
import type { DOM } from "./dom";
import {
  selectActiveDocument,
  selectActiveToast,
  selectDisableEditor,
  selectHasDocuments,
} from "../selectors";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { DURATIONS } from "@/scripts/shared/animations/global";

function updateDocumentList(state: State, dom: DOM) {
  dom.documentList.replaceChildren();

  switch (state.requests.load.status) {
    case "pending":
      const spinner =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'><circle cx='17' cy='2' r='2' fill='currentColor' /><circle cx='17' cy='32' r='2' fill='currentColor' opacity='0.3' /><circle cx='24.5' cy='4' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='4' r='2' fill='currentColor' opacity='0.93' /><circle cx='24.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='2' cy='17' r='2' fill='currentColor' opacity='0.65' /><circle cx='32' cy='17' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='9.5' r='2' fill='currentColor' opacity='0.86' /><circle cx='30' cy='24.5' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='24.5' r='2' fill='currentColor' opacity='0.44' /><circle cx='30' cy='9.5' r='2' fill='currentColor' opacity='0.3' /></svg>";

      dom.documentList.innerHTML = `<div class='status'>${spinner}<p>Loading documents...</p></div>`;
      break;

    case "error":
      dom.documentList.innerHTML = `<div class='status'><p>${state.requests.load.message ?? ""}</p></div>`;
      break;
    case "success":
      if (!selectHasDocuments(state)) {
        dom.documentList.innerHTML = `<div class='status'><p>No documents yet</p></div>`;
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

  switch (state.auth.status) {
    case "guest": {
      dom.authEmailSpan.textContent = "";
      dom.authButtonText.textContent = "Sign in";
      dom.authButton.disabled = false;
      break;
    }

    case "loading": {
      dom.authEmailSpan.textContent = "";
      dom.authButtonText.textContent = "Signing in";
      dom.authButton.disabled = true;
      break;
    }

    case "authenticated": {
      dom.authEmailSpan.textContent = state.auth.email ?? "";
      dom.authButtonText.textContent = "Sign out";
      dom.authButton.disabled = false;
      break;
    }
  }
}

function updateSaveButton(state: State, dom: DOM) {
  const button = dom.saveChangesButton;
  const text = dom.saveChangesText;

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

function disableDocumentInteractions(isDisabled: boolean, dom: DOM) {
  dom.documentNameInput.disabled = isDisabled;
  dom.saveChangesButton.disabled = isDisabled;
  dom.openDeleteModalButton.disabled = isDisabled;
  dom.markdownContent.disabled = isDisabled;
}

export function render(state: State, dom: DOM) {
  // Theme toggle
  dom.themeToggle.checked = state.ui.theme === "dark" ? true : false;

  // Editor view
  dom.editor.dataset.view = state.ui.view;
  dom.viewToggle.setAttribute(
    "aria-pressed",
    state.ui.view === "preview" ? "true" : "false",
  );

  //Sidebar
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

  // Auth panel
  updateAuthPanel(state, dom);

  // Toasts
  const activeToast = selectActiveToast(state);
  if (activeToast) {
    dom.toastContainer.classList.add("show");
    dom.toastContainer.dataset.id = activeToast.id;
    dom.toastMessage.textContent = activeToast.message;
  } else {
    dom.toastContainer.classList.remove("show");
  }

  // Save button
  updateSaveButton(state, dom);

  // Document list
  updateDocumentList(state, dom);

  // Document name input
  updateNameInput(state, dom);

  //   Active document
  const activeDocument = selectActiveDocument(state);

  // Delete modal
  dom.deleteModalDocumentName.textContent = activeDocument?.name ?? "";

  if (state.ui.isDeleteModalOpen) {
    dom.deleteModal.showModal();
  } else {
    dom.deleteModal.close();
  }

  // Content
  dom.markdownContent.value = activeDocument?.content ?? "";

  if (activeDocument) {
    marked.use({
      async: false,
    });
    dom.previewContent.innerHTML = DOMPurify.sanitize(
      marked.parse(activeDocument.content) as string,
    );
  }

  // Disable document interactions
  if (selectDisableEditor(state)) {
    disableDocumentInteractions(true, dom);
  } else disableDocumentInteractions(false, dom);
}
