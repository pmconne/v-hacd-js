
import { expect } from "chai";
import { ConvexMeshDecomposition } from "../vhacd.js";

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

  it("produces 1 hull for a cube", () => {
    const hulls = decomposer.computeConvexHulls(cube);
    expect(hulls.length).to.equal(1);

    const hull = hulls[0];
    expect(hull.positions.length).to.equal(3 * 8);
    expect(hull.indices.length).to.equal(3 * 12);
    // ###TODO verify mesh
  });

  it("limits the number of vertices", () => {
    const hulls = decomposer.computeConvexHulls(cube, { maxVerticesPerHull: 6 });
    expect(hulls.length).to.equal(1);

    const hull = hulls[0];
    expect(hull.positions.length).to.equal(3 * 6);
    expect(hull.indices.length).to.equal(3 * 8);
  });
}).timeout(0);
