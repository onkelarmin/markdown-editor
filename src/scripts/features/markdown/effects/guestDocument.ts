import { guestDocumentSchema } from "../schema";
import type { GuestDocument } from "../types";

export function loadGuestDocument(): GuestDocument | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("guest-document");
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    const result = guestDocumentSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function createGuestDocument(): GuestDocument {
  const now = Date.now();

  return {
    name: "undefined.md",
    content: "",
    createdAt: now,
    modifiedAt: now,
  };
}

export function removeGuestDocument() {
  localStorage.removeItem("guest-document");
}
