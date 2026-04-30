import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteDocument } from "./deleteDocument";
import { makeDocument, makeState, makeStore } from "../lib/test-utils";
import { actions } from "astro:actions";
import { loadDocuments } from "./loadDocuments";

vi.mock("./loadDocuments", () => ({
  loadDocuments: vi.fn(),
}));

const deleteDocumentMock = vi.mocked(actions.deleteDocument);
const loadDocumentsMock = vi.mocked(loadDocuments);

describe("deleteDocument", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(crypto, "randomUUID").mockReturnValueOnce("1-2-3-4-5");
  });

  it("calls deleteDocument action and dispatches deleteSuccess on success", async () => {
    const doc1 = makeDocument({ id: "doc-1" });
    const doc2 = makeDocument({ id: "doc-2" });
    const store = makeStore(makeState({ documents: [doc1, doc2] }));

    deleteDocumentMock.mockResolvedValueOnce({
      data: { deletedId: "doc-1", fallbackDocument: null },
      error: undefined,
    });

    await deleteDocument(store, doc1);

    expect(deleteDocumentMock).toHaveBeenCalledWith({ id: "doc-1" });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/deleteSuccess",
      payload: { result: { deletedId: "doc-1", fallbackDocument: null } },
    });
  });

  it("dispatches error state, enqueues toast, and reloads documents when action returns an error", async () => {
    const doc1 = makeDocument({ id: "doc-1" });
    const store = makeStore(makeState({ documents: [doc1] }));

    deleteDocumentMock.mockResolvedValueOnce({
      data: undefined,
      error: {
        type: "AstroActionError",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        name: "ActionError",
        message: "DB failed",
      } as any,
    });

    await deleteDocument(store, doc1);

    expect(deleteDocumentMock).toHaveBeenCalledWith({ id: "doc-1" });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "toast/enqueue",
      payload: {
        id: "1-2-3-4-5",
        message: "Failed to delete document.",
        variant: "error",
      },
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/deleteError",
    });

    expect(loadDocumentsMock).toHaveBeenCalledWith(store);
  });

  it("dispatches error state, enqueues toast, and reloads documents when action throws", async () => {
    const doc1 = makeDocument({ id: "doc-1" });
    const store = makeStore(makeState({ documents: [doc1] }));

    deleteDocumentMock.mockRejectedValueOnce(new Error("Network failed"));

    await deleteDocument(store, doc1);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "toast/enqueue",
      payload: {
        id: "1-2-3-4-5",
        message: "Failed to delete document.",
        variant: "error",
      },
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/deleteError",
    });

    expect(loadDocumentsMock).toHaveBeenCalledWith(store);
  });
});
