
import { expect } from "chai";
import { ConvexMeshDecomposition } from "../vhacd.js";

describe("ConvexMeshDecomposition", async () => {
  let decomposer: ConvexMeshDecomposition;

  before(async () => {
    decomposer = await ConvexMeshDecomposition.create();
  });

  it("produces no hulls for a triangle", () => {
    const positions = new Float64Array([
      0, 0, 0,
      0, 1, 0,
      1, 1, 0,
    ]);

    const indices = new Uint32Array([0, 1, 2]);
    const hulls = decomposer.computeConvexHulls({ positions, indices });
    expect(hulls.length).to.equal(0);
  });

  it("produces 1 hull for a cube", () => {
    const positions = new Float64Array([
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
    ]);

    const indices = new Uint32Array([
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ]);

    const hulls = decomposer.computeConvexHulls({ positions, indices });
    expect(hulls.length).to.equal(1);
  }).timeout(0);
});
