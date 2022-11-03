
import { expect } from "chai";
import instantiateModule from "../../lib/vhacd-wasm.js";
import { VHACD } from "../vhacd-wasm-api.js";

describe("test", async () => {
  let vhacd: typeof VHACD;
  before(async () => {
    vhacd = await instantiateModule();
  });

  it("Parameters", () => {
    const params = new vhacd.Parameters();
    expect(params.maxHulls).to.equal(64);
    params.maxHulls = 32;
    expect(params.maxHulls).to.equal(32);
  });

  it("vector", () => {
    const params = new vhacd.Parameters();
    const decomposer = new vhacd.MeshDecomposer(params, VHACD.MessageType.All);
    const hulls = decomposer.compute(0, 0, 0, 0);
    expect(hulls.size()).to.equal(0);
    expect(hulls.get(1)).to.be.undefined;
  });

  it("heap", () => {
    expect(vhacd.HEAPU8).instanceof(Uint8Array);
    expect(vhacd._malloc(5)).least(1);
  });
});
