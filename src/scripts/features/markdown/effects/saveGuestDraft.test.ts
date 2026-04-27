import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeDocument, makeDom, makeState, makeStore } from "../lib/test-utils";
import { saveGuestDraft } from "./saveGuestDraft";

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saveGuestDraft", () => {
  it("does nothing when there is no document", () => {
    const store = makeStore(makeState({ documents: [] }));
    const dom = makeDom();

    saveGuestDraft(store, dom);

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it("saves the guest document to localStorage", () => {
    const doc = makeDocument({
      id: "test-doc",
      name: "Test.md",
      content: "Hello",
      createdAt: 1,
      modifiedAt: 2,
    });

    const store = makeStore(
      makeState({ documents: [doc], activeDocumentId: "test-doc" }),
    );

    const dom = makeDom();

    saveGuestDraft(store, dom);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "guest-document",
      JSON.stringify({
        name: "Test.md",
        content: "Hello",
        createdAt: 1,
        modifiedAt: 2,
      }),
    );
  });

  it("shows the draft saved info", () => {
    const store = makeStore(makeState({ documents: [makeDocument()] }));
    const dom = makeDom();

    saveGuestDraft(store, dom);

    expect(dom.draftSavedInfo.classList.add).toHaveBeenCalledWith("show");
  });

  it("hides the draft saved info after 2 seconds", () => {
    vi.useFakeTimers();

    const store = makeStore(makeState({ documents: [makeDocument()] }));
    const dom = makeDom();

    saveGuestDraft(store, dom);

    vi.advanceTimersByTime(2000);

    expect(dom.draftSavedInfo.classList.remove).toHaveBeenCalledWith("show");
  });

  it("clears previous hide timer when called again", () => {
    vi.useFakeTimers();

    const store = makeStore(makeState({ documents: [makeDocument()] }));
    const dom = makeDom();

    saveGuestDraft(store, dom);

    vi.advanceTimersByTime(1000);

    saveGuestDraft(store, dom);

    vi.advanceTimersByTime(1999);

    expect(dom.draftSavedInfo.classList.remove).not.toHaveBeenCalledWith(
      "show",
    );

    vi.advanceTimersByTime(1);

    expect(dom.draftSavedInfo.classList.remove).toHaveBeenCalledWith("show");
  });
});
