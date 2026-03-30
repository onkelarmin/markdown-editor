import { formatTime } from "@/scripts/shared/utils/helper";
import type { State } from "../types";
import type { DOM } from "./dom";
import { selectActiveDocument, selectHasDocuments } from "../selectors";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { DURATIONS } from "@/scripts/shared/animations/global";
import type { Theme } from "../lib/constants";

function showStatus(dom: DOM, message: string, showSpinner: boolean) {
  const spinner =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'><circle cx='17' cy='2' r='2' fill='currentColor' /><circle cx='17' cy='32' r='2' fill='currentColor' opacity='0.3' /><circle cx='24.5' cy='4' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='9.5' cy='4' r='2' fill='currentColor' opacity='0.93' /><circle cx='24.5' cy='30' r='2' fill='currentColor' opacity='0.3' /><circle cx='2' cy='17' r='2' fill='currentColor' opacity='0.65' /><circle cx='32' cy='17' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='9.5' r='2' fill='currentColor' opacity='0.86' /><circle cx='30' cy='24.5' r='2' fill='currentColor' opacity='0.3' /><circle cx='4' cy='24.5' r='2' fill='currentColor' opacity='0.44' /><circle cx='30' cy='9.5' r='2' fill='currentColor' opacity='0.3' /></svg>";
  const html = `<div class='status'>${showSpinner ? spinner : ""}<p>${message}</p></div>`;
  dom.documentList.innerHTML = html;
}

function showDocuments(dom: DOM, state: State) {
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
    time.textContent = formatTime(document.modifiedAt);
    name.textContent = document.name;

    if (document.id === state.activeDocumentId)
      button.setAttribute("aria-current", "true");

    dom.documentList.appendChild(clone);
  });
}

export function render(state: State, dom: DOM) {
  console.log(state);

  //Sidebar
  if (state.sidebarOpen) {
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

  // Sidebar document list
  dom.documentList.replaceChildren();

  if (state.isLoading) {
    showStatus(dom, "Loading documents...", true);
  } else if (state.errorMessage) {
    showStatus(dom, state.errorMessage, false);
    return;
  } else if (!selectHasDocuments(state)) {
    showStatus(dom, "No documents yet", false);
    return;
  } else showDocuments(dom, state);

  // Theme toggle
  dom.themeToggle.checked = state.theme === "dark" ? true : false;

  //   Active document
  const activeDocument = selectActiveDocument(state);

  if (!activeDocument) return;

  // Document name input
  dom.documentNameInput.value = state.nameDraft;
  if (state.nameError) {
    dom.documentNameError.textContent = state.nameError;
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

  // Delete modal
  dom.deleteModalDocumentName.textContent = activeDocument.name;
  dom.deleteModalConfirmationButton.dataset.id = activeDocument.id;

  if (state.isDeleteModalOpen) {
    dom.deleteModal.showModal();
  } else dom.deleteModal.close();

  // Content
  dom.markdownContent.value = activeDocument.content;

  marked.use({
    async: false,
  });
  dom.previewContent.innerHTML = DOMPurify.sanitize(
    marked.parse(activeDocument.content) as string,
  );

  // Save changes button
  dom.saveChangesButton.dataset.status = state.saveStatus;

  // Set view
  dom.editor.dataset.view = state.view;
  dom.viewToggle.setAttribute(
    "aria-pressed",
    state.view === "preview" ? "true" : "false",
  );
}
