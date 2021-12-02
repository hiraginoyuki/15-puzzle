# 15-puzzle 🧩
[15-puzzle](https://github.com/HiraginoYuki/15-puzzle) is a simple 15 puzzle library with many useful features. 😎

## Usage

### Installation
Use [`npm`](https://docs.npmjs.com/) to install (or [`yarn`](https://yarnpkg.com/) if you'd like).
```bash
npm install 15-puzzle
```
Then import the class `RandomPuzzle` from `'15-puzzle'` in your script.
```js
import { RandomPuzzle } from '15-puzzle'      // ES Module
const { RandomPuzzle } = require('15-puzzle') // CommonJS
```

### Generating

You can generate a random valid puzzle using a static method called `generate()` 🎰✨.
To specify the size, give a number for both width and height, two numbers for width and height respectively, or nothing for 4x4.
```js
import { RandomPuzzle } from '15-puzzle'

const foo = RandomPuzzle.generate()      // 4x4
const bar = RandomPuzzle.generate(5)     // 5x5
const baz = RandomPuzzle.generate(6, 7)  // 6x7
```

> See the [type definition](https://github.com/HiraginoYuki/15-puzzle/blob/52e012ac70c9d4b58cba22daeee2220809205574/src/random_puzzle.ts#L36-L41) to learn what you can do. 🧐

Now (actually since [v2.0.2](https://github.com/HiraginoYuki/15-puzzle/blob/d20e8fa0f415b9313d8b6fc4d8cc670b019e3bec/package.json#L24-L25) 😅), as we use [`random-seed`](https://www.npmjs.com/package/random-seed) to generate a puzzle, this feature is actually supported! 🎉
Just give a seed as the first argument. A seed must be a string, and here's [why](https://github.com/HiraginoYuki/15-puzzle/blob/52e012ac70c9d4b58cba22daeee2220809205574/src/random_puzzle.ts#L27).
```js
import { RandomPuzzle } from '15-puzzle'

const foo = RandomPuzzle.generate('kazukazu123123')        // 4x4
const bar = RandomPuzzle.generate('kazukazu123123', 5)     // 5x5
const baz = RandomPuzzle.generate('kazukazu123123', 6, 7)  // 6x7
```

If you have an array of pieces, instead, use `Puzzle` which allows you to create an instance without `seed`. Note that 0 means an empty square.
> FYI, [`RandomPuzzle` actually extends `Puzzle`](https://github.com/HiraginoYuki/15-puzzle/blob/52e012ac70c9d4b58cba22daeee2220809205574/src/random_puzzle.ts#L16). <br>
```js
import { Puzzle } from '15-puzzle'

const pieces = [ [  1 ,  2 ,  3 ,  4 ]
                 [  5 ,  6 ,  7 ,  8 ]
                 [  9 , 10 , 11 , 12 ]
                 [ 13 , 14 , 15 ,  0 ] ]

const puzzle = new Puzzle(pieces)
```

### Checking

You can check if the puzzle is solvable, being solved, or completely solved. 🧐
```js
import { Puzzle } from '15-puzzle'

const foo = new Puzzle([ [  1 ,  2 ,  3 ,  4 ]
                         [  5 ,  6 ,  7 ,  8 ]
                         [  9 , 10 , 11 , 12 ]
                         [ 13 , 14 , 15 ,  0 ] ])
foo.isSolvable() // true
foo.isSolving() // false
foo.isSolved() // true


const bar = new Puzzle([ [  1 ,  2 ,  3 ,  4 ]
                         [  5 ,  6 ,  7 ,  8 ]
                         [  9 , 10 , 11 , 12 ]
                         [ 13 ,  0 , 14 , 15 ] ])
bar.isSolvable() // true
bar.isSolving() // false
bar.isSolved() // false

bar.tap(2, 3)
bar.isSolving() // true
bar.isSolved() // false

bar.tap(3, 3)
bar.isSolving() // false
bar.isSolved() // true


const baz = new Puzzle([ [  1 ,  2 ,  3 ,  4 ]
                         [  5 ,  6 ,  7 ,  8 ]
                         [  9 , 10 , 11 , 12 ]
                         [ 13 , 15 , 14 ,  0 ] ])
baz.isSolvable() // false
```

### Controlling

Use `Puzzle.prototype.tap(x, y)`.
```js
import { RandomPuzzle } from '15-puzzle'

const puzzle = RandomPuzzle.generate('kazukazu123123')
console.log(puzzle.toString())
// +--+--+--+--+
// | 5|  | 1|12|
// +--+--+--+--+
// |13|10| 8| 4|
// +--+--+--+--+
// | 3|14| 6| 7|
// +--+--+--+--+
// |11|15| 9| 2|
// +--+--+--+--+

puzzle.tap(0, 0)
console.log(puzzle.toString())
// +--+--+--+--+
// |  | 5| 1|12|
// +--+--+--+--+
// |13|10| 8| 4|
// +--+--+--+--+
// | 3|14| 6| 7|
// +--+--+--+--+
// |11|15| 9| 2|
// +--+--+--+--+
```

> There's a method called [`swap`](https://github.com/HiraginoYuki/15-puzzle/blob/52e012ac70c9d4b58cba22daeee2220809205574/src/grid.ts#L70-L77) which literally swaps two pieces, but using this method is not recommended, because calling this manually might make the puzzle become unsolvable.
