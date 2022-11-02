
import { expect } from "chai";
import instantiateModule from "../../lib/vhacd-wasm.js";
import { Parameters } from "../vhacd.js";

describe("test", async () => {
  let vhacd;
  before(async () => {
    vhacd = await instantiateModule();
  });

  it("test", () => {
    expect(vhacd.HEAPU8).not.to.be.undefined;
  });

  it("Parameters", () => {
    const params = new vhacd.Parameters() as Parameters;
    expect(params.maxHulls).to.equal(64);
    params.maxHulls = 32;
    expect(params.maxHulls).to.equal(32);
  });

  it("vector", () => {
    const params = new vhacd.Parameters();
    const decomposer = new vhacd.MeshDecomposer(params);
    const hulls = decomposer.compute(0, 0, 0, 0);
    const keys = Array.from(Object.keys(hulls));
    console.log(`keys: ${JSON.stringify(keys)}`);
    console.log(typeof keys);
    for (const key of keys)
      console.log(`${key}: ${typeof hulls[key]}`);
  });
});
