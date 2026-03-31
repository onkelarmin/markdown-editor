import { actions } from "astro:actions";
import type { Store } from "../store";

export async function loadDocuments(store: Store) {
  store.dispatch({ type: "documents/loadStart" });
  const { data, error } = await actions.getDocuments();

  if (error) {
    console.error(error.message);

    store.dispatch({
      type: "documents/loadError",
      payload: { message: "Failed to load documents." },
    });
  }
  if (data) {
    const documents = data.map((document) => ({
      ...document,
      persistStatus: "saved" as const,
    }));
    store.dispatch({
      type: "documents/loadSuccess",
      payload: { documents },
    });
  }
}
