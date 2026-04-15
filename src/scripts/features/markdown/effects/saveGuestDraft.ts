import type { Store } from "../store";
import type { GuestDocument } from "../types";
import type { DOM } from "../ui/dom";

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function saveGuestDraft(store: Store, dom: DOM) {
  const guestDraft = store.getState().documents[0];

  const guestDocument: GuestDocument = {
    name: guestDraft.name,
    content: guestDraft.content,
    createdAt: guestDraft.createdAt,
    modifiedAt: guestDraft.modifiedAt,
  };

  localStorage.setItem("guest-document", JSON.stringify(guestDocument));

  dom.draftSavedInfo.classList.add("show");

  if (hideTimer) clearTimeout(hideTimer);

  hideTimer = setTimeout(() => {
    dom.draftSavedInfo.classList.remove("show");
  }, 2000);
}
