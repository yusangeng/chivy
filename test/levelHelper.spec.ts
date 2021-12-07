/* global describe it */
import chai from "chai";
import { anything2Level, anything2LevelString } from "../src/levelHelper";

chai.should();

describe("levelHelper", () => {
  describe("#anything2Level", () => {
    it("should be 2", async () => {
      anything2Level(2).should.be.eq(2);
      anything2Level("2").should.be.eq(2);
      anything2Level(2.5).should.be.eq(2);
      anything2Level("WARN").should.be.eq(2);
      anything2Level("warn").should.be.eq(2);
    });

    it("should NOT be 0", async () => {
      anything2Level(void 0).should.be.eq(0);
      anything2Level(null).should.be.eq(0);
      anything2Level({}).should.be.eq(0);
      anything2Level("XXX").should.be.eq(0);
    });
  });

  describe("#anything2LevelString", () => {
    it("should be WARN", async () => {
      anything2LevelString(2).should.be.eq("WARN");
      anything2LevelString(2.5).should.be.eq("WARN");
      anything2LevelString("WARN").should.be.eq("WARN");
      anything2LevelString("warn").should.be.eq("WARN");
    });

    it("should NOT be DEBUG", async () => {
      anything2LevelString(void 0).should.be.eq("DEBUG");
      anything2LevelString(null).should.be.eq("DEBUG");
      anything2LevelString({}).should.be.eq("DEBUG");
      anything2LevelString(0).should.be.eq("DEBUG");
    });

    it("should NOT be LEVEL(99)", async () => {
      anything2LevelString(99).should.be.eq("LEVEL(99)");
    });
  });
});
