// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import {
  defaultCategoryColors,
} from "../src/component.js";

describe("embedding-atlas exports", () => {
  it("should export defaultCategoryColors as a function", () => {
    expect(typeof defaultCategoryColors).toBe("function");
  });

  it("defaultCategoryColors should return an array of colors", () => {
    const colors = defaultCategoryColors(5);
    expect(Array.isArray(colors)).toBe(true);
    expect(colors.length).toBe(5);
  });
});
