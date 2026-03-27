// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import { reorder } from "../src/utils/sort.js";

describe("reorder", () => {
  it("should return items unchanged when no order is provided", () => {
    expect(reorder(["c", "a", "b"])).toEqual(["c", "a", "b"]);
  });

  it("should return items unchanged when order is undefined", () => {
    expect(reorder(["c", "a", "b"], undefined)).toEqual(["c", "a", "b"]);
  });

  it("should return items unchanged when order is empty", () => {
    expect(reorder(["c", "a", "b"], [])).toEqual(["c", "a", "b"]);
  });

  it("should reorder items according to the given order", () => {
    expect(reorder(["c", "a", "b"], ["a", "b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("should place ordered items before unordered ones", () => {
    expect(reorder(["d", "c", "a", "b"], ["a", "c"])).toEqual(["a", "c", "d", "b"]);
  });

  it("should skip order items not present in the items list", () => {
    expect(reorder(["a", "b"], ["x", "a", "y"])).toEqual(["a", "b"]);
  });

  it("should handle all items in order", () => {
    expect(reorder(["b", "a"], ["a", "b"])).toEqual(["a", "b"]);
  });

  it("should handle no overlap between items and order", () => {
    expect(reorder(["a", "b"], ["x", "y"])).toEqual(["a", "b"]);
  });
});
