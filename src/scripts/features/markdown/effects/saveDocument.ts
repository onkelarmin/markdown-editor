import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";
import { DEMO_USER_ID } from "@/server/config";

export async function saveActiveDocument(store: Store) {
  const state = store.getState();

  const activeDocument = selectActiveDocument(state);

  if (!activeDocument) return;

  const { data, error } = await actions.saveDocument({
    id: activeDocument.id,
    name: activeDocument.name,
    content: activeDocument.content,
    modifiedAt: activeDocument.modifiedAt,
    userId: DEMO_USER_ID,
  });

  if (error) {
    console.error("Save document failed: ", error);

    store.dispatch({ type: "document/saveError" });

    store.dispatch({
      type: "toast/enqueue",
      payload: {
        id: crypto.randomUUID(),
        message: "Failed to save changes. Your edits are still in the editor.",
        variant: "error",
      },
    });
  }

  if (data) {
    store.dispatch({ type: "document/saveSuccess" });
    setTimeout(() => {
      store.dispatch({ type: "document/saveReset" });
    }, 2000);
  }
}
