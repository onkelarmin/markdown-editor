import { actions } from "astro:actions";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GuestDocument } from "../types";
import { makeState, makeStore } from "../lib/test-utils";
import { initAuthenticatedFlow } from "./initAuthenticatedFlow";

const getDocumentsMock = vi.mocked(actions.getDocuments);
const createDocumentMock = vi.mocked(actions.createDocument);

describe("initAuthenticatedFlow integreation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads DB documents, migrates guest draft, creates it in DB and removes local draft on success", async () => {
    const guestDocument: GuestDocument = {
      name: "Guest.md",
      content: "Guest draft content",
      createdAt: 100,
      modifiedAt: 200,
    };

    vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce(
      JSON.stringify(guestDocument),
    );
    vi.spyOn(Storage.prototype, "removeItem");

    getDocumentsMock.mockResolvedValueOnce({
      data: [],
      error: undefined,
    });

    createDocumentMock.mockResolvedValueOnce({
      data: { id: "created-doc-id" },
      error: undefined,
    });

    const store = makeStore(
      makeState({
        auth: {
          status: "authenticated",
          userId: "user-1",
          email: "test@example.com",
        },
        documents: [],
        activeDocumentId: null,
      }),
    );

    await initAuthenticatedFlow(store);

    expect(getDocumentsMock).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/migrateGuest",
      payload: { document: guestDocument },
    });

    expect(createDocumentMock).toHaveBeenCalled();

    expect(localStorage.removeItem).toHaveBeenCalledWith("guest-document");
  });

  it("does not remove local draft when DB create fails", async () => {
    const guestDocument: GuestDocument = {
      name: "Guest.md",
      content: "Guest draft content",
      createdAt: 100,
      modifiedAt: 200,
    };

    vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce(
      JSON.stringify(guestDocument),
    );
    vi.spyOn(Storage.prototype, "removeItem");

    getDocumentsMock.mockResolvedValueOnce({
      data: [],
      error: undefined,
    });

    createDocumentMock.mockResolvedValueOnce({
      data: undefined,
      error: {
        type: "AstroActionError",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        name: "ActionError",
        message: "Create failed",
      } as any,
    });

    const store = makeStore(
      makeState({
        auth: {
          status: "authenticated",
          userId: "user-1",
          email: "test@example.com",
        },
        documents: [],
        activeDocumentId: null,
      }),
    );

    await initAuthenticatedFlow(store);

    expect(createDocumentMock).toHaveBeenCalled();

    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});
