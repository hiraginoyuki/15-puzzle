/* eslint-disable @typescript-eslint/no-namespace */
export namespace GridUtil {
  export function getIndex (x: number, y: number, width: number): number {
    return x + y * width
  }
  export function getX (index: number, width: number): number {
    return index % width
  }
  export function getY (index: number, width: number): number {
    return Math.floor(index / width)
  }
  export function getXY (index: number, width: number): [number, number] {
    return [getX(index, width), getY(index, width)]
  }

  export function checkGrid (array: unknown[][]): boolean {
    return (
      Array.isArray(array) &&
      array.every(Array.isArray) &&
      array.every(aisle => aisle.length === array[0].length)
    )
  }
  export function toGrid<T> (items: T[], width: number, height: number): T[][] {
    return [...Array(height)].map((_, y) => items.slice(y * width, (y + 1) * width))
  }
}
