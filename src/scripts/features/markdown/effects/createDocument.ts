import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";
import { success } from "astro:schema";

export async function createNewDocument(store: Store) {
  const state = store.getState();

  const newDocument = selectActiveDocument(state);

  if (!newDocument) return { success: false };

  const { data, error } = await actions.createDocument({
    id: newDocument.id,
    name: newDocument.name,
    content: newDocument.content,
    order: newDocument.order,
    createdAt: newDocument.createdAt,
    modifiedAt: newDocument.modifiedAt,
  });

  if (error) {
    console.error("Create document failed: ", error);

    store.dispatch({
      type: "document/createError",
      payload: { id: newDocument.id },
    });

    store.dispatch({
      type: "toast/enqueue",
      payload: {
        id: crypto.randomUUID(),
        message: "Failed to create document.",
        variant: "error",
      },
    });

    return { success: false };
  }
  if (data) {
    store.dispatch({
      type: "document/createSuccess",
      payload: { id: newDocument.id },
    });
  }

  return { success: true };
}
