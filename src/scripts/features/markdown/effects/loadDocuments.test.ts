import { actions } from "astro:actions";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeState, makeStore } from "../lib/test-utils";
import { loadDocuments } from "./loadDocuments";

const getDocumentsMock = vi.mocked(actions.getDocuments);

describe("loadDocuments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches documents/loadStart", async () => {
    getDocumentsMock.mockResolvedValueOnce({
      data: [],
      error: undefined,
    });

    const store = makeStore(makeState());

    await loadDocuments(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "documents/loadStart",
    });
  });

  it("dispatches loadSuccess with documents marked as created", async () => {
    getDocumentsMock.mockResolvedValueOnce({
      data: [
        {
          id: "doc-1",
          name: "First.md",
          content: "Hello",
          order: 1,
          createdAt: 1,
          modifiedAt: 2,
        },
      ],
      error: undefined,
    });

    const store = makeStore(makeState());

    await loadDocuments(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "documents/loadSuccess",
      payload: {
        documents: [
          {
            id: "doc-1",
            name: "First.md",
            content: "Hello",
            order: 1,
            createdAt: 1,
            modifiedAt: 2,
            persistStatus: "created",
          },
        ],
      },
    });
  });

  it("dispatches loadError when loading fails", async () => {
    getDocumentsMock.mockResolvedValueOnce({
      data: undefined,
      error: {
        type: "AstroActionError",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        name: "ActionError",
        message: "DB failed",
      } as any,
    });

    const store = makeStore(makeState());

    await loadDocuments(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "documents/loadError",
      payload: { message: "Failed to load documents." },
    });
  });
});
