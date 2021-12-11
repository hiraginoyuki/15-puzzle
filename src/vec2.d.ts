import { BoundArray } from './bound_array'

export class Vec2 extends BoundArray<number> {
  0: number
  1: number
  x: number
  y: number
  constructor(x: number, y: number)

  clone(): this
  equals(v: [number, number] | Vec2): boolean
  add(v: number | Vec2): Vec2
  sub(v: number | Vec2): Vec2
  mul(v: number | Vec2): Vec2
}

