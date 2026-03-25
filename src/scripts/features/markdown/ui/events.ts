import { normalizeDocumentName } from "../lib/normalizeDocumentName";
import { documentNameSchemaFull, documentNameSchemaLight } from "../schema";
import type { Store } from "../store";
import type { DOM } from "./dom";

export function bindEvents(dom: DOM, store: Store) {
  // Create document
  const onNewDocumentClick = () => {
    store.dispatch({ type: "document/create" });
  };
  dom.newDocumentButton.addEventListener("click", onNewDocumentClick);

  // Change document name
  const onDocumentNameInput = (e: Event) => {
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
    const input = e.currentTarget;

    if (!(input instanceof HTMLInputElement)) return;

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
        type: "document/updateName",
        payload: { name: normalized },
      });
    }
  };
  dom.documentNameInput.addEventListener("input", onDocumentNameInput);
  dom.documentNameInput.addEventListener("change", onDocumentNameChange);

  // Select document
  const onDocumentClick = (e: MouseEvent) => {
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

  // Open delete modal
  const onDeleteModalButtonClick = () => {
    store.dispatch({ type: "modal/openDelete" });
  };
  dom.openDeleteModalButton.addEventListener("click", onDeleteModalButtonClick);

  // Close delete modal
  const onDeleteModalOverlayClick = (e: MouseEvent) => {
    const modal = e.currentTarget;

    if (!(modal instanceof HTMLDialogElement)) return;

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

  // Delete document
  const onDeleteConfirmationClick = (e: MouseEvent) => {
    if (!(e.target instanceof Element)) return;

    const button = e.target.closest<HTMLButtonElement>(
      "#delete-modal-confirmation-button",
    );

    if (!button) return;

    const id = button.dataset.id;

    if (!id) {
      console.error("Confirmation button missing data-id");
      store.dispatch({ type: "modal/closeDelete" });
    } else {
      store.dispatch({ type: "document/delete", payload: { id } });
    }
  };
  dom.deleteModalConfirmationButton.addEventListener(
    "click",
    onDeleteConfirmationClick,
  );

  // Preview toggle
  const onPreviewClick = (e: MouseEvent) => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) return;

    const newView =
      button.getAttribute("aria-pressed") === "false" ? "preview" : "markdown";

    store.dispatch({ type: "view/set", payload: { view: newView } });
  };
  dom.viewToggle.addEventListener("click", onPreviewClick);

  return () => {
    dom.newDocumentButton.removeEventListener("click", onNewDocumentClick);
    dom.documentNameInput.removeEventListener("input", onDocumentNameInput);
    dom.documentNameInput.removeEventListener("change", onDocumentNameChange);
    dom.documentList.removeEventListener("click", onDocumentClick);
    dom.openDeleteModalButton.removeEventListener(
      "click",
      onDeleteModalButtonClick,
    );
    dom.deleteModal.removeEventListener("click", onDeleteModalOverlayClick);

    dom.deleteModalConfirmationButton.removeEventListener(
      "click",
      onDeleteConfirmationClick,
    );
    dom.viewToggle.removeEventListener("click", onPreviewClick);
  };
}
