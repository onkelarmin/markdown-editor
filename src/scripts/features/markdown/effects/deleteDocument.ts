import { actions } from "astro:actions";
import type { Store } from "../store";
import type { Document } from "../types";
import { loadDocuments } from "./loadDocuments";

export async function deleteDocument(store: Store, document: Document) {
  const { data, error } = await actions.deleteDocument({
    id: document.id,
  });

  if (error) {
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

  if (data) {
    store.dispatch({
      type: "document/deleteSuccess",
      payload: { result: data },
    });
  }
}
