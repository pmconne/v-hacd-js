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
    get(index: number): ConvexHull | undefined;
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

  function malloc(nBytes: number): VoidPtr;
  function free(ptr: VoidPtr): void;
  const HEAPU8: any;
}

export declare interface VHACD { }

/*
[
  'ready',
  'inspect',
  'FS_createDataFile',
  'FS_createPreloadedFile',
  'BindingError',
  'InternalError',
  'getInheritedInstanceCount',
  'getLiveInheritedInstances',
  'flushPendingDeletes',
  'setDelayFunction',
  'UnboundTypeError',
  'count_emval_handles',
  'get_first_emval',
  '___wasm_call_ctors',
  '___getTypeName',
  '__embind_initialize_bindings',
  '___errno_location',
  '_fflush',
  '_free',
  '_malloc',
  '_emscripten_stack_init',
  '_emscripten_stack_get_free',
  '_emscripten_stack_get_base',
  '_emscripten_stack_get_end',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  '___cxa_is_pointer_type',
  'dynCall_jiji',
  'asm',
  'HEAP8',
  'HEAP16',
  'HEAP32',
  'HEAPU8',
  'HEAPU16',
  'HEAPU32',
  'HEAPF32',
  'HEAPF64',
  'calledRun',
  'ConvexHull',
  'FillMode',
  'Parameters',
  'VHACD',
  'vector$ConvexHull'
]
*/
