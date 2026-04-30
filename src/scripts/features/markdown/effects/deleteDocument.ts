import { actions } from "astro:actions";
import type { Store } from "../store";
import type { Document } from "../types";
import { loadDocuments } from "./loadDocuments";

export async function deleteDocument(store: Store, document: Document) {
  try {
    const { data, error } = await actions.deleteDocument({
      id: document.id,
    });

    if (error || !data) {
      handleDeleteError(store, error);

      return;
    }

    store.dispatch({
      type: "document/deleteSuccess",
      payload: { result: data },
    });
  } catch (error) {
    handleDeleteError(store, error);
  }
}

function handleDeleteError(store: Store, error: unknown) {
  console.error("Deleting document failed:", error);

  store.dispatch({
    type: "toast/enqueue",
    payload: {
      id: crypto.randomUUID(),
      message: "Failed to delete document.",
      variant: "error",
    },
  });

  store.dispatch({ type: "document/deleteError" });

  void loadDocuments(store);
}
