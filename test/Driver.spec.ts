/* global describe it */
import chai from "chai";
import Logger from "../src/Logger";

chai.should();

describe("chivy", () => {
  describe("Driver", () => {
    it("#colorfully", async () => {
      const log = new Logger("foo/bar");
      (log as any).driver.noColor = false;
      (log as any).driver.noTime = false;

      log.warn("xxx").should.be.eq(true);
      log.error("xxx").should.be.eq(true);
      log.error("xxx", "yyy").should.be.eq(true);
      log.error(1).should.be.eq(true);
      log.error(true).should.be.eq(true);
      log.error({}).should.be.eq(true);
    });

    it("#monochromatically", async () => {
      const log = new Logger("foo/bar");
      (log as any).driver.noTime = false;

      log.warn("xxx").should.be.eq(true);
      log.error("xxx").should.be.eq(true);
      log.error("xxx", "yyy").should.be.eq(true);
      log.error(1).should.be.eq(true);
      log.error(true).should.be.eq(true);
      log.error({}).should.be.eq(true);
    });
  });
});
