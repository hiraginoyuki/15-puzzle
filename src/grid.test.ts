import 'mocha'
import { assert, expect } from 'chai'
import { GridUtil } from '../src/grid'

describe('grid.ts', () => {
  const gridA = [
    [1, 2],
    [3, 4]
  ]
  const gridB = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
  const gridC = [
    [1],
    [2, 3]
  ]

  describe('namespace GridUtil', () => {
    const width = 4
    const pieces = [
      { x: 1, y: 0, index: 1 },
      { x: 3, y: 0, index: 3 },
      { x: 0, y: 2, index: 8 },
      { x: 1, y: 3, index: 13 },
      { x: 1, y: 5, index: 21 }
    ]

    it('GridUtil.getIndex()', () => pieces.forEach(({ x, y, index }) => assert.equal(GridUtil.getIndex(x, y, width), index)))
    it('GridUtil.getX()', () => pieces.forEach(({ x, index }) => assert.equal(GridUtil.getX(index, width), x)))
    it('GridUtil.getY()', () => pieces.forEach(({ y, index }) => assert.equal(GridUtil.getY(index, width), y)))
    it('GridUtil.getXY()', () => pieces.forEach(({ x, y, index }) => assert.deepEqual(GridUtil.getXY(index, width), [x, y])))

    it('GridUtil.checkGrid(grid)', () => {
      expect(GridUtil.checkGrid(gridA)).to.be.true
      expect(GridUtil.checkGrid(gridB)).to.be.true
      expect(GridUtil.checkGrid(gridC)).to.be.false
    })

    it('GridUtil.toGrid()', () => {
      assert.deepEqual(GridUtil.toGrid(gridA.flat(), gridA[0].length, gridA.length), gridA)
      assert.deepEqual(GridUtil.toGrid(gridB.flat(), gridB[0].length, gridB.length), gridB)
    })
  })
})
