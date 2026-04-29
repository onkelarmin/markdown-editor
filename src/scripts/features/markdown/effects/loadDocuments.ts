import { actions } from "astro:actions";
import type { Store } from "../store";

export async function loadDocuments(store: Store) {
  store.dispatch({ type: "documents/loadStart" });

  try {
    const { data, error } = await actions.getDocuments();

    if (error || !data) {
      handleLoadingError(store, error);

      return;
    }

    const documents = data.map((document) => ({
      ...document,
      persistStatus: "created" as const,
    }));

    store.dispatch({
      type: "documents/loadSuccess",
      payload: { documents },
    });
  } catch (error) {
    handleLoadingError(store, error);
  }
}

function handleLoadingError(store: Store, error: unknown) {
  console.error("Load documents failed:", error);

  store.dispatch({
    type: "documents/loadError",
    payload: { message: "Failed to load documents." },
  });
}
