"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const utils_1 = require("../src/utils");
describe('utils.ts', () => {
    describe('function range', () => {
        it('range(number)', () => (0, chai_1.expect)((0, utils_1.range)(1)).to.deep.equal([0]));
        it('range(number, number)', () => (0, chai_1.expect)((0, utils_1.range)(2, 4)).to.deep.equal([2, 3]));
        it('range(number, number, number)', () => (0, chai_1.expect)((0, utils_1.range)(3, 16, 3)).to.deep.equal([3, 6, 9, 12, 15]));
    });
    describe('function repeat', () => {
        it('repeat()', () => {
            let i = 0;
            let j = 0;
            (0, utils_1.repeat)(4, iteration => {
                i += 1;
                j += iteration;
            });
            (0, chai_1.expect)(i).to.equal(4);
            (0, chai_1.expect)(j).to.equal(6);
        });
    });
});
//# sourceMappingURL=utils.test.js.map