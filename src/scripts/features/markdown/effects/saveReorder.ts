import { actions } from "astro:actions";
import type { Store } from "../store";
import { loadDocuments } from "./loadDocuments";

export async function saveReorderedDocuments(store: Store) {
  const state = store.getState();

  const reordered = state.documents.map((document) => ({
    id: document.id,
    order: document.order,
  }));

  const { data, error } = await actions.reorderDocuments({ reordered });

  if (error) {
    store.dispatch({
      type: "toast/enqueue",
      payload: {
        id: crypto.randomUUID(),
        message: "Failed to save Reorder.",
        variant: "error",
      },
    });

    void loadDocuments(store);
  }
}
