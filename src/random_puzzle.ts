import { Puzzle } from './puzzle'
import { create } from 'random-seed'
import { NotImplementedError } from './classes'

const { floor } = Math

type Args =
  | []
  | [number]
  | [number, number]
  | [string]
  | [string, number]
  | [string, number, number]

export class RandomPuzzle extends Puzzle {
  public constructor (pieces: number[], width: number, public seed: string) {
    super(pieces, width)
  }

  public clone (): RandomPuzzle {
    if (Object.getPrototypeOf(this) !== RandomPuzzle.prototype) throw new NotImplementedError('clone')
    return new RandomPuzzle(this, this.width, this.seed)
  }

  protected static _parseArgs (args: Args): readonly [string, number, number] {
    const isSeedPassed = typeof args[0] === 'string'
    const seed = isSeedPassed ? args[0] as string : `${Date.now()}`
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

    const size = width * height
    const numbers: number[] = []
    const unusedNumbers = [...new Array(size).keys()]
    unusedNumbers.shift()

    for (let i = 3; i < size; i++) {
      numbers.push(unusedNumbers.splice(floor(randomSeed.random() * unusedNumbers.length), 1)[0])
    }

    const puzzle = new RandomPuzzle(numbers.concat(unusedNumbers, 0), width, seed)
    if (!puzzle.isSolvable()) {
      const tmp = puzzle[size - 3]
      puzzle[size - 3] = puzzle[size - 2]
      puzzle[size - 2] = tmp
      puzzle._isSolvable = null
      puzzle._2d = null
      puzzle._isSolving = null
      puzzle._isSolved = null
    }

    const horizontalFirst = randomSeed.random() < 0.5
    if (horizontalFirst) {
      puzzle.tap(floor(randomSeed.random() * puzzle.width), puzzle.height - 1)
      puzzle.tap(puzzle.indexOf(0) % puzzle.width, floor(randomSeed.random() * puzzle.height))
    } else {
      puzzle.tap(puzzle.width - 1, floor(randomSeed.random() * puzzle.height))
      puzzle.tap(floor(randomSeed.random() * puzzle.width), floor(puzzle.indexOf(0) / puzzle.width))
    }

    randomSeed.done()
    puzzle.taps = []
    return puzzle
  }
}
