import { describe, expect, it } from "vitest";
import { makeDocument, makeState } from "./lib/test-utils";
import {
  selectActiveDocument,
  selectActiveToast,
  selectDisableEditor,
  selectSignInModalOpen,
} from "./selectors";

describe("markdown selectors", () => {
  describe("selectActiveDocument", () => {
    it("returns the active document when it exists", () => {
      const doc1 = makeDocument({ id: "doc-1" });
      const doc2 = makeDocument({ id: "doc-2" });

      const state = makeState({
        documents: [doc1, doc2],
        activeDocumentId: "doc-2",
      });

      expect(selectActiveDocument(state)).toBe(doc2);
    });

    it("returns null when there is no active document", () => {
      const state = makeState({
        documents: [makeDocument()],
        activeDocumentId: null,
      });

      expect(selectActiveDocument(state)).toBeNull();
    });

    it("returns null when activeDocumentId doesn't match any document", () => {
      const state = makeState({
        documents: [makeDocument({ id: "doc-1" })],
        activeDocumentId: "missing-doc",
      });

      expect(selectActiveDocument(state)).toBeNull();
    });
  });

  describe("selectDisableEditor", () => {
    it("return true while documents are loading", () => {
      const state = makeState({
        requests: {
          ...makeState().requests,
          load: {
            status: "pending",
            message: null,
          },
        },
      });

      expect(selectDisableEditor(state)).toBe(true);
    });

    it("return true while document is being deleted", () => {
      const state = makeState({
        requests: {
          ...makeState().requests,
          delete: {
            status: "pending",
          },
        },
      });

      expect(selectDisableEditor(state)).toBe(true);
    });

    it("returns true if there is no active document", () => {
      const state = makeState({ activeDocumentId: null });

      expect(selectDisableEditor(state)).toBe(true);
    });

    it("returns false if there is an active document and no blocking request", () => {
      const state = makeState({ activeDocumentId: "doc-1" });

      expect(selectDisableEditor(state)).toBe(false);
    });
  });

  describe("selectActiveToast", () => {
    it("returns the first toast", () => {
      const toast1 = {
        id: "toast-1",
        message: "First",
        variant: "success" as const,
      };
      const toast2 = {
        id: "toast-2",
        message: "Second",
        variant: "error" as const,
      };

      const state = makeState({
        ui: {
          ...makeState().ui,
          toasts: [toast1, toast2],
        },
      });

      expect(selectActiveToast(state)).toBe(toast1);
    });

    it("returns null if there are no toasts", () => {
      const state = makeState();

      expect(selectActiveToast(state)).toBeNull();
    });
  });

  describe("selectSignInModalOpen", () => {
    it("returns false when the sign-in modal step is closed", () => {
      const state = makeState({
        ui: {
          ...makeState().ui,
          signInModal: { ...makeState().ui.signInModal, step: "closed" },
        },
      });

      expect(selectSignInModalOpen(state)).toBe(false);
    });

    it("returns true when the sign-in modal step is email", () => {
      const state = makeState({
        ui: {
          ...makeState().ui,
          signInModal: { ...makeState().ui.signInModal, step: "email" },
        },
      });

      expect(selectSignInModalOpen(state)).toBe(true);
    });

    it("returns true when the sign-in modal step is otp", () => {
      const state = makeState({
        ui: {
          ...makeState().ui,
          signInModal: { ...makeState().ui.signInModal, step: "otp" },
        },
      });

      expect(selectSignInModalOpen(state)).toBe(true);
    });
  });
});
