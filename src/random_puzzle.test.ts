import 'mocha'
import { expect } from 'chai'
import { RandomPuzzle } from '../src/random_puzzle'
import { repeat } from '../src/utils'

describe('random_puzzle.ts', () => {

  describe('class RandomPuzzle', () => {
    const sizes = [
      [2],
      [3],
      [4],
      [2, 3],
      [3, 4],
      [4, 2],
    ]

    it('RandomPuzzle.generate()', () => (
      sizes.forEach(size => repeat(32, () => (
        // @ts-ignore
        expect( RandomPuzzle.generate(...size).isSolvable() ).to.be.true
      )))
    ))

    it('RandomPuzzle._parseArgs()', () => {
      for (const [ args, parsedArgs ] of [
        [ [            ], [        4, 4] ],
        [ [        3   ], [        3, 3] ],
        [ [        3, 2], [        3, 2] ],
        [ ['kazu'      ], ['kazu', 4, 4] ],
        [ ['kazu', 3   ], ['kazu', 3, 3] ],
        [ ['kazu', 3, 2], ['kazu', 3, 2] ],
        // @ts-ignore
      ]) expect( RandomPuzzle._parseArgs(args) ).to.include.members( parsedArgs )
    })
  })

})

