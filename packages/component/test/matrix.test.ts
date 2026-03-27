// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import {
  matrix3_zero,
  matrix3_identity,
  matrix3_matrix_mul_matrix,
  matrix3_matrix_mul_vector,
  matrix3_vector_mul_matrix,
  matrix3_determinant,
  matrix3_inverse,
  type Matrix3,
} from "../src/lib/matrix.js";

function expectMatrixClose(actual: Matrix3, expected: Matrix3, precision = 10) {
  for (let i = 0; i < 9; i++) {
    expect(actual[i]).toBeCloseTo(expected[i], precision);
  }
}

describe("matrix3_zero", () => {
  it("should return a zero matrix", () => {
    expect(matrix3_zero()).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

describe("matrix3_identity", () => {
  it("should return an identity matrix", () => {
    expect(matrix3_identity()).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  });
});

describe("matrix3_matrix_mul_matrix", () => {
  it("should return the same matrix when multiplied by identity", () => {
    const m: Matrix3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const identity = matrix3_identity();
    expectMatrixClose(matrix3_matrix_mul_matrix(m, identity), m);
    expectMatrixClose(matrix3_matrix_mul_matrix(identity, m), m);
  });

  it("should return zero when multiplied by zero matrix", () => {
    const m: Matrix3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const zero = matrix3_zero();
    expectMatrixClose(matrix3_matrix_mul_matrix(m, zero), zero);
  });

  it("should compute product correctly for known matrices", () => {
    // Column-major matrices
    const a: Matrix3 = [1, 0, 0, 0, 2, 0, 0, 0, 3]; // diag(1,2,3)
    const b: Matrix3 = [4, 0, 0, 0, 5, 0, 0, 0, 6]; // diag(4,5,6)
    const result = matrix3_matrix_mul_matrix(a, b);
    expectMatrixClose(result, [4, 0, 0, 0, 10, 0, 0, 0, 18]);
  });
});

describe("matrix3_matrix_mul_vector", () => {
  it("should return the same vector when multiplied by identity", () => {
    const identity = matrix3_identity();
    const v: [number, number, number] = [1, 2, 3];
    expect(matrix3_matrix_mul_vector(identity, v)).toEqual([1, 2, 3]);
  });

  it("should scale vector by diagonal matrix", () => {
    const m: Matrix3 = [2, 0, 0, 0, 3, 0, 0, 0, 4];
    expect(matrix3_matrix_mul_vector(m, [1, 1, 1])).toEqual([2, 3, 4]);
  });
});

describe("matrix3_vector_mul_matrix", () => {
  it("should return the same vector when multiplied by identity", () => {
    const identity = matrix3_identity();
    expect(matrix3_vector_mul_matrix([5, 6, 7], identity)).toEqual([5, 6, 7]);
  });
});

describe("matrix3_determinant", () => {
  it("should return 1 for the identity matrix", () => {
    expect(matrix3_determinant(matrix3_identity())).toBe(1);
  });

  it("should return 0 for a zero matrix", () => {
    expect(matrix3_determinant(matrix3_zero())).toBe(0);
  });

  it("should compute determinant of a diagonal matrix", () => {
    const m: Matrix3 = [2, 0, 0, 0, 3, 0, 0, 0, 4];
    expect(matrix3_determinant(m)).toBe(24);
  });
});

describe("matrix3_inverse", () => {
  it("should invert the identity matrix to itself", () => {
    expectMatrixClose(matrix3_inverse(matrix3_identity()), matrix3_identity());
  });

  it("should produce identity when inverse is multiplied by original", () => {
    const m: Matrix3 = [2, 1, 0, 0, 3, 1, 1, 0, 4];
    const inv = matrix3_inverse(m);
    const product = matrix3_matrix_mul_matrix(m, inv);
    expectMatrixClose(product, matrix3_identity(), 8);
  });

  it("should invert a diagonal matrix", () => {
    const m: Matrix3 = [2, 0, 0, 0, 4, 0, 0, 0, 5];
    const inv = matrix3_inverse(m);
    expectMatrixClose(inv, [0.5, 0, 0, 0, 0.25, 0, 0, 0, 0.2]);
  });
});
