import { Puzzle, CellState } from '../types';
import eliminate from './eliminate';
import cellIndex from './cellIndex';

export default function place(
  x: number,
  y: number,
  n: number,
  puzzle: Puzzle,
  state: CellState = 'placed',
): Puzzle {
  const index = cellIndex(x, y);
  const cells = puzzle.cells.slice(0);
  cells.splice(index, 1, {
    ...puzzle.cells[index],
    state,
    numbers: [n],
  });
  return eliminate({ ...puzzle, cells });
}
