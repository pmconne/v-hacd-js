
import  * as wasm from "../lib/vhacd-wasm.js";

export type HullFillMode = "flood" | "surface" | "raycast";

export interface Parameters {
  maxHulls?: number;
  voxelResolution?: number;
  minVolumePercentError?: number;
  maxRecursionDepth?: number;
  shrinkWrap?: boolean;
  fillMode?: HullFillMode;
  maxVerticesPerHull?: number;
  minEdgeLength?: number;
  findBestPlane?: boolean;
}

export interface Mesh {
  positions: Float64Array;
  indices: Uint32Array;
}

export function decomposeMesh(mesh: Readonly<Mesh>, parameters?: Parameters): Mesh[] {
  // ###TODO instantiate VHACD and compute
  return [];
}

console.log(wasm);
export function test(arg: string) {
  console.log(arg);
}
