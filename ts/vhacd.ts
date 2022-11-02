
import instantiateModule from "../lib/vhacd-wasm.js";

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

export interface ConvexHullDecomposer {
  decomposeMesh(mesh: Readonly<Mesh>, parameters?: Parameters): Mesh[];
}

export namespace ConvexHullDecomposer {
  let module;

  export async function create(): Promise<ConvexHullDecomposer> {
    console.log("create");
    if (!module) {
      console.log("instantiating...");
      module = await instantiateModule();
      console.log("...instantiated.");
      console.log(Object.keys(module));
      console.log(Object.keys(module["vector$ConvexHull"]));
    }

    return {
      decomposeMesh: (mesh, parameters) => {
        // ###TODO: stuff
        return [];
      },
    };
  }
}

console.log(instantiateModule);
ConvexHullDecomposer.create().then((decomposer) => console.log(decomposer));

