import { BoundArray } from "./bound_array"

const descriptors = {
  0: { get() { return this.x }, set(v) { this.x = v } },
  1: { get() { return this.y }, set(v) { this.y = v } },
}
export class Vec2 extends BoundArray {
  constructor(x, y) {
    super(x, y)
    this.x = x
    this.y = y
    Object.defineProperties(this, descriptors)
  }

  clone() {
    return new Vec2(...this)
  }
  equals(v) {
    return v[0] === this.x && v[1] === this.y
  }

  add(v) {
    const isInstance = v instanceof Vec2
    return new Vec2(
      this.x + (isInstance ? v.x : v),
      this.y + (isInstance ? v.y : v),
    )
  }
  sub(v) {
    return this.add(v instanceof Vec2 ? v.mul(-1) : -v)
  }
  mul(v) {
    const isInstance = v instanceof Vec2
    return new Vec2(
      this.x * (isInstance ? v.x : v),
      this.y * (isInstance ? v.y : v),
    )
  }
}

