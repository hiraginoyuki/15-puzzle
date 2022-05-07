"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomPuzzle = void 0;
const puzzle_1 = require("./puzzle");
const random_seed_1 = require("random-seed");
const classes_1 = require("./classes");
const { floor } = Math;
class RandomPuzzle extends puzzle_1.Puzzle {
    constructor(pieces, width, seed) {
        super(pieces, width);
        this.seed = seed;
    }
    clone() {
        if (Object.getPrototypeOf(this) !== RandomPuzzle.prototype)
            throw new classes_1.NotImplementedError('clone');
        return new RandomPuzzle(this, this.width, this.seed);
    }
    static _parseArgs(args) {
        const isSeedPassed = typeof args[0] === 'string';
        const seed = isSeedPassed ? args[0] : `${Date.now()}`;
        const width = isSeedPassed ? typeof args[1] === 'number' ? args[1] : 4 : typeof args[0] === 'number' ? args[0] : 4;
        const height = isSeedPassed ? typeof args[2] === 'number' ? args[2] : width : typeof args[1] === 'number' ? args[1] : width;
        return [seed, width, height];
    }
    static generate(...args) {
        const [seed, width, height] = RandomPuzzle._parseArgs(args);
        const randomSeed = (0, random_seed_1.create)(seed);
        const size = width * height;
        const numbers = [];
        const unusedNumbers = [...new Array(size).keys()];
        unusedNumbers.shift();
        for (let i = 3; i < size; i++) {
            numbers.push(unusedNumbers.splice(floor(randomSeed.random() * unusedNumbers.length), 1)[0]);
        }
        const puzzle = new RandomPuzzle(numbers.concat(unusedNumbers, 0), width, seed);
        if (!puzzle.isSolvable()) {
            const tmp = puzzle[size - 3];
            puzzle[size - 3] = puzzle[size - 2];
            puzzle[size - 2] = tmp;
            puzzle._isSolvable = null;
            puzzle._2d = null;
            puzzle._isSolving = null;
            puzzle._isSolved = null;
        }
        const horizontalFirst = randomSeed.random() < 0.5;
        if (horizontalFirst) {
            puzzle.tap(floor(randomSeed.random() * puzzle.width), puzzle.height - 1);
            puzzle.tap(puzzle.indexOf(0) % puzzle.width, floor(randomSeed.random() * puzzle.height));
        }
        else {
            puzzle.tap(puzzle.width - 1, floor(randomSeed.random() * puzzle.height));
            puzzle.tap(floor(randomSeed.random() * puzzle.width), floor(puzzle.indexOf(0) / puzzle.width));
        }
        randomSeed.done();
        puzzle.taps = [];
        return puzzle;
    }
}
exports.RandomPuzzle = RandomPuzzle;
//# sourceMappingURL=random_puzzle.js.map