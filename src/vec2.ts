import { BoundArray } from "./bound_array"

export class Vec2 extends BoundArray<number> {
  0: number
  1: number
  constructor(
    x: number,
    y: number,
  ) { super(x, y) }
  get x() { return this[0] }
  get y() { return this[1] }
  set x(v) { this[0] = v }
  set y(v) { this[1] = v }

  clone() {
    return new Vec2(...this as [number, number])
  }
  equals(v: [number, number] | Vec2) {
    return v[0] === this.x && v[1] === this.y
  }

  add(v: number | Vec2) {
    const isInstance = v instanceof Vec2;
    return new Vec2(
      this.x + (isInstance ? (v as Vec2).x : (v as number)),
      this.y + (isInstance ? (v as Vec2).y : (v as number)),
    );
  }
  sub(v: number | Vec2) {
    return this.add(v instanceof Vec2 ? v.mul(-1) : -v)
  }
  mul(v: number | Vec2) {
    const isInstance = v instanceof Vec2;
    return new Vec2(
      this.x * (isInstance ? (v as Vec2).x : (v as number)),
      this.y * (isInstance ? (v as Vec2).y : (v as number)),
    );
  }
}

