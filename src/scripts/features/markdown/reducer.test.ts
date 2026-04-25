import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import { makeDocument, makeState } from "./lib/test-utils";

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

describe("markdown reducer - document/updateContent", () => {
  it("updates content of active document", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      content: "Content of Document 1",
    });

    const doc2 = makeDocument({
      id: "doc-2",
      content: "Content of Document 2",
    });

    const state = makeState({
      documents: [doc1, doc2],
      activeDocumentId: "doc-2",
    });

    const nextState = reducer(state, {
      type: "document/updateContent",
      payload: { content: "New content" },
    });

    expect(nextState.documents[0]).toBe(doc1);
    expect(nextState.documents[1].content).toBe("New content");
  });

  it("updates the modifiedAt timestamp", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      content: "Content of Document 1",
    });

    const state = makeState({
      documents: [doc1],
      activeDocumentId: "doc-1",
    });

    const nextState = reducer(state, {
      type: "document/updateContent",
      payload: { content: "New content" },
    });

    expect(nextState.documents[0].modifiedAt).toBeGreaterThan(doc1.modifiedAt);
  });

  it("leaves state unchanged if there is no active document", () => {
    const state = makeState({ activeDocumentId: null });

    const nextState = reducer(state, {
      type: "document/updateContent",
      payload: { content: "New content" },
    });

    expect(nextState).toBe(state);
  });
});

describe("markdown reducer - document/updateNameDraft", () => {
  it("updates the draft value", () => {
    const state = makeState({
      documents: [makeDocument()],
      editor: {
        nameDraft: "Document-1?.md",
        nameError: "Invalid character",
      },
    });

    const nextState = reducer(state, {
      type: "document/updateNameDraft",
      payload: { name: "New-name.md" },
    });

    expect(nextState.editor.nameDraft).toBe("New-name.md");
    expect(nextState.editor.nameError).toBeNull();
  });

  it("sets nameError when payload has an error", () => {
    const state = makeState({
      documents: [makeDocument()],
      editor: {
        nameDraft: "Document-1.md",
        nameError: "",
      },
    });

    const nextState = reducer(state, {
      type: "document/updateNameDraft",
      payload: { name: "", error: "Can't be empty" },
    });

    expect(nextState.editor.nameDraft).toBe("");
    expect(nextState.editor.nameError).toBe("Can't be empty");
  });
});

describe("markdown reducer - document/commitName", () => {
  it("commits a unique name to the active document only", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Second.md",
    });

    const state = makeState({
      documents: [doc1, doc2],
      activeDocumentId: "doc-2",
    });

    const nextState = reducer(state, {
      type: "document/commitName",
      payload: { name: "New-name.md" },
    });

    expect(nextState.documents[0]).toBe(doc1);
    expect(nextState.documents[1].name).toBe("New-name.md");
    expect(nextState.editor.nameDraft).toBe("New-name.md");
    expect(nextState.editor.nameError).toBeNull();
    expect(nextState.documents[1].modifiedAt).toBeGreaterThan(doc2.modifiedAt);
  });

  it("does not commit duplicate names and sets error", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "Current.md",
    });

    const doc2 = makeDocument({
      id: "doc-2",
      name: "Taken.md",
    });

    const state = makeState({
      documents: [doc1, doc2],
      activeDocumentId: "doc-1",
    });

    const nextState = reducer(state, {
      type: "document/commitName",
      payload: {
        name: "Taken.md",
      },
    });

    expect(nextState.documents[0].name).toBe("Current.md");
    expect(nextState.documents[1]).toBe(doc2);
    expect(nextState.editor.nameError).toBe("Document name already exists");
  });

  it("returns the same object when there is no active document", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
    });

    const state = makeState({ documents: [doc1], activeDocumentId: null });

    const nextState = reducer(state, {
      type: "document/commitName",
      payload: { name: "New-name.md" },
    });

    expect(nextState).toBe(state);
  });

  it("returns the same object when the submitted name is unchanged", () => {
    const doc1 = makeDocument({
      id: "doc-1",
      name: "First.md",
    });

    const state = makeState({ documents: [doc1], activeDocumentId: null });

    const nextState = reducer(state, {
      type: "document/commitName",
      payload: { name: "First.md" },
    });

    expect(nextState).toBe(state);
  });
});
