"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = exports.range = void 0;
const { ceil } = Math;
function range(...args) {
    switch (args.length) {
        case 1:
            return range(0, args[0], 1);
        case 2:
            return range(args[0], args[1], 1);
        default: {
            const [start, end, step] = args;
            return [...new Array(ceil((end - start) / step))].map((v, i) => start + i * step);
        }
    }
}
exports.range = range;
function repeat(times, func) {
    for (let i = 0; i < times; i++)
        func(i);
}
exports.repeat = repeat;
//# sourceMappingURL=utils.js.map