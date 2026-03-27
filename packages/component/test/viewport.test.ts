// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import { Viewport } from "../src/lib/viewport_utils.js";

describe("Viewport", () => {
  it("should map the center of data space to center of pixel space", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 800, 600);
    const center = vp.pixelLocation(0, 0);
    expect(center.x).toBeCloseTo(400, 5);
    expect(center.y).toBeCloseTo(300, 5);
  });

  it("should round-trip pixel to coordinate and back", () => {
    const vp = new Viewport({ x: 2, y: 3, scale: 0.5 }, 1024, 768);
    const px = 512;
    const py = 384;
    const coord = vp.coordinateAtPixel(px, py);
    const backToPixel = vp.pixelLocation(coord.x, coord.y);
    expect(backToPixel.x).toBeCloseTo(px, 5);
    expect(backToPixel.y).toBeCloseTo(py, 5);
  });

  it("should round-trip coordinate to pixel and back", () => {
    const vp = new Viewport({ x: -1, y: 2, scale: 2 }, 640, 480);
    const dataX = 5;
    const dataY = -3;
    const pixel = vp.pixelLocation(dataX, dataY);
    const backToCoord = vp.coordinateAtPixel(pixel.x, pixel.y);
    expect(backToCoord.x).toBeCloseTo(dataX, 5);
    expect(backToCoord.y).toBeCloseTo(dataY, 5);
  });

  it("should return a positive scale", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 800, 600);
    expect(vp.scale()).toBeGreaterThan(0);
  });

  it("should return a 9-element matrix", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 800, 600);
    expect(vp.matrix()).toHaveLength(9);
  });

  it("should handle landscape aspect ratio", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 1600, 900);
    const center = vp.pixelLocation(0, 0);
    expect(center.x).toBeCloseTo(800, 5);
    expect(center.y).toBeCloseTo(450, 5);
  });

  it("should handle portrait aspect ratio", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 600, 1000);
    const center = vp.pixelLocation(0, 0);
    expect(center.x).toBeCloseTo(300, 5);
    expect(center.y).toBeCloseTo(500, 5);
  });

  it("pixelLocationFunction should match pixelLocation", () => {
    const vp = new Viewport({ x: 1, y: -1, scale: 0.75 }, 800, 600);
    const func = vp.pixelLocationFunction();
    const direct = vp.pixelLocation(3, 4);
    const fromFunc = func(3, 4);
    expect(fromFunc.x).toBeCloseTo(direct.x, 10);
    expect(fromFunc.y).toBeCloseTo(direct.y, 10);
  });

  it("coordinateAtPixelFunction should match coordinateAtPixel", () => {
    const vp = new Viewport({ x: 1, y: -1, scale: 0.75 }, 800, 600);
    const func = vp.coordinateAtPixelFunction();
    const direct = vp.coordinateAtPixel(400, 300);
    const fromFunc = func(400, 300);
    expect(fromFunc.x).toBeCloseTo(direct.x, 10);
    expect(fromFunc.y).toBeCloseTo(direct.y, 10);
  });

  it("update should change the viewport state", () => {
    const vp = new Viewport({ x: 0, y: 0, scale: 1 }, 800, 600);
    const before = vp.pixelLocation(5, 5);
    vp.update({ x: 5, y: 5, scale: 1 }, 800, 600);
    const after = vp.pixelLocation(5, 5);
    // After panning to center on (5,5), that point should now be at center
    expect(after.x).toBeCloseTo(400, 5);
    expect(after.y).toBeCloseTo(300, 5);
    expect(before.x).not.toBeCloseTo(400, 0);
  });
});
