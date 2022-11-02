export declare module VHACD {
  type Float64Ptr = number;
  type Uint32Ptr = number;
  type VoidPtr = number;

  enum FillMode {
    Flood = 0,
    Surface = 1,
    Raycast = 2,
  }

  interface ConvexHull {
    getPoints(): Float64Ptr;
    numPoints: number;
    getTriangles(): Uint32Ptr;
    numTriangles: number;
  }

  interface ConvexHullList {
    size(): number;
    get(index: number): ConvexHull;
  }

  class Parameters {
    constructor();
    maxHulls: number;
    voxelResolution: number;
    minVolumePercentError: number;
    maxRecursionDepth: number;
    shrinkWrap: boolean;
    fillMode: FillMode;
    maxVerticesPerHull: number;
    minEdgeLength: number;
    findBestPlane: boolean;
  }

  class MeshDecomposer {
    constructor(parameters: Parameters);
    dispose(): void;
    compute(points: Float64Ptr, nPoints: number, triangles: Uint32Ptr, nTriangles: number): ConvexHullList;
  }

  function _malloc(nBytes: number): VoidPtr;
  function _free(ptr: VoidPtr): void;

  const HEAPU8: Uint8Array;
  const HEAPU32: Uint32Array;
  const HEAPF64: Float64Array;
}
