// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import { defaultCategoryColors, parseColorNormalizedRgb } from "../src/lib/colors.js";

describe("defaultCategoryColors", () => {
  it("should return 1 color for count < 1", () => {
    const result = defaultCategoryColors(0);
    expect(result).toHaveLength(1);
  });

  it("should return exact count from category10 palette for count <= 10", () => {
    const result = defaultCategoryColors(5);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe("#1f77b4");
  });

  it("should return 10 colors for count = 10", () => {
    const result = defaultCategoryColors(10);
    expect(result).toHaveLength(10);
  });

  it("should use category20 palette for count between 11 and 20", () => {
    const result = defaultCategoryColors(15);
    expect(result).toHaveLength(15);
    // category20 starts with #1f77b4, #aec7e8, ...
    expect(result[1]).toBe("#aec7e8");
  });

  it("should return 20 colors for count = 20", () => {
    const result = defaultCategoryColors(20);
    expect(result).toHaveLength(20);
  });

  it("should wrap category20 for count > 20", () => {
    const result = defaultCategoryColors(25);
    expect(result).toHaveLength(25);
    // First 20 should match category20, then wrap
    expect(result[20]).toBe(result[0]);
  });
});

describe("parseColorNormalizedRgb", () => {
  it("should parse a hex color to normalized values", () => {
    const result = parseColorNormalizedRgb("#ff0000");
    expect(result.r).toBeCloseTo(1.0, 1);
    expect(result.g).toBeCloseTo(0.0, 1);
    expect(result.b).toBeCloseTo(0.0, 1);
    expect(result.a).toBe(1);
  });

  it("should parse white correctly", () => {
    const result = parseColorNormalizedRgb("#ffffff");
    expect(result.r).toBeCloseTo(1.0, 1);
    expect(result.g).toBeCloseTo(1.0, 1);
    expect(result.b).toBeCloseTo(1.0, 1);
  });

  it("should parse black correctly", () => {
    const result = parseColorNormalizedRgb("#000000");
    expect(result.r).toBeCloseTo(0.0, 1);
    expect(result.g).toBeCloseTo(0.0, 1);
    expect(result.b).toBeCloseTo(0.0, 1);
  });

  it("should parse named colors", () => {
    const result = parseColorNormalizedRgb("blue");
    expect(result.b).toBeCloseTo(1.0, 1);
    expect(result.r).toBeCloseTo(0.0, 1);
  });
});
