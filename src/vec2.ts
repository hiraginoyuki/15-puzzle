class Vec2Base extends Array<number> {
  readonly length = 2;
  constructor(
    public x: number,
    public y: number,
  ) { super(x, y); }
  get 0() { return this.x; }
  get 1() { return this.y; }
  set 0(v) { this.x = v; }
  set 1(v) { this.y = v; }
  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}
export class Vec2 extends Vec2Base {
  add(v: number | Vec2) {
    const isInstance = v instanceof Vec2;
    return new Vec2(
      this.x + (isInstance ? (v as Vec2).x : (v as number)),
      this.y + (isInstance ? (v as Vec2).y : (v as number)),
    );
  }
  mul(v: number | Vec2) {
    const isInstance = v instanceof Vec2;
    return new Vec2(
      this.x * (isInstance ? (v as Vec2).x : (v as number)),
      this.y * (isInstance ? (v as Vec2).y : (v as number)),
    );
  }
  equalTo(vec: Vec2) {
    return vec.x === this.x && vec.y === this.y;
  }
}
