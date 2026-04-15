import { selectCanPersistDocuments } from "../selectors";
import type { Store } from "../store";
import type { DOM } from "../ui/dom";
import { saveActiveDocument } from "./saveDocument";
import { saveGuestDraft } from "./saveGuestDraft";

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function queueAutoSave(store: Store, dom: DOM, delay = 600) {
  if (saveTimer) clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    if (selectCanPersistDocuments(store.getState())) {
      void saveActiveDocument(store);
    } else {
      saveGuestDraft(store, dom);
    }
  }, delay);
}
