import { Cell } from '../types';

export default function row(y: number, cells: Cell[]): Cell[] {
  return cells.slice(y * 9, y * 9 + 9);
}
