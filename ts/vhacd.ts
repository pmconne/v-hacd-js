import instantiateModule from "../lib/vhacd-wasm.js";
import { VHACD } from "./vhacd-wasm-api.js";

/** Determines how the voxels are filled to create a solid object. The default - "flood" - generally works fine
 * for closed meshes. However, if the mesh is not watertight, then using "raycast" may be preferable as it will
 * determine if a voxel is part of the interior of the source mesh by raycasting around it. Finally, there are
 * some cases where you might actually want a convex decomposition to treat the source mesh as being hollow. If
 * that is the case you can use "surface" and then the convex decomposition will converge only onto the 'skin'
 * of the surface mesh.
 */
export type HullFillMode = "flood" | "surface" | "raycast";

/** Specifies what types of messages are output to the console during convex hull decomposition.
 * "progress" outputs the stages and operations as they occur.
 * "log" outputs warnings and informational messages.
 * "all" outputs both "progress" and "log" messages.
 * "none" outputs no messages.
 */
export type MessageType = "none" | "progress" | "log" | "all";

/** Options controlling how ConvexMeshDecomposition is performed. */
export interface Options {
  /** The maximum number of convex hulls to produce.
   * Default: 64.
   */
  maxHulls?: number;
  /** The voxel resolution to use.
   * Default: 400000.
   */
  voxelResolution?: number;
  /** If the voxels are within 1% of the volume of the hull, we consider this a close enough approximation.
   * Default: 1.
   */
  minVolumePercentError?: number;
  /** The maximum recursion depth.
   * Default: 10.
   */
  maxRecursionDepth?: number;
  /** Whether or not to shrinkwrap the voxel positions to the source mesh on output.
   * Default: true.
   */
  shrinkWrap?: boolean;
  /** How to fill the interior of the voxelized mesh.
   * Default: "flood"
   */
  fillMode?: HullFillMode;
  /** The maximum number of vertices allowed in any output convex hull.
   * Default: 64.
   */
  maxVerticesPerHull?: number;
  /** Once a voxel patch has an edge length of less than 4 on all 3 sides, we don't keep recursing.
   * Default: 2.
   */
  minEdgeLength?: number;
  /** Whether or not to attempt to split planes along the best location.
   * Note: this is an experimental feature.
   * Default: false.
   */
  findBestPlane?: boolean;
  /** The types of messages to output to the console during convex hull decomposition.
   * Default: "none".
   */
  messages?: MessageType;
}

/** A triangle mesh. */
export interface Mesh {
  /** The positions of each vertex, arranged in consecutive triplets [x, y, z]. */
  positions: Float64Array;
  /** The triangles of the mesh as indices into `positions`, arranged in consecutive triplets [i, j, k]. */
  indices: Uint32Array;
}

/** An object that can produce convex hulls from Meshes.
 * Use `ConvexMeshDecomposition.create` to obtain one.
 */
export interface ConvexMeshDecomposition {
  /** Produce a list of convex hulls from the input mesh using the specified options. */
  computeConvexHulls(mesh: Readonly<Mesh>, options?: Options): Mesh[];
}

export namespace ConvexMeshDecomposition {
  let vhacd: typeof VHACD;

  /** Create a ConvexMeshDecomposition. */
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

  if (mesh.positions.length % 3 !== 0)
    throw new Error("3 coordinates required per vertex");

  if (mesh.indices.length % 3 !== 0)
    throw new Error("Triangles required.");

  const params = new vhacd.Parameters();
  if (opts)
    populateParameters(params, opts);

  let messages: VHACD.MessageType = VHACD.MessageType.None;
  switch (opts?.messages) {
    case "all":
      messages = VHACD.MessageType.All;
      break;
    case "log":
      messages = VHACD.MessageType.Log;
      break;
    case "progress":
      messages = VHACD.MessageType.Progress;
      break;
  }

  let pPoints = 0;
  let pTriangles = 0;
  let decomposer: VHACD.MeshDecomposer | undefined;
  try {
    // Allocate everything first, in case memory grows.
    pPoints = vhacd._malloc(8 * mesh.positions.length);
    pTriangles = vhacd._malloc(4 * mesh.indices.length);

    // Initialize memory.
    vhacd.HEAPF64.set(mesh.positions, pPoints / 8);
    vhacd.HEAPU32.set(mesh.indices, pTriangles / 4);

    decomposer = new vhacd.MeshDecomposer(params, messages);
    const hulls = decomposer.compute(pPoints, mesh.positions.length / 3, pTriangles, mesh.indices.length / 3);

    const meshes: Mesh[] = [];
    const nHulls = hulls.size();
    for (let i = 0; i < nHulls; i++) {
      const hull = hulls.get(i);
      const pts = hull.getPoints() / 8;
      const tris = hull.getTriangles() / 4;
      const mesh = {
        positions: vhacd.HEAPF64.slice(pts, pts + hull.numPoints * 3),
        indices: vhacd.HEAPU32.slice(tris, tris + hull.numTriangles * 3),
      };

      // console.log({ positions: Array.from(mesh.positions), indices: Array.from(mesh.indices) });
      meshes.push(mesh);
    }

    return meshes;
  } finally {
    vhacd._free(pPoints);
    vhacd._free(pTriangles);
    decomposer?.dispose();
  }
}
