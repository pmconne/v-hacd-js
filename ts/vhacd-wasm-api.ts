export namespace VHACD {
  export type Float64Ptr = number;
  export type Uint32Ptr = number;
  export type VoidPtr = number;

  export enum FillMode {
    Flood = 0,
    Surface = 1,
    Raycast = 2,
  }

  export interface ConvexHull {
    getPoints(): Float64Ptr;
    numPoints: number;
    getTriangles(): Uint32Ptr;
    numTriangles: number;
  }

  export interface ConvexHullList {
    size(): number;
    get(index: number): ConvexHull;
  }

  export declare class Parameters {
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

  export declare class MeshDecomposer {
    constructor(parameters: Parameters);
    dispose(): void;
    compute(points: Float64Ptr, nPoints: number, triangles: Uint32Ptr, nTriangles: number): ConvexHullList;
  }

  export declare function _malloc(nBytes: number): VoidPtr;
  export declare function _free(ptr: VoidPtr): void;

  export declare const HEAPU8: Uint8Array;
  export declare const HEAPU32: Uint32Array;
  export declare const HEAPF64: Float64Array;
}
