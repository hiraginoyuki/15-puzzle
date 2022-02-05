import 'mocha'
import { expect } from 'chai'
import { NotImplementedError } from './classes'

describe('classes.ts', () => {
  describe('class NotImplementedError', () => {
    it('new NotImplementedError()', () => {
      const methodName = 'foo'

      expect(new NotImplementedError(methodName))
        .to.be.an.instanceOf(NotImplementedError).and.be.an.instanceOf(Error)
        .and.have.property('message', `method .${methodName}() is not implemented`)
    })
  })
})
