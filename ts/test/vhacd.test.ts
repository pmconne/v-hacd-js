
import { expect } from "chai";
import { ConvexMeshDecomposition } from "../vhacd.js";

describe("ConvexMeshDecomposition", async () => {
  let decomposer: ConvexMeshDecomposition;

  before(async () => {
    decomposer = await ConvexMeshDecomposition.create();
  });

  it("triangle", () => {
    const positions = new Float64Array([
      0, 0, 0,
      0, 1, 0,
      1, 1, 0,
    ]);

    const indices = new Uint32Array([0, 1, 2]);
    const hulls = decomposer.computeConvexHulls({ positions, indices });
    expect(hulls.length).to.equal(1);
  });
});
