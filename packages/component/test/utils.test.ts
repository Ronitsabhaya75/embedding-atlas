// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import {
  piecewiseLinear,
  pointDistance,
  polygonToPath,
  boundingRect,
  deepEquals,
  cacheKeyForObject,
} from "../src/lib/utils.js";

describe("piecewiseLinear", () => {
  it("should return 0 when no points are provided", () => {
    expect(piecewiseLinear(5)).toBe(0);
  });

  it("should return the first point's y when x is before all points", () => {
    expect(piecewiseLinear(-5, [0, 1], [2, 5], [3, -1])).toBe(1);
  });

  it("should return the last point's y when x is after all points", () => {
    expect(piecewiseLinear(10, [0, 1], [2, 5], [3, -1])).toBe(-1);
  });

  it("should return exact y at a defined point", () => {
    expect(piecewiseLinear(0, [0, 1], [2, 5], [3, -1])).toBe(1);
    expect(piecewiseLinear(2, [0, 1], [2, 5], [3, -1])).toBe(5);
    expect(piecewiseLinear(3, [0, 1], [2, 5], [3, -1])).toBe(-1);
  });

  it("should interpolate linearly between points", () => {
    // Midpoint between [0, 1] and [2, 5] => x=1, y=3
    expect(piecewiseLinear(1, [0, 1], [2, 5], [3, -1])).toBe(3);
  });

  it("should handle a single point", () => {
    expect(piecewiseLinear(0, [5, 10])).toBe(10);
    expect(piecewiseLinear(100, [5, 10])).toBe(10);
    expect(piecewiseLinear(-100, [5, 10])).toBe(10);
  });
});

describe("pointDistance", () => {
  it("should return 0 for the same point", () => {
    expect(pointDistance({ x: 3, y: 4 }, { x: 3, y: 4 })).toBe(0);
  });

  it("should compute distance correctly", () => {
    expect(pointDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("should handle negative coordinates", () => {
    expect(pointDistance({ x: -1, y: -1 }, { x: 2, y: 3 })).toBe(5);
  });
});

describe("polygonToPath", () => {
  it("should generate a valid SVG path", () => {
    const polygon = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ];
    expect(polygonToPath(polygon)).toBe("M 0,0 L 10,0 L 10,10 Z");
  });

  it("should handle a single point", () => {
    expect(polygonToPath([{ x: 5, y: 5 }])).toBe("M 5,5 Z");
  });
});

describe("boundingRect", () => {
  it("should compute the bounding rectangle of points", () => {
    const points = [
      { x: 1, y: 2 },
      { x: -3, y: 5 },
      { x: 4, y: -1 },
    ];
    expect(boundingRect(points)).toEqual({
      xMin: -3,
      yMin: -1,
      xMax: 4,
      yMax: 5,
    });
  });

  it("should handle a single point", () => {
    expect(boundingRect([{ x: 7, y: 3 }])).toEqual({
      xMin: 7,
      yMin: 3,
      xMax: 7,
      yMax: 3,
    });
  });
});

describe("deepEquals", () => {
  it("should return true for identical primitives", () => {
    expect(deepEquals(1, 1)).toBe(true);
    expect(deepEquals("a", "a")).toBe(true);
    expect(deepEquals(null, null)).toBe(true);
    expect(deepEquals(true, true)).toBe(true);
  });

  it("should return false for different primitives", () => {
    expect(deepEquals(1, 2)).toBe(false);
    expect(deepEquals("a", "b")).toBe(false);
    expect(deepEquals(null, undefined)).toBe(false);
  });

  it("should compare nested objects deeply", () => {
    expect(deepEquals({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEquals({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it("should compare arrays", () => {
    expect(deepEquals([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEquals([1, 2], [1, 2, 3])).toBe(false);
  });

  it("should return false for different key counts", () => {
    expect(deepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("should return false when one side is null", () => {
    expect(deepEquals(null, { a: 1 })).toBe(false);
    expect(deepEquals({ a: 1 }, null)).toBe(false);
  });
});

describe("cacheKeyForObject", () => {
  it("should return a consistent hash for the same object", async () => {
    const key1 = await cacheKeyForObject({ a: 1, b: "test" });
    const key2 = await cacheKeyForObject({ a: 1, b: "test" });
    expect(key1).toBe(key2);
  });

  it("should return different hashes for different objects", async () => {
    const key1 = await cacheKeyForObject({ a: 1 });
    const key2 = await cacheKeyForObject({ a: 2 });
    expect(key1).not.toBe(key2);
  });

  it("should return a hex string", async () => {
    const key = await cacheKeyForObject({ test: true });
    expect(key).toMatch(/^[0-9a-f]+$/);
  });
});
