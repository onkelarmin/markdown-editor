import type { Store } from "../store";
import { createNewDocument } from "./createDocument";
import { loadGuestDocument, removeGuestDocument } from "./guestDocument";
import { loadDocuments } from "./loadDocuments";

export async function initAuthenticatedFlow(store: Store) {
  await loadDocuments(store);

  const guestDocument = loadGuestDocument();

  if (!guestDocument || guestDocument.content === "") return;

  store.dispatch({
    type: "document/migrateGuest",
    payload: { document: guestDocument },
  });

  const result = await createNewDocument(store);

  if (result.success) removeGuestDocument();
}
