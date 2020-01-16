import { isArray } from 'lodash';
import { Cell, Operation } from '../types';
import mutate from './mutate';
import { notate } from '../util';

export default function eliminate(n: number | number[], target: Cell | Cell[]): Operation {
  const numbers = new Set(isArray(n) ? n : [n]);
  const targets = isArray(target) ? target : [target];
  const indexes = new Set(targets.map(cell => cell.index));

  return mutate(
    `Remove ${Array.from(numbers).join(',')} from ${notate(targets)}`,
    (cell: Cell): Cell =>
      indexes.has(cell.index)
        ? {
            ...cell,
            numbers: cell.numbers.filter(x => !numbers.has(x)),
          }
        : cell,
  );
}
