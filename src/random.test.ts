import 'mocha'
import { expect } from 'chai'
import { range, repeat } from '../src/utils'
import { chooseIndex, chooseItem } from '../src/random'
import { create } from 'random-seed'

describe('random.ts', () => {
  const array = range(32)

  const randomSeed = create(Math.random().toString())
  const getRandom = () => randomSeed.random()

  describe('function chooseIndex', () => {
    it('chooseIndex(any[])', () => repeat(100, () => {
      expect(chooseIndex(array)).to.be.greaterThanOrEqual(0).and.lessThan(array.length)
    }))

    it('chooseIndex(any[], () => number)', () => repeat(100, () => {
      expect(chooseIndex(array, getRandom)).to.be.greaterThanOrEqual(0).and.lessThan(array.length)
    }))
  })

  describe('function chooseItem', () => {
    it('chooseItem(any[])', () => repeat(100, () => {
      expect(chooseItem(array)).to.be.oneOf(array)
    }))

    it('chooseItem(any[], () => number)', () => repeat(100, () => {
      expect(chooseItem(array, getRandom)).to.be.oneOf(array)
    }))
  })
})
