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
    console.error(error.message);
    store.dispatch({ type: "save/error" });
  }

  if (data) {
    store.dispatch({ type: "save/success" });
    setTimeout(() => {
      store.dispatch({ type: "save/reset" });
    }, 2000);
  }
}
