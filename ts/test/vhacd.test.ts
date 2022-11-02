
import { expect } from "chai";
import instantiateModule from "../../lib/vhacd-wasm.js";
import { Parameters } from "../vhacd.js";

describe("test", async () => {
  let module;
  before(async () => {
    module = await instantiateModule();
  });

  it("test", () => {
    expect(module.HEAPU8).not.to.be.undefined;
  });

  it("Parameters", () => {
    const params = new module.Parameters() as Parameters;
    expect(params.maxHulls).to.equal(64);
    params.maxHulls = 32;
    expect(params.maxHulls).to.equal(32);
  });
});
