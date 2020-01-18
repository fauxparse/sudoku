import { Cell } from '../types';
import { isArray, intersection } from 'lodash';

export default function locate(n: number | number[] | Set<number>, cells: Cell[]): Cell[] {
  const numbers = n instanceof Set ? Array.from(n) : isArray(n) ? n : [n];
  return cells.filter(c => intersection(numbers, c.numbers).length > 0);
}
