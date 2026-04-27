import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveActiveDocument } from "./saveDocument";
import { saveGuestDraft } from "./saveGuestDraft";
import { makeState, makeStore } from "../lib/test-utils";
import { queueAutoSave } from "./autoSave";

vi.mock("./saveDocument", () => ({
  saveActiveDocument: vi.fn(),
}));

vi.mock("./saveGuestDraft", () => ({
  saveGuestDraft: vi.fn(),
}));

const saveActiveDocumentMock = vi.mocked(saveActiveDocument);
const saveGuestDraftMock = vi.mocked(saveGuestDraft);

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("queueAutoSave", () => {
  it("doesn't save before the delay", () => {
    const store = makeStore(
      makeState({
        auth: {
          status: "authenticated",
          userId: "user-1",
          email: "user-1@test.com",
        },
      }),
    );

    const dom = {} as any;

    queueAutoSave(store, dom, 600);

    vi.advanceTimersByTime(599);

    expect(saveActiveDocumentMock).not.toHaveBeenCalled();
    expect(saveGuestDraftMock).not.toHaveBeenCalled();
  });

  it("saves to the database after the delay when authenticated", () => {
    const store = makeStore(
      makeState({
        auth: {
          status: "authenticated",
          userId: "user-1",
          email: "user-1@test.com",
        },
      }),
    );

    const dom = {} as any;

    queueAutoSave(store, dom, 600);

    vi.advanceTimersByTime(600);

    expect(saveActiveDocumentMock).toHaveBeenCalled();
    expect(saveGuestDraftMock).not.toHaveBeenCalled();
  });

  it("saves a guest draft after the delay when not authenticated", () => {
    const store = makeStore(
      makeState({
        auth: {
          status: "guest",
          userId: null,
          email: null,
        },
      }),
    );

    const dom = {} as any;

    queueAutoSave(store, dom, 600);

    vi.advanceTimersByTime(600);

    expect(saveActiveDocumentMock).not.toHaveBeenCalled();
    expect(saveGuestDraftMock).toHaveBeenCalled();
  });

  it("debounces multiple autosave requests", () => {
    const store = makeStore(
      makeState({
        auth: {
          status: "authenticated",
          userId: "user-1",
          email: "user-1@test.com",
        },
      }),
    );

    const dom = {} as any;

    queueAutoSave(store, dom, 600);
    vi.advanceTimersByTime(300);

    queueAutoSave(store, dom, 600);
    vi.advanceTimersByTime(599);

    expect(saveActiveDocumentMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(saveActiveDocumentMock).toHaveBeenCalled();
  });
});
