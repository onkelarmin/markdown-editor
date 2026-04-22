import { actions } from "astro:actions";
import { selectActiveDocument } from "../selectors";
import type { Store } from "../store";
import type { SavePayload } from "../types";

const inFlightByDocument = new Set<string>();
const queuedByDocument = new Map<string, SavePayload>();
const resetTimerByDocument = new Map<string, ReturnType<typeof setTimeout>>();

export async function saveActiveDocument(store: Store) {
  const state = store.getState();
  const activeDocument = selectActiveDocument(state);

  if (!activeDocument) {
    store.dispatch({ type: "document/saveReset" });
    return;
  }

  const payload: SavePayload = {
    id: activeDocument.id,
    name: activeDocument.name,
    content: activeDocument.content,
    modifiedAt: activeDocument.modifiedAt,
  };

  if (inFlightByDocument.has(payload.id)) {
    queuedByDocument.set(payload.id, payload);
    return;
  }

  await runSaveQueue(store, payload);
}

async function runSaveQueue(store: Store, initialPayload: SavePayload) {
  const documentId = initialPayload.id;
  inFlightByDocument.add(documentId);

  let nextPayload: SavePayload | undefined = initialPayload;

  try {
    while (nextPayload) {
      queuedByDocument.delete(documentId);

      store.dispatch({ type: "document/saveStart" });

      const { data, error } = await actions.saveDocument({
        id: nextPayload.id,
        name: nextPayload.name,
        content: nextPayload.content,
        modifiedAt: nextPayload.modifiedAt,
      });

      if (error) {
        console.error("Save document failed: ", error);

        store.dispatch({ type: "document/saveError" });

        store.dispatch({
          type: "toast/enqueue",
          payload: {
            id: crypto.randomUUID(),
            message:
              "Failed to save changes. Your edits are still in the editor.",
            variant: "error",
          },
        });

        return;
      }

      if (data) {
        store.dispatch({ type: "document/saveSuccess" });

        const existingTimer = resetTimerByDocument.get(documentId);
        if (existingTimer) clearTimeout(existingTimer);

        const timer = setTimeout(() => {
          const state = store.getState();
          const activeDocument = selectActiveDocument(state);

          if (activeDocument?.id === documentId) {
            store.dispatch({ type: "document/saveReset" });
          }

          resetTimerByDocument.delete(documentId);
        }, 2000);

        resetTimerByDocument.set(documentId, timer);
      }

      nextPayload = queuedByDocument.get(documentId);
    }
  } finally {
    inFlightByDocument.delete(documentId);
  }
}
