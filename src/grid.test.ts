import 'mocha'
import { assert, expect } from 'chai'
import { GridUtil, GridItem, Grid } from '../src/grid'

function map2d<T, U>(array: T[][], callback: (value: T, x: number, y: number, array: T[][]) => U): U[][] {
  return array.map((row, y) => row.map((item, x) => callback(item, x, y, array)))
}

describe('grid.ts', () => {
  const gridA = [
    [ 1, 2 ],
    [ 3, 4 ],
  ]
  const gridB = [
    [ 1, 2, 3 ],
    [ 4, 5, 6 ],
    [ 7, 8, 9 ],
  ]
  const gridC = [
    [ 1 ],
    [ 2, 3 ],
  ]

  describe('namespace GridUtil', () => {
    const width = 4
    const pieces = [
      { x: 1, y: 0, index: 1 },
      { x: 3, y: 0, index: 3 },
      { x: 0, y: 2, index: 8 },
      { x: 1, y: 3, index: 13 },
      { x: 1, y: 5, index: 21 },
    ]

    it('GridUtil.getIndex()', () => pieces.forEach(({ x, y, index }) => assert.equal( GridUtil.getIndex(x, y, width), index )))
    it('GridUtil.getX()',     () => pieces.forEach(({ x,    index }) => assert.equal( GridUtil.getX(index, width), x )))
    it('GridUtil.getY()',     () => pieces.forEach(({    y, index }) => assert.equal( GridUtil.getY(index, width), y )))
    it('GridUtil.getXY()',    () => pieces.forEach(({ x, y, index }) => assert.deepEqual( GridUtil.getXY(index, width), [x, y] )))

    it('GridUtil.checkGrid(grid)', () => {
      expect( GridUtil.checkGrid(gridA) ).to.be.true
      expect( GridUtil.checkGrid(gridB) ).to.be.true
      expect( GridUtil.checkGrid(gridC) ).to.be.false
    })

    it('GridUtil.toGrid()', () => {
      assert.deepEqual( GridUtil.toGrid(gridA.flat(), gridA[0].length, gridA.length), gridA )
      assert.deepEqual( GridUtil.toGrid(gridB.flat(), gridB[0].length, gridB.length), gridB )
    })
  })

  describe('class GridItem', () => {
    it('new GridItem()', () => {
      const x = 1, y = 2, index = 3
      expect( new GridItem(x, y, index) ).to.deep.equal(Object.assign([x, y], { x, y, index }))
    })
  })

  describe('class Grid', () => {
    const toGridItem = (grid: number[][]) => (_: number, x: number, y: number) => new GridItem(x, y, GridUtil.getIndex(x, y, grid[0].length))
    const gridArrayA = map2d(gridA, toGridItem(gridA))
    const gridArrayB = map2d(gridB, toGridItem(gridB))
    const gridInstanceA = new Grid(gridArrayA)
    const gridInstanceB = new Grid(gridArrayB)

    it('new Grid()', () => {
      expect( gridInstanceA ).to.deep.include.ordered.members(gridArrayA)
      expect( gridInstanceB ).to.deep.include.ordered.members(gridArrayB)
    })

    it('Grid.prototype.to1d()', () => {
      assert.deepEqual( gridInstanceA.to1d(), gridArrayA.flat() )
      assert.deepEqual( gridInstanceB.to1d(), gridArrayB.flat() )
    })

    it('Grid.prototype.to2d()', () => {
      assert.deepEqual( gridInstanceA.to2d(), gridArrayA )
      assert.deepEqual( gridInstanceB.to2d(), gridArrayB )
    })

    it('Grid.prototype.get()', () => {
      gridArrayA.flat().every(item => assert.strictEqual( gridInstanceA.get(item.x, item.y), item ))
      gridArrayB.flat().every(item => assert.strictEqual( gridInstanceB.get(item.x, item.y), item ))
    })

    it('Grid.prototype.set()', () => {
      const gridArrayA = map2d(gridA, toGridItem(gridA))
      const gridArrayB = map2d(gridB, toGridItem(gridB))
      const gridInstanceA = new Grid(gridArrayA)
      const gridInstanceB = new Grid(gridArrayB)

      assert.strictEqual( gridInstanceA.set(0, 0, gridArrayA[0][1]), gridInstanceA )
      assert.strictEqual( gridInstanceB.set(0, 0, gridArrayB[1][2]), gridInstanceB )
      assert.strictEqual( gridInstanceA.get(0, 0), gridArrayA[0][1] )
      assert.strictEqual( gridInstanceB.get(0, 0), gridArrayB[1][2] )
    })

    it('Grid.prototype.swap()', () => {
      const gridArrayA = map2d(gridA, toGridItem(gridA))
      const gridArrayB = map2d(gridB, toGridItem(gridB))
      const gridInstanceA = new Grid(gridArrayA)
      const gridInstanceB = new Grid(gridArrayB)
      const itemAa = gridInstanceA.get(0, 0)
      const itemAb = gridInstanceA.get(1, 1)
      const itemBa = gridInstanceB.get(0, 1)
      const itemBb = gridInstanceB.get(1, 2)

      expect( gridInstanceA.swap(itemAa, itemAa) ).to.be.false
      expect( gridInstanceB.swap(itemBa, itemBa) ).to.be.false
      expect( gridInstanceA.swap(itemAa, itemAb) ).to.be.true
      expect( gridInstanceB.swap(itemBa, itemBb) ).to.be.true
      assert.strictEqual( gridInstanceA.get(0, 0), itemAb )
      assert.strictEqual( gridInstanceA.get(1, 1), itemAa )
      assert.strictEqual( gridInstanceB.get(0, 1), itemBb )
      assert.strictEqual( gridInstanceB.get(1, 2), itemBa )
    })
  })

})

