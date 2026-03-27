// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it, vi } from "vitest";
import { latestAsync } from "../src/utils/latest_async.js";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("latestAsync", () => {
  it("should call onResult with the result of a single invocation", async () => {
    const onResult = vi.fn();
    const asyncFn = async (x: number) => x * 2;
    const wrapped = latestAsync(asyncFn, onResult);

    wrapped(5);
    await delay(10);

    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(10);
  });

  it("should only call onResult with the latest invocation result", async () => {
    const onResult = vi.fn();
    let resolvers: Array<(val: string) => void> = [];

    const asyncFn = async (label: string) => {
      return new Promise<string>((resolve) => {
        resolvers.push(resolve);
      });
    };
    const wrapped = latestAsync(asyncFn, onResult);

    wrapped("first");
    wrapped("second");
    wrapped("third");

    // Resolve in order: first, second, third
    await delay(10);
    resolvers[0]("result-first");
    await delay(10);
    resolvers[1]("result-second");
    await delay(10);
    resolvers[2]("result-third");
    await delay(10);

    // Only the third (latest) should trigger onResult
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith("result-third");
  });

  it("should ignore errors silently", async () => {
    const onResult = vi.fn();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const asyncFn = async () => {
      throw new Error("test error");
    };
    const wrapped = latestAsync(asyncFn, onResult);

    wrapped();
    await delay(10);

    expect(onResult).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should handle rapid sequential calls", async () => {
    const onResult = vi.fn();
    const asyncFn = async (x: number) => {
      await delay(5);
      return x;
    };
    const wrapped = latestAsync(asyncFn, onResult);

    for (let i = 0; i < 10; i++) {
      wrapped(i);
    }
    await delay(50);

    // Only the last call (9) should have its result passed
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(9);
  });
});
