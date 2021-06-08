import { Vec2 } from "./vec2";
import { create } from 'random-seed';
import { chooseRandom, chooseRandomIndex, range } from "./utils";
import { notDupe } from "./dupe";

class Piece {
  constructor(
    public x: number,
    public y: number,
    public readonly id: number,
  ) {}
  toVec2(): Vec2 {
    return new Vec2(this.x, this.y);
  }
}
//@ts-ignore
export class Pieces extends Array<Piece[]> {
  public static check1d(pieces: number[], width: number): boolean {
    return (
      2 <= width &&
      2 <= pieces.length / width &&
      Number.isInteger(width) &&
      Number.isInteger(pieces.length / width)
    ) && (
      pieces.every(Number.isInteger) &&
      pieces.every(piece => 0 <= piece && piece <= pieces.length - 1) &&
      pieces.length === pieces.filter(notDupe).length
    );
  }
  public static check2d(pieces: number[][]): boolean {
    return (
      2 <= pieces.length &&
      2 <= pieces[0].length &&
      typeof pieces[0][0] === "number" &&
      pieces.every(row => (
        row.length === pieces[0].length &&
        row.every(piece => typeof piece === "number")
      ))
    );
  }
  public static from(pieces: number[][], taps?: TapData[] | null): Pieces;
  public static from(pieces: number[], width: number, taps?: TapData[] | null): Pieces;
  public static from(...args: [number[], number, (TapData[] | null)?]
                            | [number[][],       (TapData[] | null)?]): Pieces {
    if (args.length < 1 || 3 < args.length) throw new RangeError();
    if ((args.length === 2 || args.length === 3) && !Array.isArray(args[0][0])) {
      const [pieces, width, taps] = args as [number[], number, (TapData[] | null)?];
      if (!this.check1d(pieces, width)) throw new RangeError();
      return this.from([...Array(pieces.length / width)].map((_, y) => pieces.slice(y * width, (y + 1) * width)), taps);
    }
    const [pieces, taps] = args as [number[][], (TapData[] | null)?];
    if (!this.check2d(pieces)) throw new RangeError();
    return new this(pieces[0].length, pieces.length, pieces, taps);
  }

  constructor(
    public readonly width: number,
    public readonly height: number,
                    pieces: number[][],
    public          taps: TapData[] | null = [],
  ) {
    super(...pieces.map((row, rowIndex) => row.map((id, indexInRow) => (
      new Piece(indexInRow, rowIndex, id)
    ))));
  }
  public clone() {
    return (this.constructor as typeof FifteenPuzzle).from(Array.from(this).map(row => row.map(piece => piece.id)));
  }

  private _1d: Piece[] | null = null;
  get in1d(): Piece[] { return this._1d === null ? (this._1d = Array.from(this).flat()) : this._1d; }

  private readonly _timeGenerated = +new Date();
  public get timeGenerated() { return this._timeGenerated; }
  public get timeStarted()   { return this.taps?.length ? this.timeGenerated + this.taps[                   0].time : null; }
  public get timeSolved()    { return this.taps?.length ? this.timeGenerated + this.taps[this.taps.length - 1].time : null; }
  private _isSolvable: boolean | null = null;
  private _isSolving:  boolean | null = null;
  private _isSolved:   boolean | null = null;
  public get isSolvable() { return this._isSolvable === null ? (this._isSolvable = this.checkSolvable()) : this._isSolvable; }
  public get isSolving()  { return this._isSolving  === null ? (this._isSolving  = this.checkSolving() ) : this._isSolving ; }
  public get isSolved()   { return this._isSolved   === null ? (this._isSolved   = this.checkSolved()  ) : this._isSolved  ; }
  public checkSolvable() {
    const cloned = this.clone();
    if (new Vec2(cloned.width - 1, cloned.height - 1).equalTo(cloned.getPiece(0)!.toVec2())) {
      cloned.tap(cloned.width - 1, cloned.getPiece(0)!.y);
      cloned.tap(cloned.width - 1, cloned.height - 1);
    }
    const swapCount = range(cloned.width * cloned.height - 2).reduce((acc, i) => {
      const j = cloned.in1d[i];
      const k = cloned.getPiece(i + 1)!;
      if (j !== k) {
        cloned._swap(j, k);
        return acc + 1;
      } else return acc;
    });
    return swapCount % 2 === 0;
  }
  public checkSolving() { return this.timeStarted !== null; }
  public checkSolved() {
    return this.isSolvable
        && range(1, this.width * this.height).concat(0)
          .every((n, i) => this.in1d[i].id === n);
  }

  public getPiece(idOrPoint: number | Vec2) {
    return (
      typeof idOrPoint === "number"
        ? this.in1d.find(piece => idOrPoint === piece.id)
        : this[idOrPoint.y][idOrPoint.x]
    ) as Piece | null;
  }
  public _swap(piece1: Piece, piece2: Piece) {
    if (!(piece1 instanceof Piece)) throw new RangeError("piece1 is wrong");
    if (!(piece2 instanceof Piece)) throw new RangeError("piece2 is wrong");
    if (piece1 === piece2) return;
    const { x: x1, y: y1 } = piece1;
    const { x: x2, y: y2 } = piece2;
    piece1.x = x2, piece1.y = y2;
    piece2.x = x1, piece2.y = y1;
    this[piece1.y][piece1.x] = piece1;
    this[piece2.y][piece2.x] = piece2;
    this._1d = null;
  }
  public tap(x: number, y: number, $debug = (step: number, msg: string) => {}): boolean {
  $debug(0, `A piece was tapped: pieces[${x}][${y}]`);
    if (
      !Number.isInteger(x) || this.width  < x ||
      !Number.isInteger(y) || this.height < y
    ) {
  $debug(-1, `The x or y is out of range :(`);
      throw new RangeError();
    }
    const tappedPiece = this[y][x];
  $debug(1, `All the checks are passed :) piece id = ${tappedPiece.id}`);
    const emptyPiece = this.getPiece(0)!;
  $debug(2, `Got empty piece: [${emptyPiece.x}, ${emptyPiece.y}]`);
  $debug(3, `Checking if the pieces are equal...`);
    if (tappedPiece === emptyPiece) return false;
  $debug(4, `Checking if the pieces are in the same row or column...`);
    if (tappedPiece.x !== emptyPiece.x && tappedPiece.y !== emptyPiece.y) return false;
  $debug(5, `Calculating the direction of moving...`);
    const direction = new Vec2(
      -(tappedPiece.x < emptyPiece.x) + +(emptyPiece.x < tappedPiece.x),
      -(tappedPiece.y < emptyPiece.y) + +(emptyPiece.y < tappedPiece.y),
    );
  $debug(6, `Direction vector: [${direction.x}, ${direction.y}]`);
    const distance = Math.abs(emptyPiece.x - tappedPiece.x
                            + emptyPiece.y - tappedPiece.y);
  $debug(7, `Distance between the pieces: ${distance}`);
    const emptyPieceVec = emptyPiece.toVec2();
    for (let i = 0; i < distance; i++) this._swap(
      this.getPiece(emptyPieceVec.add(direction.mul(i    )))!,
      this.getPiece(emptyPieceVec.add(direction.mul(i + 1)))!
    );

    this.taps?.push({ time: +new Date(), x, y });

    this._isSolvable = null;
    this._isSolving  = null;
    this._isSolved   = null;
    return true;
  };
}

type FifteenPuzzleArgs = []
                       | [number]
                       | [number, number]
                       | [string]
                       | [string, number]
                       | [string, number, number];
export interface TapData {
  time: number;
  x: number;
  y: number;
}

export class FifteenPuzzle extends Pieces {
  static convertArgs(args: FifteenPuzzleArgs) {
    const isSeedPassed = typeof args[0] === "string";
    const seed   = isSeedPassed ? args[0] as string : `${+new Date}`;
    const width  = isSeedPassed ? typeof args[1] === "number" ? args[1] : 4
    /*************************/ : typeof args[0] === "number" ? args[0] : 4;
    const height = isSeedPassed ? typeof args[2] === "number" ? args[2] : width
    /*************************/ : typeof args[1] === "number" ? args[1] : width;

    return [ seed, width, height ] as const;
  }

  static generateRandom(): FifteenPuzzle;
  static generateRandom(size: number): FifteenPuzzle;
  static generateRandom(width: number, height: number): FifteenPuzzle;
  static generateRandom(seed: string): FifteenPuzzle;
  static generateRandom(seed: string, size: number): FifteenPuzzle;
  static generateRandom(seed: string, width: number, height: number): FifteenPuzzle;
  static generateRandom(...args: FifteenPuzzleArgs) {
    const [ seed, width, height ] = this.convertArgs(args);

    const randomSeed = create(seed);
    const randomizer: () => number = () => randomSeed.random();
    const random = <T>(array: T[]) => chooseRandom(array, randomizer);
    const randomIndex = <T>(array: T[]) => chooseRandomIndex(array, randomizer);

    const length = width * height;
    const numbers: number[] = [];
    const unusedNumbers = range(1, length);
    for (const _ of range(length - 3)) {
      numbers.push(unusedNumbers.splice(randomIndex(unusedNumbers), 1)[0]);
    }
    const puzzle = this.from(numbers.concat(unusedNumbers, 0), width, null);
    if (!puzzle.isSolvable) puzzle._swap(
      puzzle[puzzle.height - 1][puzzle.width - 3]!,
      puzzle[puzzle.height - 1][puzzle.width - 2]!,
    );

    const horizontalFirst = random([true, false]);
    if (horizontalFirst) {
      puzzle.tap(random(range(puzzle.width)), puzzle.height - 1);
      puzzle.tap(puzzle.getPiece(0)!.x, random(range(puzzle.height)));
    } else {
      puzzle.tap(puzzle.width - 1, random(range(puzzle.height)));
      puzzle.tap(random(range(puzzle.width)), puzzle.getPiece(0)!.y);
    }

    puzzle.taps = [];
    randomSeed.done();
    return puzzle;
  }
}
