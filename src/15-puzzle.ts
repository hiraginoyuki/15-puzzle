import { flip, range, chooseRandomIndex, chooseRandom } from './utils';
import { create } from 'random-seed';

const { floor, abs } = Math;

type Point2D = [number, number];
class PointUtil {
  constructor(
    private readonly columns: number
  ) {}
  convertPointToIndex(point: Point2D) { return point[0] + point[1] * this.columns; }
  convertIndexToPoint(index: number): Point2D { return [index % this.columns, floor(index / this.columns)]; }
}
type FifteenPuzzleArgs = [...([] | [string]), ...([] | [number] | [number, number])];

export class FifteenPuzzle {
  static convertArgs(args: FifteenPuzzleArgs) {
    const isSeedPassed = typeof args[0] === "string";
    const seed    = isSeedPassed ? args[0] as string : `${+new Date}`;
    const columns = isSeedPassed ? typeof args[1] === "number" ? args[1] : 4
    /**************************/ : typeof args[0] === "number" ? args[0] : 4;
    const rows    = isSeedPassed ? typeof args[2] === "number" ? args[2] : columns
    /**************************/ : typeof args[1] === "number" ? args[1] : columns;

    return { seed, columns, rows };
  }

  static generateRandom(): FifteenPuzzle;
  static generateRandom(size: number): FifteenPuzzle;
  static generateRandom(columns: number, rows: number): FifteenPuzzle;
  static generateRandom(seed: string): FifteenPuzzle;
  static generateRandom(seed: string, size: number): FifteenPuzzle;
  static generateRandom(seed: string, columns: number, rows: number): FifteenPuzzle;
  static generateRandom(...args: FifteenPuzzleArgs) {
    const { seed, columns, rows } = this.convertArgs(args);

    const randomSeed = create(seed);
    const randomizer: () => number = () => randomSeed.random();
    const random = <T>(array: T[]) => chooseRandom(array, randomizer);
    const randomIndex = <T>(array: T[]) => chooseRandomIndex(array, randomizer);

    const length = rows * columns;
    const numbers: number[] = [];
    const unusedNumbers = range(1, length);
    for (const _ of range(length - 3)) {
      numbers.push(unusedNumbers.splice(randomIndex(unusedNumbers), 1)[0]);
    }
    let puzzle = new this([columns, rows], numbers.concat(unusedNumbers, 0));
    if (!puzzle.isSolvable()) puzzle = new this([columns, rows], numbers.concat(unusedNumbers.map(flip), 0));
    const horizontalFirst = random([true, false]);
    puzzle.tap(horizontalFirst ? [random(range(columns)), rows - 1] : [columns - 1, random(range(rows))]);
    puzzle.tap(horizontalFirst ? [puzzle.getEmptyPoint()[0], random(range(rows))] : [random(range(columns)), puzzle.getEmptyPoint()[1]]);
    randomSeed.done();
    return puzzle;
  }

  public readonly columns: number;
  public readonly rows: number;
  public pointUtil: PointUtil;
  constructor(
    n: number | Point2D = 4,
    public numbers: number[] = range(1, Array.isArray(n) ? n[0] * n[1] : n ** 2).concat(0),
  ) {
    if (Array.isArray(n)) [this.columns, this.rows] = n;
    else this.columns = this.rows = n;
    this.pointUtil = new PointUtil(this.columns);
    if (!this.isValid()) throw new RangeError("Invalid numbers");
  }

  get length() { return this.numbers.length; }

  clone() { return new (this.constructor as typeof FifteenPuzzle)([this.rows, this.columns], this.numbers.slice()); }
  equals(point1: Point2D, point2: Point2D) { return point1[0] === point2[0] && point1[1] === point2[1]; }
  setValueOfPoint(point: Point2D, value: number) { this.numbers[this.pointUtil.convertPointToIndex(point)] = value; return this; }
  getValueFromPoint(point: Point2D) { return this.numbers[this.pointUtil.convertPointToIndex(point)]; }
  getPointFromValue(value: number) { return this.pointUtil.convertIndexToPoint(this.numbers.findIndex(i => i === value)); }
  getEmptyPoint() { return this.getPointFromValue(0); }

  isValid() {
    return this.numbers.length === this.columns * this.rows && range(this.numbers.length).every(i => this.numbers.includes(i));
  }
  /**
   * A puzzle is said to be solvable only when it can be solved by swapping two of the pieces even times. 
   */
  isSolvable() {
    if (!this.isValid()) return false;
    const cloned = this.clone();
    if (!cloned.equals(cloned.getPointFromValue(0), [cloned.columns, cloned.rows])) {
      cloned.tap([cloned.columns - 1, cloned.getPointFromValue(0)[1]]);
      cloned.tap([cloned.columns - 1, cloned.rows - 1]);
    }
    const swapCount = range(cloned.columns * cloned.rows - 1).reduce((acc, i) => {
      const j = cloned.getPointFromValue(i + 1);
      if (i !== cloned.pointUtil.convertPointToIndex(j)) {
        cloned.swap(cloned.pointUtil.convertIndexToPoint(i), j);
        return acc + 1;
      } else return acc;
    });
    return swapCount % 2 === 0;
  }
  isSolved() {
    return this.isValid()
        && range(1, this.length).concat(0).every((n, i) => this.getValueFromPoint(this.pointUtil.convertIndexToPoint(i)) == n);
  }

  swap(point1: Point2D, point2: Point2D) {
    const value1 = this.getValueFromPoint(point1);
    const value2 = this.getValueFromPoint(point2);
    this.setValueOfPoint(point1, value2);
    this.setValueOfPoint(point2, value1);
    return true;
  }
  tap(point: Point2D) {
    const emptyPoint = this.getEmptyPoint();
    if (this.equals(point, emptyPoint)) return false;
    if (point[0] !== emptyPoint[0] && point[1] !== emptyPoint[1]) return false;
    const isVertical = point[0] === emptyPoint[0];
    const axis = +isVertical;
    const distance = emptyPoint[axis] - point[axis];
    range(1, abs(distance) + 1)
      .map(i => distance > 0 ? i : -i)
      .forEach(i => this.swap(
        this.getEmptyPoint(),
        isVertical ? [point[0], emptyPoint[1] - i] : [emptyPoint[0] - i, point[1]]
      ));
    return true;
  }
}
