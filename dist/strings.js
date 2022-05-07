"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = void 0;
function insert(originalStr, insertedStr, index, overwrite = false) {
    return originalStr.slice(0, index) + insertedStr + originalStr.slice(index + insertedStr.length * +overwrite);
}
exports.insert = insert;
//# sourceMappingURL=strings.js.map