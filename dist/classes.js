"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = void 0;
class NotImplementedError extends Error {
    constructor(method) {
        super(`method .${method}() is not implemented`);
    }
}
exports.NotImplementedError = NotImplementedError;
//# sourceMappingURL=classes.js.map