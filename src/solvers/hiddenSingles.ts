import { Puzzle } from '../types';
import { row, column, block, columnIndex, rowIndex, missing, place } from '../util';

export default function hiddenSingles(puzzle: Puzzle): Puzzle {
  const phases = [row, column, block];
  return phases.reduce((memo: Puzzle, fetch) => {
    const result = { current: memo };
    for (let i = 0; i < 9; i++) {
      const cells = fetch(i, result.current.cells);
      missing(cells).forEach(n => {
        const relevant = cells.filter(cell => cell.numbers.includes(n));
        if (relevant.length === 1) {
          const { index } = relevant[0];
          result.current = place(columnIndex(index), rowIndex(index), n, result.current);
        }
      });
    }
    return result.current;
  }, puzzle);
}
