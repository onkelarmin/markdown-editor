import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";
import { DEMO_USER_ID } from "@/server/config";

export async function createNewDocument(store: Store) {
  const state = store.getState();

  const newDocument = selectActiveDocument(state);

  if (!newDocument) return;

  const { data, error } = await actions.createDocument({
    id: newDocument.id,
    name: newDocument.name,
    content: newDocument.content,
    createdAt: newDocument.createdAt,
    modifiedAt: newDocument.modifiedAt,
    userId: DEMO_USER_ID,
  });

  if (error) {
    console.error(error.message);
  }
  if (data) {
  }
}
