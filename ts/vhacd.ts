
import instantiateModule from "../lib/vhacd-wasm.js";
import { VHACD } from "./vhacd-wasm";

export type HullFillMode = "flood" | "surface" | "raycast";

export interface Options {
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

export interface ConvexMeshDecomposition {
  computeConvexHulls(mesh: Readonly<Mesh>, options?: Options): Mesh[];
}

export namespace ConvexMeshDecomposition {
  let vhacd: typeof VHACD;

  export async function create(): Promise<ConvexMeshDecomposition> {
    if (!vhacd)
      vhacd = await instantiateModule();

    return {
      computeConvexHulls: (mesh, options) => computeConvexHulls(vhacd, mesh, options),
    };
  }
}

function populateParameters(params: VHACD.Parameters, opts: Options): void {
  const numericKeys = ["maxHulls", "voxelResolution", "minVolumePercentError", "maxRecursionDepth", "maxVerticesPerHull", "minEdgeLength"] as const;
  for (const key of numericKeys) {
    const opt = opts[key];
    if (undefined !== opt)
      params[key] = opt;
  }

  if (undefined !== opts.shrinkWrap)
    params.shrinkWrap = opts.shrinkWrap;

  if (undefined !== opts.findBestPlane)
    params.findBestPlane = opts.findBestPlane;

  switch (opts.fillMode) {
    case "flood":
      params.fillMode = VHACD.FillMode.Flood;
      break;
    case "surface":
      params.fillMode = VHACD.FillMode.Surface;
      break;
    case "raycast":
      params.fillMode = VHACD.FillMode.Raycast;
      break;
  }
}

function computeConvexHulls(vhacd: typeof VHACD, mesh: Mesh, opts?: Options): Mesh[] {
  if (mesh.positions.length < 9 || mesh.indices.length < 3)
    return [];

  if (mesh.positions.length % 3 !== 0 || mesh.indices.length % 3 !== 0)
    throw new Error("Triangles required.");

  const params = new vhacd.Parameters();
  if (opts)
    populateParameters(params, opts);

  let pPoints = 0;
  let pTriangles = 0;
  let decomposer: VHACD.MeshDecomposer | undefined;
  try {
    pPoints = vhacd._malloc(8 * mesh.positions.length);
    vhacd.HEAPF64.set(mesh.positions, pPoints);
    pTriangles = vhacd._malloc(4 * mesh.indices.length);
    vhacd.HEAPU32.set(mesh.indices, pTriangles);

    decomposer = new vhacd.MeshDecomposer(params);
    const hulls = decomposer.compute(pPoints, mesh.positions.length / 3, pTriangles, mesh.indices.length / 3);

    const meshes: Mesh[] = [];
    const nHulls = hulls.size();
    for (let i = 0; i < nHulls; i++) {
      const hull = hulls.get(i);
      meshes.push({
        positions: vhacd.HEAPF64.slice(hull.getPoints(), hull.numPoints * 3),
        indices: vhacd.HEAPU32.slice(hull.getTriangles(), hull.numTriangles * 3),
      });
    }

    return meshes;
  } finally {
    vhacd._free(pPoints);
    vhacd._free(pTriangles);
    decomposer?.dispose();
  }
}
