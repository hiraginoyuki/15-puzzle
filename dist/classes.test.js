"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const classes_1 = require("./classes");
describe('classes.ts', () => {
    describe('class NotImplementedError', () => {
        it('new NotImplementedError()', () => {
            const methodName = 'foo';
            (0, chai_1.expect)(new classes_1.NotImplementedError(methodName))
                .to.be.an.instanceOf(classes_1.NotImplementedError).and.be.an.instanceOf(Error)
                .and.have.property('message', `method .${methodName}() is not implemented`);
        });
    });
});
//# sourceMappingURL=classes.test.js.map