import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";

export async function createNewDocument(store: Store) {
  const state = store.getState();

  const newDocument = selectActiveDocument(state);

  if (!newDocument) return { success: false };

  try {
    const { data, error } = await actions.createDocument({
      id: newDocument.id,
      name: newDocument.name,
      content: newDocument.content,
      order: newDocument.order,
      createdAt: newDocument.createdAt,
      modifiedAt: newDocument.modifiedAt,
    });

    if (error || !data) {
      handleCreationError(store, newDocument.id, error);
      return { success: false };
    }

    store.dispatch({
      type: "document/createSuccess",
      payload: { id: newDocument.id },
    });

    return { success: true };
  } catch (error) {
    handleCreationError(store, newDocument.id, error);
    return { success: false };
  }
}

function handleCreationError(store: Store, documentId: string, error: unknown) {
  console.error("Create document failed: ", error);

  store.dispatch({
    type: "document/createError",
    payload: { id: documentId },
  });

  store.dispatch({
    type: "toast/enqueue",
    payload: {
      id: crypto.randomUUID(),
      message: "Failed to create document.",
      variant: "error",
    },
  });
}
