import { Cell } from '../types';

export default function locate(n: number, cells: Cell[]): Cell[] {
  return cells.filter(c => c.numbers.includes(n));
}
