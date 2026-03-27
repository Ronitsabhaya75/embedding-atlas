// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import { findUnusedId } from "../src/utils/identifier.js";

describe("findUnusedId", () => {
  it("should return '1' for an empty object with no prefix", () => {
    expect(findUnusedId({})).toBe("1");
  });

  it("should return '1' for an empty object with prefix", () => {
    expect(findUnusedId({}, "chart")).toBe("chart1");
  });

  it("should skip existing keys", () => {
    expect(findUnusedId({ "1": true, "2": true })).toBe("3");
  });

  it("should skip existing keys with prefix", () => {
    expect(findUnusedId({ chart1: true, chart2: true }, "chart")).toBe("chart3");
  });

  it("should find the first gap", () => {
    expect(findUnusedId({ "1": true, "3": true })).toBe("2");
  });

  it("should handle non-sequential existing keys", () => {
    expect(findUnusedId({ item1: "a", item2: "b", item3: "c" }, "item")).toBe("item4");
  });
});
