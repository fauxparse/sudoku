import { Cell } from '../types';

export default function column(x: number, cells: Cell[]): Cell[] {
  return Array(9)
    .fill(0)
    .map((_, y) => cells[y * 9 + x]);
}
