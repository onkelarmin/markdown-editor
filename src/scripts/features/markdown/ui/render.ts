import { formatTime } from "@/scripts/shared/utils/helper";
import type { State } from "../types";
import type { DOM } from "./dom";
import { selectActiveDocument, selectHasDocuments } from "../selectors";

export function render(state: State, dom: DOM) {
  if (!selectHasDocuments) return;

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

  // Sidebar document list
  dom.documentList.replaceChildren();
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

    // Set view
    dom.editor.dataset.view = state.view;
    dom.viewToggle.setAttribute(
      "aria-pressed",
      state.view === "preview" ? "true" : "false",
    );
  });
}
