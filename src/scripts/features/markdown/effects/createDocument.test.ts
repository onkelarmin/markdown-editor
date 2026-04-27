import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDocumentMock,
  makeDocument,
  makeState,
  makeStore,
} from "../lib/test-utils";
import { createNewDocument } from "./createDocument";

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(crypto, "randomUUID").mockReturnValue("toast-1-2-3-4");
});

describe("createNewDocument", () => {
  it("returns { success: false } when there is no active document", async () => {
    const store = makeStore(
      makeState({ documents: [], activeDocumentId: null }),
    );

    const result = await createNewDocument(store);

    expect(createDocumentMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("creates the new document, dispatches document/createSuccess and returns { success: true }", async () => {
    createDocumentMock.mockResolvedValueOnce({
      data: { id: "doc-2" },
      error: null,
    });

    const doc1 = makeDocument({
      id: "doc-1",
    });
    const doc2 = makeDocument({
      id: "doc-2",
    });

    const store = makeStore(
      makeState({ documents: [doc1, doc2], activeDocumentId: "doc-2" }),
    );

    const result = await createNewDocument(store);

    expect(createDocumentMock).toHaveBeenCalledWith({
      id: doc2.id,
      name: doc2.name,
      content: doc2.content,
      order: doc2.order,
      createdAt: doc2.createdAt,
      modifiedAt: doc2.modifiedAt,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/createSuccess",
      payload: { id: doc2.id },
    });
    expect(result.success).toBe(true);
  });

  it("it dispatches document/createError, enqueues a toast and returns { success: false } when DB creation fails", async () => {
    createDocumentMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Failed" },
    });

    const doc1 = makeDocument({
      id: "doc-1",
    });
    const doc2 = makeDocument({
      id: "doc-2",
    });

    const store = makeStore(
      makeState({ documents: [doc1, doc2], activeDocumentId: "doc-1" }),
    );

    const result = await createNewDocument(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/createError",
      payload: { id: doc1.id },
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: "toast/enqueue",
      payload: {
        id: "toast-1-2-3-4",
        message: "Failed to create document.",
        variant: "error",
      },
    });
    expect(result.success).toBe(false);
  });

  it("returns { success: false } when createDocument throws", async () => {
    createDocumentMock.mockRejectedValueOnce(new Error("Network failed"));

    const doc1 = makeDocument({
      id: "doc-1",
    });

    const store = makeStore(
      makeState({ documents: [doc1], activeDocumentId: "doc-1" }),
    );

    const result = await createNewDocument(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/createError",
      payload: { id: doc1.id },
    });
    expect(result.success).toBe(false);
  });
});
