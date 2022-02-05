import 'mocha'
import { expect, assert } from 'chai'
import { Vec2 } from '../src/vec2'

describe('vec2.ts', () => {
  describe('class Vec2', () => {
    const vecA = new Vec2(1, 2)
    const vecB = new Vec2(3, 4)
    const i = 5

    it('Vec2.prototype[Symbol.iterator]()', () => {
      const iteratorA = vecA[Symbol.iterator]()
      expect(iteratorA.next()).to.own.include({ value: vecA.x })
      expect(iteratorA.next()).to.own.include({ value: vecA.y })
      expect(iteratorA.next()).to.own.include({ done: true })
      expect([...vecA]).to.deep.equal(new Vec2(vecA.x, vecA.y))

      const iteratorB = vecB[Symbol.iterator]()
      expect(iteratorB.next()).to.own.include({ value: vecB.x })
      expect(iteratorB.next()).to.own.include({ value: vecB.y })
      expect(iteratorB.next()).to.own.include({ done: true })
      expect([...vecB]).to.deep.equal(new Vec2(vecB.x, vecB.y))
    })

    it('Vec2.prototype.equals()', () => {
      expect(vecA.equals([vecA.x, vecA.y])).to.be.true
      expect(vecA.equals(new Vec2(vecA.x, vecA.y))).to.be.true
    })
    it('Vec2.prototype.clone()', () => {
      expect(vecA.equals(vecA.clone())).to.be.true
    })
    it('Vec2.prototype.add()', () => {
      assert.deepEqual(vecA.add(i), new Vec2(vecA.x + i, vecA.y + i))
      assert.deepEqual(vecA.add(vecB), new Vec2(vecA.x + vecB.x, vecA.y + vecB.y))
    })
    it('Vec2.prototype.sub()', () => {
      assert.deepEqual(vecA.sub(i), new Vec2(vecA.x - i, vecA.y - i))
      assert.deepEqual(vecA.sub(vecB), new Vec2(vecA.x - vecB.x, vecA.y - vecB.y))
    })
    it('Vec2.prototype.mul()', () => {
      assert.deepEqual(vecA.mul(i), new Vec2(vecA.x * i, vecA.y * i))
      assert.deepEqual(vecA.mul(vecB), new Vec2(vecA.x * vecB.x, vecA.y * vecB.y))
    })
    it('Vec2.prototype.{x, y} set', () => {
      const vecA = new Vec2(1, 2)
      const vecB = new Vec2(3, 4)

      vecA.x = 3
      vecA.y = 4
      vecB.x = 1
      vecB.y = 2

      assert.equal(vecA.x, vecA[0])
      assert.equal(vecA.y, vecA[1])
      assert.equal(vecB.x, vecB[0])
      assert.equal(vecB.y, vecB[1])
    })
  })
})
