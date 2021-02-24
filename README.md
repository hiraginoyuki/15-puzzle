# 15-puzzle 🧩
[15-puzzle](https://github.com/HiraginoYuki/15-puzzle) is a simple 15 puzzle library that contains many kinds of useful features. 😎

## Usage

Use [`npm`](https://docs.npmjs.com/) to install. 😃
```sh
npm install 15-puzzle
```
Then, import the class `FifteenPuzzle` from `'15-puzzle'` in your script. 📦
```js
import { FifteenPuzzle } from '15-puzzle';
// or...
const { FifteenPuzzle } = require('15-puzzle');
```
Nothing is default-exported because I don't really like the style. 😋

### Generating

You can generate a random but solvable puzzle using `generateRandom()`. 🎰✨ <br>
Also, you can adjust the size of the puzzle. 🛠 <br> <br>

Here is an example:
```js
const puzzle1 = FifteenPuzzle.generateRandom();      // generates a random 4x4 puzzle
                FifteenPuzzle.generateRandom(4);     // same as above 👆
                FifteenPuzzle.generateRandom(4, 4);  // same as above 👆

const puzzle2 = FifteenPuzzle.generateRandom(5);     // generates a random 5x5 puzzle
const puzzle3 = FifteenPuzzle.generateRandom(3, 4);  // generates a random 3x4 puzzle
```

Sadly, because we use `Math.random()` in `generateRandom()`, we can't have a specific seed of generated puzzle at this point. 😥 <br>
In the future, we will be supporting this feature. 😅 <br> <br>

You can either manually get an array of the numbers of the pieces and instantiate FiteenPuzzle using it. 👍 <br>
Example:
```js
// Note that the number list must be a 2D array and 0 means empty.
const numbers4 = [  1 ,  2 ,  3 ,  4 ,
                    5 ,  6 ,  7 ,  8 ,
                    9 , 10 , 11 , 12 ,
                   13 , 14 , 15 ,  0 ];

const numbers5 = [  1 ,  5 ,  9 , 13 ,
                    2 ,  6 , 10 , 14 ,
                    3 ,  7 , 11 , 15 ,
                    4 ,  8 , 12 ,  0 ];

const puzzle4 = new FifteenPuzzle(4, numbers4);
const puzzle5 = new FifteenPuzzle(4, numbers5);
```

### Checking

You can check if the puzzle is valid, solvable, or solved. 🧐

Example (using puzzles declared in the above example):
```js
puzzle4.isValid();  // => true
puzzle5.isValid();  // => true

puzzle4.isSolvable();  // => true
puzzle5.isSolvable();  // => false

puzzle4.isSolved();  // => true
puzzle5.isSolved();  // => false
```
