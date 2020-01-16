import { isArray } from 'lodash';
import { Cell, Operation, CellState } from '../types';
import mutate from './mutate';
import { sees, cellIndex, notate } from '../util';

export default function place(
  n: number,
  target: Cell | Cell[] | number | number[],
  state: CellState = 'placed',
): Operation {
  const indexes = new Set((isArray(target) ? target : [target]).map(cellIndex));

  const confirm = (cell: Cell): Cell => ({ ...cell, numbers: [n], state });

  const clean = (cell: Cell): Cell =>
    cell.numbers.includes(n) ? { ...cell, numbers: cell.numbers.filter(d => d !== n) } : cell;

  const verb = state === 'given' ? 'Given' : 'Place';

  return mutate(
    `${verb} ${n} in ${notate(target)}`,
    (cell: Cell): Cell =>
      indexes.has(cell.index) ? confirm(cell) : sees(cell, indexes) ? clean(cell) : cell,
  );
}
