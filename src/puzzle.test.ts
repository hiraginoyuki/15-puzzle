import "mocha";
import { expect } from "chai";
import { Puzzle } from "../src/puzzle";

function to2dNumbers(puzzle: Puzzle) {
  return puzzle['_to2d']();
}

describe("puzzle.ts", () => {
  describe("class Puzzle", () => {
    const solvedPuzzleArr = [
      [  1,  2,  3,  4 ],
      [  5,  6,  7,  8 ],
      [  9, 10, 11, 12 ],
      [ 13, 14, 15,  0 ],
    ];
    const solvablePuzzleArr = [
      [  1,  2,  3,  4 ],
      [  5,  6,  7,  8 ],
      [  9, 10, 11, 12 ],
      [  0, 13, 14, 15 ],
    ];
    const unsolvablePuzzleArr = [
      [  1,  2,  3,  4 ],
      [  5,  6,  7,  8 ],
      [  9, 10, 11, 12 ],
      [ 13, 15, 14,  0 ],
    ];

    it("Puzzle.prototype.constructor()", () => {
      const solvedPuzzle = new Puzzle(solvedPuzzleArr.flat(), solvedPuzzleArr[0].length);
      expect(solvedPuzzle).to.be.an.instanceOf(Puzzle);
      expect(solvedPuzzle).to.have.a.property("width", solvedPuzzleArr[0].length);
      expect(solvedPuzzle).to.have.a.property("height", solvedPuzzleArr.length);
      expect(solvedPuzzle).to.have.a.property("size", solvedPuzzleArr.flat().length);
      expect(solvedPuzzle).to.have.a.property("taps").that.is.an("array").and.empty;

      const solvablePuzzle = new Puzzle(solvablePuzzleArr.flat(), solvablePuzzleArr[0].length);
      expect(solvablePuzzle).to.be.an.instanceOf(Puzzle);
      expect(solvablePuzzle).to.have.a.property("width", solvablePuzzleArr[0].length);
      expect(solvablePuzzle).to.have.a.property("height", solvablePuzzleArr.length);
      expect(solvablePuzzle).to.have.a.property("size", solvablePuzzleArr.flat().length);
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.empty;

      const unsolvablePuzzle = new Puzzle(unsolvablePuzzleArr.flat(), unsolvablePuzzleArr[0].length);
      expect(unsolvablePuzzle).to.be.an.instanceOf(Puzzle);
      expect(unsolvablePuzzle).to.have.a.property("width", unsolvablePuzzleArr[0].length);
      expect(unsolvablePuzzle).to.have.a.property("height", unsolvablePuzzleArr.length);
      expect(unsolvablePuzzle).to.have.a.property("size", unsolvablePuzzleArr.flat().length);
      expect(unsolvablePuzzle).to.have.a.property("taps").that.is.an("array").and.empty;
    });

    it("Puzzle.prototype.{time*ed, taps, isSolv*()}", () => {
      const solvedPuzzle = new Puzzle(solvedPuzzleArr.flat(), solvedPuzzleArr[0].length);
      const solvablePuzzle = new Puzzle(solvablePuzzleArr.flat(), solvablePuzzleArr[0].length);
      const unsolvablePuzzle = new Puzzle(unsolvablePuzzleArr.flat(), unsolvablePuzzleArr[0].length);

      expect(solvedPuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvedPuzzle).to.have.a.property("timeStarted", null);
      expect(solvedPuzzle).to.have.a.property("timeSolved", null);
      expect(solvedPuzzle).to.have.a.property("taps").that.is.an("array").and.empty;
      expect(solvedPuzzle.isSolvable()).to.be.true;
      expect(solvedPuzzle.isSolving()).to.be.false;
      expect(solvedPuzzle.isSolved()).to.be.true;

      expect(solvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeStarted", null);
      expect(solvablePuzzle).to.have.a.property("timeSolved", null);
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.empty;
      expect(solvablePuzzle.isSolvable()).to.be.true;
      expect(solvablePuzzle.isSolving()).to.be.false;
      expect(solvablePuzzle.isSolved()).to.be.false;

      expect(unsolvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(unsolvablePuzzle).to.have.a.property("timeStarted", null);
      expect(unsolvablePuzzle).to.have.a.property("timeSolved", null);
      expect(unsolvablePuzzle).to.have.a.property("taps").that.is.an("array").and.empty;
      expect(unsolvablePuzzle.isSolvable()).to.be.false;
      expect(unsolvablePuzzle.isSolving()).to.be.false;
      expect(unsolvablePuzzle.isSolved()).to.be.false;

      expect(solvablePuzzle.tap(0, 3)).to.be.not.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [ 1,  2,  3,  4 ],
        [ 5,  6,  7,  8 ],
        [ 9, 10, 11, 12 ],
        [ 0, 13, 14, 15 ],
      ]);
      expect(solvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeStarted").that.is.null;
      expect(solvablePuzzle).to.have.a.property("timeSolved").that.is.null;
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.empty;
      expect(solvablePuzzle.isSolvable()).to.be.true;
      expect(solvablePuzzle.isSolving()).to.be.false;
      expect(solvablePuzzle.isSolved()).to.be.false;

      expect(solvablePuzzle.tap(1, 3)).to.be.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [  1,  2,  3,  4 ],
        [  5,  6,  7,  8 ],
        [  9, 10, 11, 12 ],
        [ 13,  0, 14, 15 ],
      ]);
      expect(solvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeStarted").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeSolved").that.is.null;
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.has.lengthOf(1);
      expect(solvablePuzzle.isSolvable()).to.be.true;
      expect(solvablePuzzle.isSolving()).to.be.true;
      expect(solvablePuzzle.isSolved()).to.be.false;
      solvablePuzzle.taps.every(({ time, delta }, i) => {
        expect(time).to.be.a("number").that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
        expect(delta).to.be.a("number").that.is.equal(time - (solvablePuzzle.taps[i - 1]?.time ?? solvablePuzzle.timeGenerated));
      });

      expect(solvablePuzzle.tap(2, 3)).to.be.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [  1,  2,  3,  4 ],
        [  5,  6,  7,  8 ],
        [  9, 10, 11, 12 ],
        [ 13, 14,  0, 15 ],
      ]);
      expect(solvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeStarted").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeSolved").that.is.null;
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.has.lengthOf(2);
      expect(solvablePuzzle.isSolvable()).to.be.true;
      expect(solvablePuzzle.isSolving()).to.be.true;
      expect(solvablePuzzle.isSolved()).to.be.false;
      solvablePuzzle.taps.every(({ time, delta }, i) => {
        expect(time).to.be.a("number").that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
        expect(delta)
          .to.be.a("number")
          .that.is.equal(time - (solvablePuzzle.taps[i - 1]?.time ?? solvablePuzzle.timeGenerated));
      });

      expect(solvablePuzzle.tap(3, 3)).to.be.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [  1,  2,  3,  4 ],
        [  5,  6,  7,  8 ],
        [  9, 10, 11, 12 ],
        [ 13, 14, 15,  0 ],
      ]);
      expect(solvablePuzzle).to.have.a.property("timeGenerated").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeStarted").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("timeSolved").that.is.a("number");
      expect(solvablePuzzle).to.have.a.property("taps").that.is.an("array").and.has.lengthOf(3);
      expect(solvablePuzzle.isSolvable()).to.be.true;
      expect(solvablePuzzle.isSolving()).to.be.false;
      expect(solvablePuzzle.isSolved()).to.be.true;
      solvablePuzzle.taps.every(({ time, delta }, i) => {
        expect(time).to.be.a("number").that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
        expect(delta).to.be.a("number").that.is.equal(time - (solvablePuzzle.taps[i - 1]?.time ?? solvablePuzzle.timeGenerated));
      });

      expect(solvablePuzzle.tap(3, 0)).to.be.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [  1,  2,  3,  0 ],
        [  5,  6,  7,  4 ],
        [  9, 10, 11,  8 ],
        [ 13, 14, 15, 12 ],
      ]);

      expect(solvablePuzzle.tap(0, 0)).to.be.ok;
      expect(to2dNumbers(solvablePuzzle)).to.deep.equal([
        [  0,  1,  2,  3 ],
        [  5,  6,  7,  4 ],
        [  9, 10, 11,  8 ],
        [ 13, 14, 15, 12 ],
      ]);
    });
  });
});