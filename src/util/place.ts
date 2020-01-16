import { Puzzle, CellState } from '../types';
import eliminate from './eliminate';

export default function place(
  x: number,
  y: number,
  n: number,
  puzzle: Puzzle,
  state: CellState = 'placed',
): Puzzle {
  const index = 9 * y + x;
  const cells = puzzle.cells.slice(0);
  cells.splice(index, 1, {
    ...puzzle.cells[index],
    state,
    numbers: [n],
  });
  return eliminate({ ...puzzle, cells });
}
