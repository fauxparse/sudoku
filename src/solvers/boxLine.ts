import { range, uniq } from 'lodash';
import { Puzzle } from '../types';
import { row, column, missing, blockIndex, block } from '../util';

export default function boxLine(puzzle: Puzzle): Puzzle {
  return [row, column].reduce((puzzle, fetch) => {
    return range(9).reduce((puzzle, i) => {
      const line = fetch(i, puzzle.cells);
      return missing(line).reduce((puzzle, d) => {
        const locations = line.filter(c => c.numbers.includes(d));
        const boxes = uniq(locations.map(c => blockIndex(c.index)));
        if (boxes.length === 1) {
          const others = block(boxes[0], puzzle.cells).filter(
            c => c.numbers.includes(d) && !locations.includes(c),
          );
          if (others.length) {
            console.log(`Box/line reduction on ${d}s in box ${boxes[0] + 1}`);
            return others.reduce((puzzle, cell) => {
              const cells = puzzle.cells.slice();
              cells[cell.index] = {
                ...cell,
                numbers: cell.numbers.filter(x => x !== d),
              };
              return { ...puzzle, cells };
            }, puzzle);
          }
        }
        return puzzle;
      }, puzzle);
    }, puzzle);
  }, puzzle);
}
