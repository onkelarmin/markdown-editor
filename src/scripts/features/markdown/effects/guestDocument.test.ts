import { describe, expect, it, vi } from "vitest";
import { loadGuestDocument } from "./guestDocument";

describe("loadGuestDocument", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

  it("returns null when no guest document exists in localStorage", () => {
    getItemSpy.mockReturnValueOnce(null);

    const result = loadGuestDocument();

    expect(result).toBeNull();
  });

  it("returns parsed guest document when valid", () => {
    const validDoc = {
      name: "Test.md",
      content: "Hello",
      createdAt: 1,
      modifiedAt: 2,
    };

    getItemSpy.mockReturnValueOnce(JSON.stringify(validDoc));

    const result = loadGuestDocument();

    expect(result).toEqual(validDoc);
  });

  it("returns null when stored value is invalid JSON", () => {
    getItemSpy.mockReturnValueOnce("invalid-json");

    const result = loadGuestDocument();

    expect(result).toBeNull();
  });

  it("returns null when stored value doesn't match schema", () => {
    getItemSpy.mockReturnValueOnce(JSON.stringify({ wrong: "shape" }));

    const result = loadGuestDocument();

    expect(result).toBeNull();
  });
});
