import 'mocha'
import { expect } from 'chai'
import { range, repeat } from '../src/utils'

describe('utils.ts', () => {

  describe('function range', () => {
    it('range(number)', () => expect( range(1) ).to.deep.equal( [0] ))
    it('range(number, number)', () => expect( range(2, 4) ).to.deep.equal( [2, 3] ))
    it('range(number, number, number)', () => expect( range(3, 16, 3) ).to.deep.equal( [3, 6, 9, 12, 15] ))
  })

  describe('function repeat', () => {
    it('repeat()', () => {
      let i = 0, j = 0

      repeat(4, iteration => {
        i += 1
        j += iteration
      })
      expect( i ).to.equal( 4 )
      expect( j ).to.equal( 6 )
    })
  })

})

