import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";

export async function saveActiveDocument(store: Store) {
  const state = store.getState();

  const activeDocument = selectActiveDocument(state);

  // const { data, error } = await actions.saveDocument();
  // console.log("Data: ", data);
  // console.log("Error: ", error);
}
