
import { expect } from "chai";
import { ConvexMeshDecomposition, Mesh } from "../vhacd.js";

describe("ConvexMeshDecomposition", async () => {
  let decomposer: ConvexMeshDecomposition;

  before(async () => {
    decomposer = await ConvexMeshDecomposition.create();
  });

  const cube = {
    positions: new Float64Array([
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ]),
    indices: new Uint32Array([
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ]),
  };

  function expectMesh(actual: Mesh, expectedPositions: number[], expectedIndices: number[]): void {
    expect(Array.from(actual.positions)).to.deep.equal(expectedPositions);
    expect(Array.from(actual.indices)).to.deep.equal(expectedIndices);
  }

  it("produces 1 hull for a cube", () => {
    const hulls = decomposer.computeConvexHulls(cube);
    expect(hulls.length).to.equal(1);
    expectMesh(hulls[0], [
       1,  1,  1,  1, -1,  1,  1, -1,
      -1, -1,  1, -1, -1, -1,  1,  1,
       1, -1, -1,  1,  1, -1, -1, -1
    ], [
      0, 1, 2, 4, 1, 0, 4, 2, 1,
      5, 0, 2, 5, 2, 3, 5, 3, 0,
      6, 4, 0, 6, 0, 3, 6, 3, 4,
      7, 4, 3, 7, 3, 2, 7, 2, 4
    ]);
  });

  it("limits the number of vertices", () => {
    const hulls = decomposer.computeConvexHulls(cube, { maxVerticesPerHull: 6 });
    expect(hulls.length).to.equal(1);
    expectMesh(hulls[0], [
       1,  1,  1,  1, -1,  1,  1,
      -1, -1, -1,  1, -1, -1, -1,
       1,  1,  1, -1
    ], [
      0, 1, 2, 4, 1, 0, 4, 0,
      3, 4, 2, 1, 4, 3, 2, 5,
      0, 2, 5, 2, 3, 5, 3, 0
    ]);
  });
}).timeout(0);
