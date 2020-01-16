import { Puzzle, Cell, Operation } from '../types';
import place from '../operations/place';

const EMPTY = Array(81)
  .fill('.')
  .join('');

function emptyCell(): Cell {
  return {
    index: -1,
    state: 'corner',
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
}

function emptyPuzzle(): Puzzle {
  return {
    cells: Array(EMPTY.length)
      .fill(null)
      .map((_, index) => ({ ...emptyCell(), index })),
  };
}

export default function newPuzzle(givens = EMPTY): Puzzle {
  const chars = givens.split('').slice(0, EMPTY.length);
  while (chars.length < EMPTY.length) {
    chars.push('.');
  }
  return chars
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => /^[1-9]$/.test(char))
    .reduce(
      (ops: Operation[], { char, index }) => [...ops, place(parseInt(char, 10), index, 'given')],
      [],
    )
    .reduce((puzzle, op) => {
      return op.mutate(puzzle);
    }, emptyPuzzle());
}
