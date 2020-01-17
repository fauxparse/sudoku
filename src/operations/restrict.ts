import { isArray } from 'lodash';
import { Cell, Operation } from '../types';
import { notate } from '../util';
import mutate from './mutate';

export default function restrict(n: number | number[], target: Cell | Cell[]): Operation {
  const numbers = new Set(isArray(n) ? n : [n]);
  const targets = isArray(target) ? target : [target];
  const indexes = new Set(targets.map(cell => cell.index));

  return mutate(
    `Leave only ${Array.from(numbers).join(',')} in ${notate(targets)}`,
    (cell: Cell): Cell =>
      indexes.has(cell.index)
        ? {
            ...cell,
            numbers: cell.numbers.filter(x => numbers.has(x)),
          }
        : cell,
  );
}
