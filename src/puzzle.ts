import { NotImplementedError } from './classes'
import { OwnedEventEmitter } from './events'
import { range } from './utils'
import { insert } from './strings'

export interface TapData {
  time: number
  delta: number
  x: number
  y: number
  index: number
  piece: number
  movedPieces: MovedPiece[]
}

export interface MovedPiece {
  index: number
  id: number
}

interface ToStringOptions {
  marginWidth?: number
  marginHeight?: number
  color?: number
}
export class Puzzle extends Array<number> {
  public readonly events: OwnedEventEmitter<Puzzle>
  public readonly width: number
  public readonly height: number
  public taps: TapData[] = []
  public constructor (pieces: number[], width: number) {
    super(pieces.length)
    pieces.forEach((id, i) => { this[i] = id })
    this.width = width
    this.height = pieces.length / width
    this.events = new OwnedEventEmitter(this)
  }

  protected _2d: number[][] | null = null
  public to2d (): number[][] {
    if (this._2d !== null) return this._2d
    this._2d = []
    for (let y = 0; y < this.height; y++) {
      this._2d.push(this.slice(y * this.width, (y + 1) * this.width))
    }
    return this._2d
  }

  public clone (): Puzzle {
    if (Object.getPrototypeOf(this) !== Puzzle.prototype) throw new NotImplementedError('clone')
    return new Puzzle(this, this.width)
  }

  public readonly timeGenerated = Date.now()
  public get timeStarted (): number | null {
    return this.taps.at(0)?.time ?? null
  }

  public get timeSolved (): number | null {
    if (!this.isSolved()) return null
    return this.taps.at(-1)?.time ?? null
  }

  protected _isSolvable: boolean | null = null
  protected _isSolving: boolean | null = null
  protected _isSolved: boolean | null = null
  public isSolvable (): boolean {
    const result = this._isSolvable ??= this.checkSolvable()
    return result
  }

  public isSolving (): boolean {
    const result = this._isSolving ??= this.checkSolving()
    return result
  }

  public isSolved (): boolean {
    const result = this._isSolved ??= this.checkSolved()
    return result
  }

  public checkSolvable (): boolean {
    const cloned = new Puzzle(this, this.width)
    if (cloned.at(-1) !== 0) {
      cloned.tap(cloned.width - 1, Math.floor(cloned.indexOf(0) / cloned.width))
      cloned.tap(cloned.width - 1, cloned.height - 1)
    }
    let isEven = true
    for (let currentIndex = 0, targetIndex, targetValue, assigneeValue; currentIndex < cloned.length - 1; currentIndex++) {
      targetValue = cloned[currentIndex]
      targetIndex = targetValue - 1
      if (currentIndex === targetIndex) continue
      while (true) {
        assigneeValue = cloned[targetIndex]
        cloned[targetIndex] = targetValue
        targetValue = assigneeValue
        targetIndex = targetValue - 1
        isEven = !isEven
        if (currentIndex === targetIndex) break
      }
      cloned[targetIndex] = targetValue
    }
    return isEven
  }

  public checkSolving (): boolean {
    return this.timeStarted !== null && this.timeSolved === null
  }

  public checkSolved (): boolean {
    return this.isSolvable() && range(1, this.length).concat(0).every((n, i) => this[i] === n)
  }

  public toString ({ marginWidth, marginHeight, color }: ToStringOptions = {}): string {
    const flip = '\x1b[30;47m'
    const reset = '\x1b[0m'

    const maxLength = Math.floor(Math.log(this.length - 1) / Math.log(10)) + 1
    const gridWidth = 2 * (marginWidth ?? 0) + maxLength
    const gridHeight = 2 * (marginHeight ?? 0) + 1
    const separator = '+' + ('-'.repeat(gridWidth) + '+').repeat(this.width)
    const row = '|' + (' '.repeat(gridWidth) + '|').repeat(this.width)

    const grid = [separator, ...Array(this.height).fill(Array(gridHeight).fill(row).concat(separator)).flat()]

    this.to2d().map(row => row.slice().reverse()).forEach((row, y) => {
      row.forEach((id, x) => {
        const y1 = (1 + gridHeight) * y + 1 + (marginHeight ?? 0)
        grid[y1] = insert(grid[y1], (id ?? '').toString().padStart(maxLength, ' '), (1 + gridWidth) * x + 1 + (marginWidth ?? 0), true)
        const index = x + y * this.width

        if (color !== undefined && id - 1 === index) {
          for (let i = 0; i < gridHeight; i++) {
            const y2 = (1 + gridHeight) * y + 1 + i
            grid[y2] = insert(grid[y2], reset, (1 + gridWidth) * x + 1 + gridWidth)
            grid[y2] = insert(grid[y2], flip, (1 + gridWidth) * x + 1)
          }
        }
      })
    })

    return grid.join('\n')
  }

  public set (x: number, y: number, piece: number): this {
    this._isSolvable = null
    this._2d = null
    this._isSolving = null
    this._isSolved = null
    this[x + y * this.width] = piece
    return this
  }

  public tap (x: number, y: number): TapData | null {
    if (!Number.isInteger(x) || x < 0 || this.width <= x) throw new RangeError('x is out of range')
    if (!Number.isInteger(y) || y < 0 || this.height <= y) throw new RangeError('y is out of range')
    const emptyPieceIndex = this.indexOf(0)
    const emptyPieceX = emptyPieceIndex % this.width
    const emptyPieceY = Math.floor(emptyPieceIndex / this.width)
    const isSameX = emptyPieceX === x
    if (isSameX === (emptyPieceY === y)) return null

    let movedPieces: MovedPiece[]
    const tappedPieceIndex = x + y * this.width
    if (isSameX) {
      let index = emptyPieceIndex
      movedPieces = []
      if (emptyPieceY < y) {
        for (; index < tappedPieceIndex; index += this.width) {
          movedPieces.push({ index, id: this[index] = this[index + this.width] })
        }
      } else {
        for (; tappedPieceIndex < index; index -= this.width) {
          movedPieces.push({ index, id: this[index] = this[index - this.width] })
        }
      }
    } else {
      if (emptyPieceX < x) {
        movedPieces = this.slice(emptyPieceIndex + 1, tappedPieceIndex + 1).map((id, i) => ({ index: i + emptyPieceIndex, id }))
        this.copyWithin(emptyPieceIndex, emptyPieceIndex + 1, tappedPieceIndex + 1)
      } else {
        movedPieces = this.slice(emptyPieceIndex, tappedPieceIndex).map((id, i) => ({ index: i + emptyPieceIndex, id }))
        this.copyWithin(tappedPieceIndex + 1, tappedPieceIndex, emptyPieceIndex)
      }
    }

    const time = Date.now()
    const tapData: TapData = {
      time,
      delta: time - (this.taps.at(-1)?.delta ?? this.timeGenerated),
      x,
      y,
      index: tappedPieceIndex,
      piece: this[tappedPieceIndex],
      movedPieces
    }
    this[tappedPieceIndex] = 0
    this._isSolvable = null
    this._2d = null
    this._isSolving = null
    this._isSolved = null

    this.taps.push(tapData)
    this.events.emit('tap', tapData)

    return tapData
  }
}

Object.defineProperty(Puzzle, Symbol.species, { value: Array })
