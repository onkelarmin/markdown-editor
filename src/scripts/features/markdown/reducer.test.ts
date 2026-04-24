import { describe, expect, it } from "vitest";
import type { Document, State } from "./types";
import { reducer } from "./reducer";

function makeDocument(overrides: Partial<Document> = {}): Document {
  return {
    id: "doc-1",
    name: "Document-1.md",
    content: "",
    order: 1,
    createdAt: 1,
    modifiedAt: 1,
    persistStatus: "created",
    ...overrides,
  };
}

function makeState(overrides: Partial<State> = {}): State {
  return {
    auth: {
      status: "guest",
      userId: null,
      email: null,
    },

    documents: [],
    activeDocumentId: null,

    ui: {
      sidebarOpen: false,
      view: "markdown",
      isDeleteModalOpen: false,
      theme: "light",
      themeSource: "system",
      toasts: [],
      signInModal: {
        step: "closed",
        email: "",
        inputError: null,
        processError: null,
        status: "idle",
        resendStatus: "idle",
      },
    },

    editor: {
      nameDraft: "",
      nameError: null,
    },

    requests: {
      load: {
        status: "idle",
        message: null,
      },
      save: {
        status: "idle",
      },
      delete: {
        status: "idle",
      },
    },
    ...overrides,
  };
}

describe("markdown reducer - document/deleteOptimistic", () => {
  it("closes the delete modal if the document doesn't exist", () => {
    const state = makeState({
      documents: [makeDocument()],
      activeDocumentId: "doc-1",
    });

    const nextState = reducer(state, {
      type: "document/deleteOptimistic",
      payload: {
        id: "missing-doc",
      },
    });

    expect(nextState.ui.isDeleteModalOpen).toBe(false);
    expect(nextState.documents).toEqual(state.documents);
    expect(nextState.activeDocumentId).toBe("doc-1");
  });

  it("removed the only document and clears active state", () => {
    const state = makeState({
      documents: [makeDocument()],
      activeDocumentId: "doc-1",
    });

    const nextState = reducer(state, {
      type: "document/deleteOptimistic",
      payload: {
        id: "doc-1",
      },
    });

    expect(nextState.ui.isDeleteModalOpen).toBe(false);
    expect(nextState.documents).toEqual([]);
    expect(nextState.activeDocumentId).toBeNull();
    expect(nextState.editor.nameDraft).toBe("");
  });

  it("deletes the first document, selects the next one, and reindexes orders", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const doc3 = makeDocument({
      id: "doc-3",
      name: "Third.md",
      order: 3,
    });

    const state = makeState({
      documents: [doc1, doc2, doc3],
      activeDocumentId: "doc-1",
      editor: {
        nameDraft: "First.md",
        nameError: null,
      },
    });

    const nextState = reducer(state, {
      type: "document/deleteOptimistic",
      payload: { id: "doc-1" },
    });

    expect(nextState.ui.isDeleteModalOpen).toBe(false);
    expect(nextState.documents.map((doc) => doc.id)).toEqual([
      "doc-2",
      "doc-3",
    ]);
    expect(nextState.documents.map((doc) => doc.order)).toEqual([1, 2]);
    expect(nextState.activeDocumentId).toBe("doc-2");
    expect(nextState.editor.nameDraft).toBe("Second.md");
  });

  it("deletes the last document and selects the previous one", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const doc3 = makeDocument({
      id: "doc-3",
      name: "Third.md",
      order: 3,
    });

    const state = makeState({
      documents: [doc1, doc2, doc3],
      activeDocumentId: "doc-3",
      editor: {
        nameDraft: "Third.md",
        nameError: null,
      },
    });

    const nextState = reducer(state, {
      type: "document/deleteOptimistic",
      payload: { id: "doc-3" },
    });

    expect(nextState.ui.isDeleteModalOpen).toBe(false);
    expect(nextState.documents.map((doc) => doc.id)).toEqual([
      "doc-1",
      "doc-2",
    ]);
    expect(nextState.documents.map((doc) => doc.order)).toEqual([1, 2]);
    expect(nextState.activeDocumentId).toBe("doc-2");
    expect(nextState.editor.nameDraft).toBe("Second.md");
  });

  it("deletes the middle document and selects the first one", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const doc3 = makeDocument({
      id: "doc-3",
      name: "Third.md",
      order: 3,
    });

    const state = makeState({
      documents: [doc1, doc2, doc3],
      activeDocumentId: "doc-2",
      editor: {
        nameDraft: "Second.md",
        nameError: null,
      },
    });

    const nextState = reducer(state, {
      type: "document/deleteOptimistic",
      payload: { id: "doc-2" },
    });

    expect(nextState.documents.map((doc) => doc.id)).toEqual([
      "doc-1",
      "doc-3",
    ]);
    expect(nextState.documents.map((doc) => doc.order)).toEqual([1, 2]);
    expect(nextState.activeDocumentId).toBe("doc-1");
    expect(nextState.editor.nameDraft).toBe("First.md");
  });
});

describe("markdown reducer - document/reorder", () => {
  it("reorders documents based on orderedIds and normalizes order values", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const doc3 = makeDocument({
      id: "doc-3",
      name: "Third.md",
      order: 3,
    });

    const state = makeState({
      documents: [doc1, doc2, doc3],
      activeDocumentId: "doc-1",
    });

    const nextState = reducer(state, {
      type: "document/reorder",
      payload: { orderedIds: ["doc-3", "doc-1", "doc-2"] },
    });

    expect(nextState.documents.map((doc) => doc.id)).toEqual([
      "doc-3",
      "doc-1",
      "doc-2",
    ]);
    expect(nextState.documents.map((doc) => doc.order)).toEqual([1, 2, 3]);
    expect(nextState.activeDocumentId).toBe("doc-1");
    expect(nextState).not.toBe(state);
  });

  it("does not mutate the orginial document objects", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const state = makeState({
      documents: [doc1, doc2],
    });

    const nextState = reducer(state, {
      type: "document/reorder",
      payload: { orderedIds: ["doc-2", "doc-1"] },
    });

    expect(nextState.documents[0].order).toBe(1);
    expect(nextState.documents[1].order).toBe(2);

    expect(nextState.documents[0]).not.toBe(doc2);
    expect(nextState.documents[1]).not.toBe(doc1);
  });

  it("ignores missing orderedIds", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
      order: 1,
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
      order: 2,
    });

    const state = makeState({
      documents: [doc1, doc2],
    });

    const nextState = reducer(state, {
      type: "document/reorder",
      payload: { orderedIds: ["doc-2", "missing-doc", "doc-1"] },
    });

    expect(nextState.documents.map((doc) => doc.id)).toEqual([
      "doc-2",
      "doc-1",
    ]);
    expect(nextState.documents.map((doc) => doc.order)).toEqual([1, 2]);
  });
});
