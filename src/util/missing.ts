import { Cell } from '../types';
import isSolved from './isSolved';

export default function missing(cells: Cell[]): number[] {
  return cells.reduce(
    (numbers, cell) => (isSolved(cell) ? numbers.filter(n => n !== cell.numbers[0]) : numbers),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
}
