"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const puzzle_1 = require("../src/puzzle");
function to2dNumbers(puzzle) {
    return puzzle.to2d();
}
describe('puzzle.ts', () => {
    describe('class Puzzle', () => {
        const solvedPuzzleArr = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 0]
        ];
        const solvablePuzzleArr = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [0, 13, 14, 15]
        ];
        const unsolvablePuzzleArr = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 15, 14, 0]
        ];
        it('Puzzle.prototype.constructor()', () => {
            const solvedPuzzle = new puzzle_1.Puzzle(solvedPuzzleArr.flat(), solvedPuzzleArr[0].length);
            (0, chai_1.expect)(solvedPuzzle).to.be.an.instanceOf(puzzle_1.Puzzle);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('width', solvedPuzzleArr[0].length);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('height', solvedPuzzleArr.length);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            const solvablePuzzle = new puzzle_1.Puzzle(solvablePuzzleArr.flat(), solvablePuzzleArr[0].length);
            (0, chai_1.expect)(solvablePuzzle).to.be.an.instanceOf(puzzle_1.Puzzle);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('width', solvablePuzzleArr[0].length);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('height', solvablePuzzleArr.length);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            const unsolvablePuzzle = new puzzle_1.Puzzle(unsolvablePuzzleArr.flat(), unsolvablePuzzleArr[0].length);
            (0, chai_1.expect)(unsolvablePuzzle).to.be.an.instanceOf(puzzle_1.Puzzle);
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('width', unsolvablePuzzleArr[0].length);
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('height', unsolvablePuzzleArr.length);
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
        });
        it('Puzzle.prototype.clone()', () => {
            const solvedPuzzle = new puzzle_1.Puzzle(solvedPuzzleArr.flat(), solvedPuzzleArr[0].length);
            const solvablePuzzle = new puzzle_1.Puzzle(solvablePuzzleArr.flat(), solvablePuzzleArr[0].length);
            const unsolvablePuzzle = new puzzle_1.Puzzle(unsolvablePuzzleArr.flat(), unsolvablePuzzleArr[0].length);
            chai_1.assert.deepEqual(solvedPuzzle, solvedPuzzle.clone());
            chai_1.assert.deepEqual(solvablePuzzle, solvablePuzzle.clone());
            chai_1.assert.deepEqual(unsolvablePuzzle, unsolvablePuzzle.clone());
        });
        it('Puzzle.prototype.{time*ed, taps, isSolv*()}', () => {
            const solvedPuzzle = new puzzle_1.Puzzle(solvedPuzzleArr.flat(), solvedPuzzleArr[0].length);
            const solvablePuzzle = new puzzle_1.Puzzle(solvablePuzzleArr.flat(), solvablePuzzleArr[0].length);
            const unsolvablePuzzle = new puzzle_1.Puzzle(unsolvablePuzzleArr.flat(), unsolvablePuzzleArr[0].length);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('timeStarted', null);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('timeSolved', null);
            (0, chai_1.expect)(solvedPuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            (0, chai_1.expect)(solvedPuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvedPuzzle.isSolving()).to.be.false;
            (0, chai_1.expect)(solvedPuzzle.isSolved()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeStarted', null);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeSolved', null);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            (0, chai_1.expect)(solvablePuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolving()).to.be.false;
            (0, chai_1.expect)(solvablePuzzle.isSolved()).to.be.false;
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('timeStarted', null);
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('timeSolved', null);
            (0, chai_1.expect)(unsolvablePuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            (0, chai_1.expect)(unsolvablePuzzle.isSolvable()).to.be.false;
            (0, chai_1.expect)(unsolvablePuzzle.isSolving()).to.be.false;
            (0, chai_1.expect)(unsolvablePuzzle.isSolved()).to.be.false;
            (0, chai_1.expect)(solvablePuzzle.tap(0, 3)).to.be.not.ok;
            (0, chai_1.expect)(to2dNumbers(solvablePuzzle)).to.deep.equal([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [0, 13, 14, 15]
            ]);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeStarted').that.is.null;
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeSolved').that.is.null;
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.empty;
            (0, chai_1.expect)(solvablePuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolving()).to.be.false;
            (0, chai_1.expect)(solvablePuzzle.isSolved()).to.be.false;
            (0, chai_1.expect)(solvablePuzzle.tap(1, 3)).to.be.ok;
            (0, chai_1.expect)(to2dNumbers(solvablePuzzle)).to.deep.equal([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 0, 14, 15]
            ]);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeStarted').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeSolved').that.is.null;
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.has.lengthOf(1);
            (0, chai_1.expect)(solvablePuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolving()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolved()).to.be.false;
            solvablePuzzle.taps.every(({ time, delta }, i) => {
                var _a, _b;
                (0, chai_1.expect)(time).to.be.a('number').that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
                (0, chai_1.expect)(delta).to.be.a('number').that.is.equal(time - ((_b = (_a = solvablePuzzle.taps[i - 1]) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : solvablePuzzle.timeGenerated));
            });
            (0, chai_1.expect)(solvablePuzzle.tap(2, 3)).to.be.ok;
            (0, chai_1.expect)(to2dNumbers(solvablePuzzle)).to.deep.equal([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 0, 15]
            ]);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeStarted').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeSolved').that.is.null;
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.has.lengthOf(2);
            (0, chai_1.expect)(solvablePuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolving()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolved()).to.be.false;
            solvablePuzzle.taps.every(({ time, delta }, i) => {
                var _a, _b;
                (0, chai_1.expect)(time).to.be.a('number').that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
                (0, chai_1.expect)(delta).to.be.a('number').that.is.equal(time - ((_b = (_a = solvablePuzzle.taps[i - 1]) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : solvablePuzzle.timeGenerated));
            });
            (0, chai_1.expect)(solvablePuzzle.tap(3, 3)).to.be.ok;
            (0, chai_1.expect)(to2dNumbers(solvablePuzzle)).to.deep.equal([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 0]
            ]);
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeGenerated').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeStarted').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('timeSolved').that.is.a('number');
            (0, chai_1.expect)(solvablePuzzle).to.have.a.property('taps').that.is.an('array').and.has.lengthOf(3);
            (0, chai_1.expect)(solvablePuzzle.isSolvable()).to.be.true;
            (0, chai_1.expect)(solvablePuzzle.isSolving()).to.be.false;
            (0, chai_1.expect)(solvablePuzzle.isSolved()).to.be.true;
            solvablePuzzle.taps.every(({ time, delta }, i) => {
                var _a, _b;
                (0, chai_1.expect)(time).to.be.a('number').that.is.greaterThanOrEqual(solvablePuzzle.timeGenerated);
                (0, chai_1.expect)(delta).to.be.a('number').that.is.equal(time - ((_b = (_a = solvablePuzzle.taps[i - 1]) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : solvablePuzzle.timeGenerated));
            });
        });
    });
});
//# sourceMappingURL=puzzle.test.js.map