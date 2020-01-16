import { isEqual, zip } from 'lodash';
import { Puzzle, Cell, Diff } from '../types';

export default function diff(was: Puzzle, now: Puzzle): Diff {
  return zip(was.cells, now.cells)
    .filter(([a, b]) => a && b && !isEqual(a, b))
    .map(([a, b]) => ({
      index: (a as Cell).index,
      previous: (a as Cell).numbers,
      numbers: (b as Cell).numbers,
      state: (b as Cell).state,
    }));
}
