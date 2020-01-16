import { Puzzle, Mutator } from '../types';
import {
  missing,
  block,
  rowIndex,
  columnIndex,
  setName,
  notate,
  row,
  column,
  isSolved,
} from '../util';

export default function pointing(n: number): Mutator {
  return (puzzle: Puzzle): Puzzle => {
    return Array(9)
      .fill(0)
      .map((_, i) => i)
      .reduce((puzzle, b) => {
        const group = block(b, puzzle.cells);
        return missing(group).reduce((puzzle, d) => {
          const matching = block(b, puzzle.cells).filter(c => c.numbers.includes(d));
          if (matching.length === n) {
            const columns = matching.map(({ index }) => columnIndex(index));
            const rows = matching.map(({ index }) => rowIndex(index));
            const affected = (new Set(columns).size === 1
              ? column(columns[0], puzzle.cells)
              : new Set(rows).size === 1
              ? row(rows[0], puzzle.cells)
              : []
            ).filter(c => !isSolved(c) && c.numbers.includes(d) && !matching.includes(c));
            if (affected.length) {
              console.log(`Pointing ${setName(n)} (${d}s) in ${notate(matching)}`);
              return affected.reduce((p, c) => {
                const cells = p.cells.slice();
                cells[c.index] = {
                  ...cells[c.index],
                  numbers: cells[c.index].numbers.filter(x => x !== d),
                };
                return { ...p, cells };
              }, puzzle);
            }
            return puzzle;
          }
          return puzzle;
        }, puzzle);
      }, puzzle);
  };
}
