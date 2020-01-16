import { Puzzle } from '../types';
import { isSolved, rowIndex, columnIndex, place } from '../util';

export default function nakedSingles(puzzle: Puzzle): Puzzle {
  const singles = puzzle.cells.filter(cell => !isSolved(cell) && cell.numbers.length === 1);
  if (singles.length) {
    return singles.reduce(
      (p, c) => place(columnIndex(c.index), rowIndex(c.index), c.numbers[0], p),
      puzzle,
    );
  } else {
    return puzzle;
  }
}
