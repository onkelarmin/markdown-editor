import { beforeEach, describe, expect, it, vi } from "vitest";
import { actions } from "astro:actions";
import { makeDocument, makeState, makeStore } from "../lib/test-utils";
import { saveActiveDocument } from "./saveDocument";

const saveDocumentMock = vi.mocked(actions.saveDocument);

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();

  vi.spyOn(crypto, "randomUUID").mockReturnValue("toast-1-2-3-4");
});

describe("saveActiveDocument", () => {
  it("dispatches saveReset and does not call the API when there is no active document", async () => {
    const store = makeStore(
      makeState({ documents: [], activeDocumentId: null }),
    );

    await saveActiveDocument(store);

    expect(saveDocumentMock).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/saveReset",
    });
  });

  it("saves the active document and dispatches success/reset", async () => {
    saveDocumentMock.mockResolvedValueOnce({
      data: { id: "doc-1" },
      error: undefined,
    });

    const store = makeStore(
      makeState({
        documents: [
          makeDocument({
            id: "doc-1",
            name: "Test.md",
            content: "Hello",
            modifiedAt: 123,
          }),
        ],
        activeDocumentId: "doc-1",
      }),
    );

    await saveActiveDocument(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/saveStart",
    });

    expect(saveDocumentMock).toHaveBeenCalledWith({
      id: "doc-1",
      name: "Test.md",
      content: "Hello",
      modifiedAt: 123,
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/saveSuccess",
    });

    vi.advanceTimersByTime(2000);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/saveReset",
    });
  });

  it("dispatches error state and toast when save fails", async () => {
    saveDocumentMock.mockResolvedValueOnce({
      data: undefined,
      error: {
        type: "AstroActionError",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        name: "ActionError",
        message: "Failed",
      },
    });

    const store = makeStore(
      makeState({
        documents: [
          makeDocument({
            id: "doc-1",
          }),
        ],
        activeDocumentId: "doc-1",
      }),
    );

    await saveActiveDocument(store);

    expect(store.dispatch).toHaveBeenCalledWith({ type: "document/saveStart" });
    expect(store.dispatch).toHaveBeenCalledWith({ type: "document/saveError" });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "toast/enqueue",
      payload: {
        id: "toast-1-2-3-4",
        message: "Failed to save changes. Your edits are still in the editor.",
        variant: "error",
      },
    });
  });
});
