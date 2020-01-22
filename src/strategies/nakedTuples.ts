import { Observable, from, of } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';
import { range, difference } from 'lodash';
import { row, column, block, missing, combinations, notate, groupName } from '../util';
import { eliminate } from '../operations';
import { Puzzle, Step } from '../types';

function isSuperset<T>(set: Set<T> | T[], subset: Set<T> | T[]): boolean {
  set = new Set(set);
  for (const elem of Array.from(subset)) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function intersects<T>(a: T[] | Set<T>, b: T[] | Set<T>): boolean {
  const set = new Set(a);
  for (const el of Array.from(b)) {
    if (set.has(el)) return true;
  }
  return false;
}

export default (n: number) => (puzzle: Puzzle): Observable<Step> =>
  of(row, column, block).pipe(
    flatMap(fetch => from(range(9).map(i => fetch(i, puzzle.cells)))),
    flatMap(cells =>
      from(
        combinations(n, missing(cells)).map(numbers => ({
          cells: cells.filter(c => intersects(numbers, c.numbers)),
          group: cells.filter(c => isSuperset(numbers, c.numbers)),
          numbers,
        })),
      ),
    ),
    filter(({ group, cells }) => group.length === n && cells.length > n),
    map(step => ({
      ...step,
      others: difference(step.cells, step.group),
      numbers: Array.from(step.numbers),
    })),
    map(({ group, numbers, others }) => ({
      operations: [eliminate(Array.from(numbers), others)],
      description: `Naked ${numbers.join(',')} ${groupName(n)} in ${notate(group)}`,
      highlights: [
        { kind: 'restrict', cells: group, numbers },
        { kind: 'eliminate', cells: others, numbers },
      ],
    })),
  );
