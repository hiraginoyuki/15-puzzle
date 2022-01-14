import { range, repeat } from "./utils";
import { insert } from "./strings";

const mathFloor = Math.floor, mathLog = Math.log;

export type TapData = {
  time: number;
  delta: number;
  x: number;
  y: number;
  index: number;
  piece: number;
  difference: number;
}

type ToStringOptions = {
  marginWidth?: number;
  marginHeight?: number;
  color?: number;
}

export class Puzzle extends Array<number> {
  public readonly width: number;
  public readonly height: number;
  public readonly size: number;

  private _2d: number[][] | null = null;

  protected _to2d(): number[][] {
    if (this._2d) return this._2d;
    const _2d = [];
    for (let i = 0; i < this.length; i += this.width)
      _2d.push(this.slice(i, i + this.width));
    return this._2d = _2d;
  }

  public taps: TapData[] = [];
  public constructor(pieces: number[], width: number) {
    super();
    pieces.forEach((v, i) => this[i] = v);
    this.width = width;
    this.height = pieces.length / width;
    this.size = pieces.length;
  }

  public readonly timeGenerated = Date.now();
  public get timeStarted() {
    return this.taps.length ? this.taps[0].time : null;
  }
  public get timeSolved() {
    return this.taps.length && this.isSolved() ? this.taps.at(-1)!.time : null;
  }
  protected _isSolvable: boolean | null = null;
  protected _isSolving: boolean | null = null;
  protected _isSolved: boolean | null = null;
  public isSolvable(): boolean {
    return this._isSolvable ??= this._checkSolvable();
  }
  public isSolving(): boolean {
    return this._isSolving ??= this._checkSolving();
  }
  public isSolved(): boolean {
    return this._isSolved ??= this._checkSolved();
  }
  protected _checkSolvable() {
    const cloned = new Puzzle(this, this.width);
    if (this.at(-1)) {
      cloned.tap(cloned.width - 1, cloned.getY(this.indexOf(0)));
      cloned.tap(cloned.width - 1, cloned.height - 1);
    }
    let isEven = true;
    for (let currentIndex = 0, targetIndex, targetValue, assigneeValue; currentIndex < cloned.length - 1; currentIndex++) {
      targetValue = cloned[currentIndex], targetIndex = targetValue - 1;
      if (currentIndex === targetIndex) continue;
      while(true) {
        assigneeValue = cloned[targetIndex];
        cloned[targetIndex] = targetValue;
        targetValue = assigneeValue, targetIndex = targetValue - 1;
        isEven = !isEven;
        if (currentIndex === targetIndex) break;
      }
      cloned[targetIndex] = targetValue;
    }
    return isEven;
  }
  protected _checkSolving() {
    return this.timeStarted !== null && this.timeSolved === null;
  }
  protected _checkSolved() {
    return this.isSolvable() && range(1, this.width * this.height).concat(0).every((n, i) => this[i] === n);
  }

  public toString({ marginWidth, marginHeight, color }: ToStringOptions = {}) {
    const flip = "\x1b[30;47m";
    const reset = "\x1b[0m";

    const maxLength = mathFloor(mathLog(this.width * this.height - 1) / mathLog(10)) + 1;
    const gridWidth = 2 * (marginWidth ?? 0) + maxLength;
    const gridHeight = 2 * (marginHeight ?? 0) + 1;
    const separator = "+" + ("-".repeat(gridWidth) + "+").repeat(this.width);
    const row = "|" + (" ".repeat(gridWidth) + "|").repeat(this.width);

    const grid = [ separator, ...Array(this.height).fill(Array(gridHeight).fill(row).concat(separator)).flat() ];

    this._to2d().forEach((row, pieceY) => {
      row.forEach((piece, pieceX) => {
        const y1 = (1 + gridHeight) * pieceY + 1 + (marginHeight ?? 0);
        grid[y1] = insert(grid[y1], (piece || "").toString().padStart(maxLength, " "), (1 + gridWidth) * pieceX + 1 + (marginWidth ?? 0), true);
        if (color && piece === pieceY * this.width + pieceX) {
          repeat(gridHeight, (i) => {
            const y2 = (1 + gridHeight) * pieceY + 1 + i;
            grid[y2] = insert(grid[y2], reset, (1 + gridWidth) * pieceX + 1 + gridWidth);
            grid[y2] = insert(grid[y2], flip, (1 + gridWidth) * pieceX + 1);
          });
        }
      });
    });

    return grid.join("\n");
  }

  public getIndex(x: number, y: number) {
    return y * this.width + x;
  }
  public getX(index: number) {
    return index % this.width;
  }
  public getY(index: number) {
    return mathFloor(index / this.width);
  }

  public set(x: number, y: number, piece: number) {
    this._isSolvable = null;
    this._isSolving = null;
    this._isSolved = null;
    this._2d = null;
    this[y * this.width + x] = piece;
    return this;
  }

  public tap(x: number, y: number) {
    if (!Number.isInteger(x) || x < 0 || this.width <= x)
      throw new RangeError("x is out of range");
    if (!Number.isInteger(y) || y < 0 || this.height <= y)
      throw new RangeError("y is out of range");
    const emptyPieceIndex = this.indexOf(0),
          emptyPieceX = this.getX(emptyPieceIndex),
          emptyPieceY = this.getY(emptyPieceIndex);
    
    const isSameX = emptyPieceX === x;
    if (isSameX === (emptyPieceY === y)) return null;

    const time = Date.now();
    const tappedPieceIndex = this.getIndex(x, y);
    let difference;

    if (isSameX) {
      let index = emptyPieceIndex;
      if (emptyPieceY < y) {
        difference = y - emptyPieceY;
        for (; index < tappedPieceIndex; index += this.width)
          this[index] = this[index + this.width];
      } else {
        difference = emptyPieceY - y;
        for (; tappedPieceIndex < index; index -= this.width)
          this[index] = this[index - this.width];
      }
    } else {
      if (emptyPieceX < x) {
        difference = x - emptyPieceX;
        this.copyWithin(emptyPieceIndex, emptyPieceIndex + 1, tappedPieceIndex + 1);
      } else {
        difference = emptyPieceX - x;
        this.copyWithin(tappedPieceIndex + 1, tappedPieceIndex, emptyPieceIndex);
      }
    }
    this._isSolving = null;
    this._isSolved = null;
    this._2d = null;

    const tapData: TapData = {
      time,
      delta: time - (this.taps.at(-1)?.delta ?? this.timeGenerated),
      x,
      y,
      index: tappedPieceIndex,
      piece: this[tappedPieceIndex],
      difference
    };
    this[tappedPieceIndex] = 0;

    this.taps.push(tapData);

    return tapData;
  }
}

Object.defineProperty(Puzzle, Symbol.species, { value: Array });
