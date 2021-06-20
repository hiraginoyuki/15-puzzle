const { FifteenPuzzle } = require('./dist');
const puzzle = FifteenPuzzle.generateRandom();
console.log(puzzle.isSolvable);
console.log(puzzle.checkSolvable());
console.log(Array.from(puzzle).map(row => JSON.stringify(row.map(piece => piece.id))).join("\n"));
