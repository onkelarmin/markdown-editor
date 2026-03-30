import type { Store } from "../store";
import { saveActiveDocument } from "./saveDocument";

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function queueAutoSave(store: Store, delay = 600) {
  if (saveTimer) clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    saveActiveDocument(store);
  }, delay);
}
