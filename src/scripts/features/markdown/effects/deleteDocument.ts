import { actions } from "astro:actions";
import type { Store } from "../store";
import type { Document } from "../types";

export async function deleteActiveDocument(
  store: Store,
  activeDocument: Document,
) {
  const { data, error } = await actions.deleteDocument({
    id: activeDocument.id,
  });

  if (error) {
    store.dispatch({
      type: "document/deleteRollback",
      payload: { document: activeDocument },
    });

    store.dispatch({
      type: "toast/enqueue",
      payload: {
        id: crypto.randomUUID(),
        message: "Failed to delete document.",
        variant: "error",
      },
    });
  }
}
