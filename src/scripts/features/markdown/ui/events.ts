import { queueAutoSave } from "../effects/autoSave";
import { createNewDocument } from "../effects/createDocument";
import { saveActiveDocument } from "../effects/saveDocument";
import { normalizeDocumentName } from "../lib/normalizeDocumentName";
import { documentNameSchemaFull, documentNameSchemaLight } from "../schema";
import { selectSidebarOpen } from "../selectors";
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
      type: "document/updateName",
      payload: { name: normalized },
    });
    void saveActiveDocument(store);
    input.blur();
  }
}

export function bindEvents(dom: DOM, store: Store) {
  // Save changes
  const onSaveClick = () => {
    void saveActiveDocument(store);
  };
  dom.saveChangesButton.addEventListener("click", onSaveClick);

  // Create document
  const onNewDocumentClick = () => {
    store.dispatch({ type: "document/create" });
    void createNewDocument(store);
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

    handleDocumentNameChange(store, input);
  };

  const onDocumentNameSubmit = (e: SubmitEvent) => {
    e.preventDefault();

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
    queueAutoSave(store);
  };
  dom.markdownContent.addEventListener("input", onMarkdownInput);

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

  // Sidebar toggle
  const onSidebarToggleClick = (e: MouseEvent) => {
    const toggle = e.currentTarget;

    if (!(toggle instanceof HTMLButtonElement)) return;

    if (toggle.getAttribute("aria-expanded") === "true")
      store.dispatch({ type: "sidebar/close" });
    else store.dispatch({ type: "sidebar/open" });
  };

  const onEscape = (e: KeyboardEvent) => {
    if (selectSidebarOpen(store.getState()) && e.key === "Escape") {
      store.dispatch({ type: "sidebar/close" });
    }
  };

  dom.sidebarToggle.addEventListener("click", onSidebarToggleClick);
  document.addEventListener("keydown", onEscape);

  // Preview toggle
  const onPreviewClick = (e: MouseEvent) => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) return;

    const newView =
      button.getAttribute("aria-pressed") === "false" ? "preview" : "markdown";

    store.dispatch({ type: "view/set", payload: { view: newView } });
  };
  dom.viewToggle.addEventListener("click", onPreviewClick);

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

  return () => {
    dom.saveChangesButton.removeEventListener("click", onSaveClick);
    dom.newDocumentButton.removeEventListener("click", onNewDocumentClick);
    dom.documentNameInput.removeEventListener("input", onDocumentNameInput);
    dom.documentNameInput.removeEventListener("change", onDocumentNameChange);
    dom.documentNameForm.removeEventListener("submit", onDocumentNameSubmit);
    dom.markdownContent.removeEventListener("input", onMarkdownInput);
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
    dom.sidebarToggle.removeEventListener("click", onSidebarToggleClick);
    document.removeEventListener("keydown", onEscape);
    dom.viewToggle.removeEventListener("click", onPreviewClick);
    dom.themeToggle.removeEventListener("click", onThemeToggleClick);
    dom.closeToastButton.removeEventListener("click", onCloseToastClick);
  };
}
