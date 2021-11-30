import 'mocha'
import { expect } from 'chai'
import { fromKeys } from '../src/objects'

describe('objects.ts', () => {
  
  describe('function fromKeys', () => {
    it('fromKeys()', () => {
      expect(
        fromKeys(['foo', 'bar', 'baz', 'qux', 'quux'], key => key.toUpperCase() + key.length)
      ).to.deep.equal({
        foo: 'FOO3',
        bar: 'BAR3',
        baz: 'BAZ3',
        qux: 'QUX3',
        quux: 'QUUX4'
      })
    })
  })

})

