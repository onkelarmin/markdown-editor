import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeState, makeStore } from "../lib/test-utils";
import { loadGuestDocument, removeGuestDocument } from "./guestDocument";
import { loadDocuments } from "./loadDocuments";
import { createNewDocument } from "./createDocument";
import { initAuthenticatedFlow } from "./initAuthenticatedFlow";

vi.mock("./loadDocuments", () => ({
  loadDocuments: vi.fn(),
}));

vi.mock("./createDocument", () => ({
  createNewDocument: vi.fn(),
}));

vi.mock("./guestDocument", () => ({
  loadGuestDocument: vi.fn(),
  removeGuestDocument: vi.fn(),
}));

const loadDocumentsMock = vi.mocked(loadDocuments);
const createNewDocumentMock = vi.mocked(createNewDocument);
const loadGuestDocumentMock = vi.mocked(loadGuestDocument);
const removeGuestDocumentMock = vi.mocked(removeGuestDocument);

describe("initAuthenticatedFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads documents first", async () => {
    loadGuestDocumentMock.mockReturnValueOnce(null);

    const store = makeStore(makeState());

    await initAuthenticatedFlow(store);

    expect(loadDocumentsMock).toHaveBeenCalledWith(store);
  });

  it("does not migrate when there is no guest document", async () => {
    loadGuestDocumentMock.mockReturnValueOnce(null);

    const store = makeStore(makeState());

    await initAuthenticatedFlow(store);

    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "document/migrateGuest",
      }),
    );
    expect(createNewDocumentMock).not.toHaveBeenCalled();
    expect(removeGuestDocument).not.toHaveBeenCalled();
  });

  it("does not migrate when the guest document has empty content", async () => {
    loadGuestDocumentMock.mockReturnValueOnce({
      name: "Guest.md",
      content: "",
      createdAt: 1,
      modifiedAt: 2,
    });

    const store = makeStore(makeState());

    await initAuthenticatedFlow(store);

    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: "document/migrateGuest",
      }),
    );
    expect(createNewDocumentMock).not.toHaveBeenCalled();
    expect(removeGuestDocument).not.toHaveBeenCalled();
  });

  it("migrates guest document and removes local draft when create succeeds", async () => {
    const guestDocument = {
      name: "Guest.md",
      content: "Hello",
      createdAt: 1,
      modifiedAt: 2,
    };

    loadGuestDocumentMock.mockReturnValueOnce(guestDocument);
    createNewDocumentMock.mockResolvedValueOnce({ success: true });

    const store = makeStore(makeState());

    await initAuthenticatedFlow(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/migrateGuest",
      payload: { document: guestDocument },
    });

    expect(createNewDocumentMock).toHaveBeenCalledWith(store);
    expect(removeGuestDocumentMock).toHaveBeenCalled();
  });

  it("does not remove local draft when create fails", async () => {
    const guestDocument = {
      name: "Guest.md",
      content: "Hello",
      createdAt: 1,
      modifiedAt: 2,
    };

    loadGuestDocumentMock.mockReturnValueOnce(guestDocument);
    createNewDocumentMock.mockResolvedValueOnce({ success: false });

    const store = makeStore(makeState());

    await initAuthenticatedFlow(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: "document/migrateGuest",
      payload: { document: guestDocument },
    });

    expect(createNewDocumentMock).toHaveBeenCalledWith(store);
    expect(removeGuestDocumentMock).not.toHaveBeenCalled();
  });
});
