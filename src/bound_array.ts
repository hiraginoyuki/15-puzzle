import * as Objects from './objects'
import { NotImplementedError } from "./classes"

export class BoundArray<T> extends Array<T> {}

const throwCurried = (method: string) => () => { throw new NotImplementedError(method) }
const notImplMethods = [
  'at', 'concat', 'copyWithin', 'fill', 'includes', 'join', 'lastIndexOf',
  'pop', 'push', 'reverse', 'shift', 'some', 'sort', 'splice', 'unshift',
]

const passThroughMethods = [ 'map', 'flatMap', 'flat', 'filter', 'slice', ]
const passThroughCurried = (method: string) => function(...args: any[]) {
  // @ts-ignore
  return Array.prototype[method].apply(Array.from(this), args)
}

Object.assign(BoundArray.prototype,
  Objects.fromKeys(notImplMethods, throwCurried),
  Objects.fromKeys(passThroughMethods, passThroughCurried),
)
