"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const random_puzzle_1 = require("../src/random_puzzle");
const utils_1 = require("../src/utils");
describe('random_puzzle.ts', () => {
    describe('class RandomPuzzle', () => {
        const sizes = [
            [2],
            [3],
            [4],
            [2, 3],
            [3, 4],
            [4, 2]
        ];
        it('RandomPuzzle.generate()', () => (sizes.forEach(size => (0, utils_1.repeat)(32, () => (
        // @ts-expect-error
        (0, chai_1.expect)(random_puzzle_1.RandomPuzzle.generate(...size).isSolvable()).to.be.true)))));
        it('RandomPuzzle._parseArgs()', () => {
            for (const [args, parsedArgs] of [
                [[], [4, 4]],
                [[3], [3, 3]],
                [[3, 2], [3, 2]],
                [['kazu'], ['kazu', 4, 4]],
                [['kazu', 3], ['kazu', 3, 3]],
                [['kazu', 3, 2], ['kazu', 3, 2]]
                // @ts-expect-error
            ])
                (0, chai_1.expect)(random_puzzle_1.RandomPuzzle._parseArgs(args)).to.include.members(parsedArgs);
        });
    });
});
//# sourceMappingURL=random_puzzle.test.js.map