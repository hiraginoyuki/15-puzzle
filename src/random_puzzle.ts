import { GridUtil } from './grid'
import { Piece, Puzzle } from './puzzle'
import { range, repeat } from "./utils"
import { chooseItem, chooseIndex } from './random'
import { create } from 'random-seed'
import { NotImplementedError } from './classes'

type Args =
  | []
  | [number]
  | [number, number]
  | [string]
  | [string, number]
  | [string, number, number]

export class RandomPuzzle extends Puzzle {
  public constructor(pieces: Piece[][] | number[][], public seed: string) {
    super(pieces)
  }
  
  public clone() {
    if (Object.getPrototypeOf(this) !== RandomPuzzle.prototype) throw new NotImplementedError('clone')
    return new RandomPuzzle( this.to2d().map(row => row.map(piece => piece.id)), this.seed )
  }

  protected static _parseArgs(args: Args) {
    const isSeedPassed = typeof args[0] === "string"
    const seed   = isSeedPassed ? args[0] as string : `${+new Date}`
    const width  = isSeedPassed ? typeof args[1] === "number" ? args[1] : 4
    /*************************/ : typeof args[0] === "number" ? args[0] : 4
    const height = isSeedPassed ? typeof args[2] === "number" ? args[2] : width
    /*************************/ : typeof args[1] === "number" ? args[1] : width

    return [ seed, width, height ] as const
  }
  public static generate(): RandomPuzzle
  public static generate(size: number): RandomPuzzle
  public static generate(width: number, height: number): RandomPuzzle
  public static generate(seed: string): RandomPuzzle
  public static generate(seed: string, size: number): RandomPuzzle
  public static generate(seed: string, width: number, height: number): RandomPuzzle
  public static generate(...args: Args) {
    const [ seed, width, height ] = this._parseArgs(args)

    const randomSeed = create(seed)
    const rndItem = <T>(array: T[]) => chooseItem(array, () => randomSeed.random())
    const rndIndex = <T>(array: T[]) => chooseIndex(array, () => randomSeed.random())

    const size = width * height
    const numbers: number[] = []
    const unusedNumbers = range(1, size)

    repeat(size - 3, () =>
      numbers.push(unusedNumbers.splice(rndIndex(unusedNumbers), 1)[0]))

    const puzzle = new this(GridUtil.toGrid(numbers.concat(unusedNumbers, 0), width, height), seed)
    if (!puzzle.isSolvable())
      puzzle.swap(puzzle.to1d().at(-3) as Piece, puzzle.to1d().at(-2) as Piece)

    const horizontalFirst = rndItem([true, false])
    if (horizontalFirst) {
      puzzle.tap(rndItem(range(puzzle.width)), puzzle.height - 1)
      puzzle.tap(puzzle.get(0).x, rndItem(range(puzzle.height)))
    } else {
      puzzle.tap(puzzle.width - 1, rndItem(range(puzzle.height)))
      puzzle.tap(rndItem(range(puzzle.width)), puzzle.get(0).y)
    }

    randomSeed.done()
    puzzle.taps = []
    return puzzle
  }
}

