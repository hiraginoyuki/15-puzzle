import { BoundArray } from './bound_array'

export class Vec2 extends BoundArray<number> {
  0: number
  1: number

  get x (): number { return this[0] }
  set x (v) { this[0] = v }

  get y (): number { return this[1] }
  set y (v) { this[1] = v }

  clone (): Vec2 {
    return new Vec2(...this)
  }

  equals (v: [number, number] | Vec2): boolean {
    return v[0] === this.x && v[1] === this.y
  }

  add (v: number | Vec2): Vec2 {
    const isInstance = v instanceof Vec2
    return new Vec2(
      this.x + (isInstance ? (v as Vec2).x : (v)),
      this.y + (isInstance ? (v as Vec2).y : (v))
    )
  }

  sub (v: number | Vec2): Vec2 {
    return this.add(v instanceof Vec2 ? v.mul(-1) : -v)
  }

  mul (v: number | Vec2): Vec2 {
    const isInstance = v instanceof Vec2
    return new Vec2(
      this.x * (isInstance ? (v as Vec2).x : (v)),
      this.y * (isInstance ? (v as Vec2).y : (v))
    )
  }
}
