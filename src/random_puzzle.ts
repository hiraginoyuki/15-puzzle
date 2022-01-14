import { Puzzle } from './puzzle';
import { create } from 'random-seed';

const dateNow = Date.now, mathFloor = Math.floor;

type Args =
  | []
  | [number]
  | [number, number]
  | [string]
  | [string, number]
  | [string, number, number];

export class RandomPuzzle extends Puzzle {
  public constructor(pieces: number[], width: number, public seed: string) {
    super(pieces, width);
  }

  protected static _parseArgs(args: Args) {
    const isSeedPassed = typeof args[0] === "string";
    const seed   = isSeedPassed ? args[0] as string : `${dateNow()}`;
    const width  = isSeedPassed ? typeof args[1] === "number" ? args[1] : 4
    /*************************/ : typeof args[0] === "number" ? args[0] : 4;
    const height = isSeedPassed ? typeof args[2] === "number" ? args[2] : width
    /*************************/ : typeof args[1] === "number" ? args[1] : width;

    return [ seed, width, height ] as const;
  }
  public static generate(): RandomPuzzle
  public static generate(size: number): RandomPuzzle
  public static generate(width: number, height: number): RandomPuzzle
  public static generate(seed: string): RandomPuzzle
  public static generate(seed: string, size: number): RandomPuzzle
  public static generate(seed: string, width: number, height: number): RandomPuzzle
  public static generate(...args: Args) {
    const [ seed, width, height ] = this._parseArgs(args);

    const randomSeed = create(seed), randomSeedRandom = randomSeed.random.bind(randomSeed);
    
    const size = width * height;
    const numbers: number[] = [];
    const unusedNumbers = [...Array(size).keys()];
    unusedNumbers.shift();

    for (let i = 3; i < size; i++) 
      numbers.push(unusedNumbers.splice(mathFloor(unusedNumbers.length * randomSeedRandom()), 1)[0]);

    const puzzle = new this(numbers.concat(unusedNumbers, 0), width, seed);
    
    if (!puzzle.isSolvable()) {
      const index1 = puzzle.length - 3, index2 = puzzle.length - 2;
      const tmp = puzzle[index1];
      puzzle[index1] = puzzle[index2];
      puzzle[index2] = tmp;
      puzzle['_isSolvable'] = null;
    }
    
    puzzle.tap(mathFloor(puzzle.width * randomSeedRandom()), puzzle.height - 1);
    puzzle.tap(puzzle.getX(puzzle.indexOf(0)), mathFloor(puzzle.height * randomSeedRandom()));
    
    randomSeed.done();
    puzzle.taps = [];
    return puzzle;
  }
}

