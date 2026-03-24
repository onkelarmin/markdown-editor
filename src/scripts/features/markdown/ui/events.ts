import type { Store } from "../store";
import type { DOM } from "./dom";

export function bindEvents(dom: DOM, store: Store) {
  // Create document
  const onNewDocumentClick = (e: MouseEvent) => {
    store.dispatch({ type: "document/create" });
  };
  dom.newDocumentButton.addEventListener("click", onNewDocumentClick);

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

  // Delete document
  const onDeleteClick = (e: MouseEvent) => {};
  dom.deleteButton.addEventListener("click", onDeleteClick);

  // Preview toggle
  const onPreviewClick = (e: MouseEvent) => {
    const newView =
      dom.viewToggle.getAttribute("aria-pressed") === "false"
        ? "preview"
        : "markdown";

    store.dispatch({ type: "view/set", payload: { view: newView } });
  };
  dom.viewToggle.addEventListener("click", onPreviewClick);

  return () => {
    dom.newDocumentButton.removeEventListener("click", onNewDocumentClick);
    dom.documentList.removeEventListener("click", onDocumentClick);
    dom.deleteButton.addEventListener("click", onDeleteClick);
    dom.viewToggle.removeEventListener("click", onPreviewClick);
  };
}
