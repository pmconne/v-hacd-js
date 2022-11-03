/** Type declarations for the APIs provided by vhacd-wasm.js.
 * Those APIs are meant primarily for internal use; see vhacd.ts for the main JS API.
 */
export namespace VHACD {
  /** A pointer to one or more 64-bit floating point numbers in the WASM memory buffer. */
  export type Float64Ptr = number;
  /** A pointer to one or more unsigned 32-bit numbers in the WASM memory buffer. */
  export type Uint32Ptr = number;
  /** A pointer to any kind of data in the WASM memory buffer. */
  export type VoidPtr = number;

  /** See HullFillMode in vhacd.ts. */
  export enum FillMode {
    Flood = 0,
    Surface = 1,
    Raycast = 2,
  }

  /** Represents a convex hull produced by `MeshDecomposer.compute`.
   * The pointers it contains remain valid until the next call to the decomposer's `compute` or `dispose` methods.
   */
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

  /** See Options in vhacd.ts. */
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

  /** An object that can produce convex hulls from meshes.
   * `compute` can be called any number of times.
   * `dispose` must be called when finished, to release internal memory.
   */
  export declare class MeshDecomposer {
    constructor(parameters: Parameters);
    /** Release memory internally held by this object.
     * The object must not be used after disposal.
     */
    dispose(): void;
    /** Produce convex hulls for the input mesh.
     * The returned hulls remain valid until the next call to `compute` or `dispose`, after which they should not be used.
     */
    compute(points: Float64Ptr, nPoints: number, triangles: Uint32Ptr, nTriangles: number): ConvexHullList;
  }

  /** Allocate and return a pointer to the specified number of bytes in the WASM memory buffer.
   * It must subsequently be relinquished by calling `_free`.
   */
  export declare function _malloc(nBytes: number): VoidPtr;
  /** Release memory previously allocated by `_malloc`.
   * `ptr` must not be used after its memory is freed.
   */
  export declare function _free(ptr: VoidPtr): void;

  /** Typed views into the single WASM memory buffer.
   * They can be indexed by pointers returned by `_malloc`.
   */
  export declare const HEAPU8: Uint8Array;
  export declare const HEAPU32: Uint32Array;
  export declare const HEAPF64: Float64Array;
}
