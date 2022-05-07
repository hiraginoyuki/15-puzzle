"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puzzle = void 0;
const classes_1 = require("./classes");
const events_1 = require("./events");
const utils_1 = require("./utils");
const strings_1 = require("./strings");
const { floor, log } = Math;
class Puzzle extends Array {
    constructor(pieces, width) {
        super(pieces.length);
        this.taps = [];
        this._2d = null;
        this.timeGenerated = Date.now();
        this._isSolvable = null;
        this._isSolving = null;
        this._isSolved = null;
        pieces.forEach((id, i) => { this[i] = id; });
        this.width = width;
        this.height = pieces.length / width;
        this.events = new events_1.OwnedEventEmitter(this);
    }
    to2d() {
        if (this._2d !== null)
            return this._2d;
        this._2d = [];
        for (let y = 0; y < this.height; y++) {
            this._2d.push(this.slice(y * this.width, (y + 1) * this.width));
        }
        return this._2d;
    }
    clone() {
        if (Object.getPrototypeOf(this) !== Puzzle.prototype)
            throw new classes_1.NotImplementedError('clone');
        return new Puzzle(this, this.width);
    }
    get timeStarted() {
        var _a, _b;
        return (_b = (_a = this.taps.at(0)) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : null;
    }
    get timeSolved() {
        var _a, _b;
        if (!this.isSolved())
            return null;
        return (_b = (_a = this.taps.at(-1)) === null || _a === void 0 ? void 0 : _a.time) !== null && _b !== void 0 ? _b : null;
    }
    isSolvable() {
        var _a;
        const result = (_a = this._isSolvable) !== null && _a !== void 0 ? _a : (this._isSolvable = this.checkSolvable());
        return result;
    }
    isSolving() {
        var _a;
        const result = (_a = this._isSolving) !== null && _a !== void 0 ? _a : (this._isSolving = this.checkSolving());
        return result;
    }
    isSolved() {
        var _a;
        const result = (_a = this._isSolved) !== null && _a !== void 0 ? _a : (this._isSolved = this.checkSolved());
        return result;
    }
    checkSolvable() {
        const cloned = new Puzzle(this, this.width);
        if (cloned.at(-1) !== 0) {
            cloned.tap(cloned.width - 1, floor(cloned.indexOf(0) / cloned.width));
            cloned.tap(cloned.width - 1, cloned.height - 1);
        }
        let isEven = true;
        for (let currentIndex = 0, targetIndex, targetValue, assigneeValue; currentIndex < cloned.length - 1; currentIndex++) {
            targetValue = cloned[currentIndex];
            targetIndex = targetValue - 1;
            if (currentIndex === targetIndex)
                continue;
            while (true) {
                assigneeValue = cloned[targetIndex];
                cloned[targetIndex] = targetValue;
                targetValue = assigneeValue;
                targetIndex = targetValue - 1;
                isEven = !isEven;
                if (currentIndex === targetIndex)
                    break;
            }
            cloned[targetIndex] = targetValue;
        }
        return isEven;
    }
    checkSolving() {
        return this.timeStarted !== null && this.timeSolved === null;
    }
    checkSolved() {
        return this.isSolvable() && (0, utils_1.range)(1, this.length).concat(0).every((n, i) => this[i] === n);
    }
    toString({ marginWidth, marginHeight, color } = {}) {
        const flip = '\x1b[30;47m';
        const reset = '\x1b[0m';
        const maxLength = floor(log(this.length - 1) / log(10)) + 1;
        const gridWidth = 2 * (marginWidth !== null && marginWidth !== void 0 ? marginWidth : 0) + maxLength;
        const gridHeight = 2 * (marginHeight !== null && marginHeight !== void 0 ? marginHeight : 0) + 1;
        const separator = '+' + ('-'.repeat(gridWidth) + '+').repeat(this.width);
        const row = '|' + (' '.repeat(gridWidth) + '|').repeat(this.width);
        const grid = [separator, ...new Array(this.height).fill(new Array(gridHeight).fill(row).concat(separator)).flat()];
        this.to2d().map(row => row.slice().reverse()).forEach((row, y) => {
            row.forEach((id, x) => {
                const y1 = (1 + gridHeight) * y + 1 + (marginHeight !== null && marginHeight !== void 0 ? marginHeight : 0);
                grid[y1] = (0, strings_1.insert)(grid[y1], (id !== null && id !== void 0 ? id : '').toString().padStart(maxLength, ' '), (1 + gridWidth) * x + 1 + (marginWidth !== null && marginWidth !== void 0 ? marginWidth : 0), true);
                const index = x + y * this.width;
                if (color !== undefined && id - 1 === index) {
                    for (let i = 0; i < gridHeight; i++) {
                        const y2 = (1 + gridHeight) * y + 1 + i;
                        grid[y2] = (0, strings_1.insert)(grid[y2], reset, (1 + gridWidth) * x + 1 + gridWidth);
                        grid[y2] = (0, strings_1.insert)(grid[y2], flip, (1 + gridWidth) * x + 1);
                    }
                }
            });
        });
        return grid.join('\n');
    }
    set(x, y, piece) {
        this._isSolvable = null;
        this._2d = null;
        this._isSolving = null;
        this._isSolved = null;
        this[x + y * this.width] = piece;
        return this;
    }
    tap(x, y) {
        var _a, _b;
        if (!Number.isInteger(x) || x < 0 || this.width <= x)
            throw new RangeError('x is out of range');
        if (!Number.isInteger(y) || y < 0 || this.height <= y)
            throw new RangeError('y is out of range');
        const emptyPieceIndex = this.indexOf(0);
        const emptyPieceX = emptyPieceIndex % this.width;
        const emptyPieceY = floor(emptyPieceIndex / this.width);
        const isSameX = emptyPieceX === x;
        if (isSameX === (emptyPieceY === y))
            return null;
        let movedPieces;
        const tappedPieceIndex = x + y * this.width;
        if (isSameX) {
            let index = emptyPieceIndex;
            movedPieces = [];
            if (emptyPieceY < y) {
                for (; index < tappedPieceIndex; index += this.width) {
                    movedPieces.push({ index, id: this[index] = this[index + this.width] });
                }
            }
            else {
                for (; tappedPieceIndex < index; index -= this.width) {
                    movedPieces.push({ index, id: this[index] = this[index - this.width] });
                }
            }
        }
        else {
            if (emptyPieceX < x) {
                movedPieces = this.slice(emptyPieceIndex + 1, tappedPieceIndex + 1).map((id, i) => ({ index: i + emptyPieceIndex, id }));
                this.copyWithin(emptyPieceIndex, emptyPieceIndex + 1, tappedPieceIndex + 1);
            }
            else {
                movedPieces = this.slice(emptyPieceIndex, tappedPieceIndex).map((id, i) => ({ index: i + emptyPieceIndex, id }));
                this.copyWithin(tappedPieceIndex + 1, tappedPieceIndex, emptyPieceIndex);
            }
        }
        const time = Date.now();
        const tapData = {
            time,
            delta: time - ((_b = (_a = this.taps.at(-1)) === null || _a === void 0 ? void 0 : _a.delta) !== null && _b !== void 0 ? _b : this.timeGenerated),
            x,
            y,
            index: tappedPieceIndex,
            piece: this[tappedPieceIndex],
            movedPieces
        };
        this[tappedPieceIndex] = 0;
        this._isSolvable = null;
        this._2d = null;
        this._isSolving = null;
        this._isSolved = null;
        this.taps.push(tapData);
        this.events.emit('tap', tapData);
        return tapData;
    }
}
exports.Puzzle = Puzzle;
Object.defineProperty(Puzzle, Symbol.species, { value: Array });
//# sourceMappingURL=puzzle.js.map