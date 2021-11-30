import { NotImplementedError } from './classes'
import { Grid, GridItem } from './grid'
import { range, repeat } from './utils'
import { Vec2 } from './vec2'

export class Piece extends GridItem {
  constructor(
    x: number,
    y: number,
    index: number,
    public readonly id: number
  ) { super(x, y, index) }
}
export interface TapData {
  time: number
  delta: number
  x: number
  y: number
  index: number
  piece: Piece
  movedPieces: Piece[]
}
export class Puzzle extends Grid<Piece> {
  public taps: TapData[] = []
  public constructor(pieces: Piece[][] | number[][]) {
    super(pieces[0][0] instanceof Piece 
      ? pieces as Piece[][]
      : pieces.map((row, indexOfRow) => row.map((id, indexInRow) => (
        new Piece(indexInRow, indexOfRow, indexOfRow * pieces[0].length + indexInRow, id as number)
      )))
    )
  }

  public clone() {
    if (Object.getPrototypeOf(this) !== Puzzle.prototype) throw new NotImplementedError('clone')
    return new Puzzle( this.to2d().map(row => row.map(piece => piece.id)) )
  }

  public readonly timeGenerated = +new Date()
  public get timeStarted() { return this.taps.length ? this.taps.at(0)!.time : null }
  public get timeSolved() { return this.taps.length && this.isSolved() ? this.taps.at(-1)!.time : null }
  protected _isSolvable: boolean | null = null
  protected _isSolving: boolean | null = null
  protected _isSolved: boolean | null = null
  public isSolvable(): boolean | null { return this._isSolvable ??= this.checkSolvable() }
  public isSolving(): boolean | null { return this._isSolving ??= this.checkSolving() }
  public isSolved(): boolean | null { return this._isSolved ??= this.checkSolved() }
  public checkSolvable() {
    const cloned = this.clone()
    if (!cloned.get(0).equals(new Vec2(cloned.width - 1, cloned.height - 1))) {
      cloned.tap(cloned.width - 1, cloned.get(0).y)
      cloned.tap(cloned.width - 1, cloned.height - 1)
    }
    const swapCount = range(cloned.size - 2).reduce((acc, i) => {
      const j = cloned.to1d()[i]
      const k = cloned.get(i + 1)
      if (j !== k) {
        cloned.swap(j, k)
        return acc + 1
      } else return acc
    }, 0)
    return swapCount % 2 === 0
  }
  public checkSolving() {
    return this.timeStarted !== null && this.timeSolved === null
  }
  public checkSolved() {
    return this.isSolvable()
        && range(1, this.width * this.height).concat(0).every((n, i) => this.to1d()[i].id === n);
  }

  public toString() {
    const maxLength = Math.floor(Math.log(this.width * this.height - 1) / Math.log(10)) + 1
    const separator = '+' + ('-'.repeat(maxLength) + '+').repeat(this.width)
    return `${separator}\n` + this.map(
      row => '|' + row.map(({ id }) => (id || '').toString().padStart(maxLength, ' ')).join('|') + '|'
    ).join(`\n${separator}\n`) + `\n${separator}`
  }

  public get(x: number, y: number): Piece
  public get(id: number): Piece
  public get(...args: number[]) {
    // @ts-ignore
    if (args.length === 2) return super.get(...args)
    const [id] = args
    if (id < 0 || this.size <= id) throw new RangeError('invalid id')
    return this.to1d().find(piece => piece.id === id)
  }

  public set(x: number, y: number, piece: Piece) {
    this._isSolvable = null
    this._isSolving = null
    this._isSolved = null
    return super.set(x, y, piece)
  }

  public tap(x: number, y: number) {
    if (!Number.isInteger(x) || x < 0 || this.width <= x) throw new RangeError('x is out of range')
    if (!Number.isInteger(y) || y < 0 || this.height <= y) throw new RangeError('y is out of range')
    const tappedPiece = this.get(x, y)
    const emptyPiece = this.get(0)
    // @ts-ignore
    if (!( emptyPiece.x === tappedPiece.x ^ emptyPiece.y === tappedPiece.y )) return null

    const distance = Math.abs(emptyPiece.x - tappedPiece.x + emptyPiece.y - tappedPiece.y)
    const direction = new Vec2(
      -(tappedPiece.x < emptyPiece.x) + +(emptyPiece.x < tappedPiece.x),
      -(tappedPiece.y < emptyPiece.y) + +(emptyPiece.y < tappedPiece.y),
    )

    const movedPieces: Piece[] = []

    repeat(distance, () => {
      const emptyPiece = this.get(0)
      const movedPiece = this.get(...emptyPiece.add(direction) as [number, number])
      movedPieces.push(movedPiece)
      this.swap(movedPiece, emptyPiece) 
    })

    const time = +new Date()
    const tapData: TapData = {
      time,
      delta: time - (this.taps.at(-1)?.delta ?? this.timeGenerated),
      x,
      y,
      index: tappedPiece.index,
      piece: tappedPiece,
      movedPieces
    }

    this.taps.push(tapData)

    return tapData
  }
}
