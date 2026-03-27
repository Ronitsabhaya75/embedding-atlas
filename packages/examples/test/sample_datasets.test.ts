// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import {
  SplitMix64,
  RNG,
  randomUniform,
  randomNormal,
  randomChoices,
  generateSampleDataset,
} from "../src/sample_datasets.js";

describe("SplitMix64", () => {
  it("should produce deterministic output with the same seed", () => {
    const a = new SplitMix64(42);
    const b = new SplitMix64(42);
    expect(a.next()).toBe(b.next());
    expect(a.next()).toBe(b.next());
    expect(a.next()).toBe(b.next());
  });

  it("should produce different output with different seeds", () => {
    const a = new SplitMix64(1);
    const b = new SplitMix64(2);
    expect(a.next()).not.toBe(b.next());
  });

  it("nextNumber should return a finite number", () => {
    const rng = new SplitMix64(100);
    const val = rng.nextNumber();
    expect(Number.isFinite(val)).toBe(true);
    expect(val).toBeGreaterThanOrEqual(0);
  });
});

describe("RNG", () => {
  it("should return values in [0, 1)", () => {
    const rng = RNG(42);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it("should be deterministic with the same seed", () => {
    const a = RNG(123);
    const b = RNG(123);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });
});

describe("randomUniform", () => {
  it("should return values within [a, b]", () => {
    const rng = RNG(42);
    for (let i = 0; i < 100; i++) {
      const val = randomUniform(5, 10, rng);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
    }
  });
});

describe("randomNormal", () => {
  it("should produce values near the mean on average", () => {
    const rng = RNG(42);
    const mean = 100;
    const stdev = 1;
    let sum = 0;
    const n = 1000;
    for (let i = 0; i < n; i++) {
      sum += randomNormal(mean, stdev, rng);
    }
    const avg = sum / n;
    // Average should be within a few standard deviations of the mean
    expect(Math.abs(avg - mean)).toBeLessThan(0.2);
  });

  it("should return finite numbers", () => {
    const rng = RNG(42);
    for (let i = 0; i < 100; i++) {
      expect(Number.isFinite(randomNormal(0, 1, rng))).toBe(true);
    }
  });
});

describe("randomChoices", () => {
  it("should return the correct number of items", () => {
    const rng = RNG(42);
    const result = randomChoices(["a", "b", "c"], 5, rng);
    expect(result).toHaveLength(5);
  });

  it("should only return items from the source list", () => {
    const rng = RNG(42);
    const source = ["x", "y", "z"];
    const result = randomChoices(source, 20, rng);
    for (const item of result) {
      expect(source).toContain(item);
    }
  });

  it("should return empty array for count 0", () => {
    const rng = RNG(42);
    expect(randomChoices(["a"], 0, rng)).toEqual([]);
  });
});

describe("generateSampleDataset", () => {
  it("should generate the correct number of rows", () => {
    const data = generateSampleDataset({ numPoints: 50, numCategories: 3, numSubClusters: 2 });
    expect(data).toHaveLength(50);
  });

  it("should include expected columns in each row", () => {
    const data = generateSampleDataset({ numPoints: 10, numCategories: 2, numSubClusters: 1 });
    for (const row of data) {
      expect(row).toHaveProperty("identifier");
      expect(row).toHaveProperty("x");
      expect(row).toHaveProperty("y");
      expect(row).toHaveProperty("category");
      expect(row).toHaveProperty("text");
      expect(typeof row.x).toBe("number");
      expect(typeof row.y).toBe("number");
    }
  });

  it("should have categories within the expected range", () => {
    const numCategories = 4;
    const data = generateSampleDataset({ numPoints: 100, numCategories, numSubClusters: 2 });
    for (const row of data) {
      expect(row.category).toBeGreaterThanOrEqual(0);
      expect(row.category).toBeLessThan(numCategories);
    }
  });

  it("should have sequential identifiers", () => {
    const data = generateSampleDataset({ numPoints: 20, numCategories: 2, numSubClusters: 1 });
    for (let i = 0; i < data.length; i++) {
      expect(data[i].identifier).toBe(i);
    }
  });

  it("should be deterministic (uses fixed seed internally)", () => {
    const a = generateSampleDataset({ numPoints: 10, numCategories: 2, numSubClusters: 1 });
    const b = generateSampleDataset({ numPoints: 10, numCategories: 2, numSubClusters: 1 });
    expect(a).toEqual(b);
  });
});
