import { GridUtil } from './grid'
import { Puzzle } from './puzzle'
import { range, repeat } from './utils'
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
  public constructor (pieces: number[][], public seed: string) {
    super(pieces.flat(), pieces[0].length)
  }

  public clone (): RandomPuzzle {
    if (Object.getPrototypeOf(this) !== RandomPuzzle.prototype) throw new NotImplementedError('clone')
    return new RandomPuzzle(this.to2d(), this.seed)
  }

  protected static _parseArgs (args: Args): readonly [string, number, number] {
    const isSeedPassed = typeof args[0] === 'string'
    const seed = isSeedPassed ? args[0] as string : `${+new Date()}`
    const width = isSeedPassed ? typeof args[1] === 'number' ? args[1] : 4 : typeof args[0] === 'number' ? args[0] : 4
    const height = isSeedPassed ? typeof args[2] === 'number' ? args[2] : width : typeof args[1] === 'number' ? args[1] : width

    return [seed, width, height] as const
  }

  public static generate (): RandomPuzzle
  public static generate (size: number): RandomPuzzle
  public static generate (width: number, height: number): RandomPuzzle
  public static generate (seed: string): RandomPuzzle
  public static generate (seed: string, size: number): RandomPuzzle
  public static generate (seed: string, width: number, height: number): RandomPuzzle
  public static generate (...args: Args): RandomPuzzle {
    const [seed, width, height] = RandomPuzzle._parseArgs(args)

    const randomSeed = create(seed)
    const rndItem = <T>(array: T[]): T => chooseItem(array, () => randomSeed.random())
    const rndIndex = <T>(array: T[]): number => chooseIndex(array, () => randomSeed.random())

    const size = width * height
    const numbers: number[] = []
    const unusedNumbers = range(1, size)

    repeat(size - 3, () =>
      numbers.push(unusedNumbers.splice(rndIndex(unusedNumbers), 1)[0]))

    const puzzle = new RandomPuzzle(GridUtil.toGrid(numbers.concat(unusedNumbers, 0), width, height), seed)
    if (!puzzle.isSolvable()) {
      const tmp = puzzle[size - 3]
      puzzle[size - 3] = puzzle[size - 2]
      puzzle[size - 2] = tmp
      puzzle._isSolvable = null
      puzzle._2d = null
      puzzle._isSolving = null
      puzzle._isSolved = null
    }

    const horizontalFirst = rndItem([true, false])
    if (horizontalFirst) {
      puzzle.tap(rndItem(range(puzzle.width)), puzzle.height - 1)
      puzzle.tap(GridUtil.getX(puzzle.indexOf(0), puzzle.width), rndItem(range(puzzle.height)))
    } else {
      puzzle.tap(puzzle.width - 1, rndItem(range(puzzle.height)))
      puzzle.tap(rndItem(range(puzzle.width)), GridUtil.getY(puzzle.indexOf(0), puzzle.width))
    }

    randomSeed.done()
    puzzle.taps = []
    return puzzle
  }
}
