import { Observable, EMPTY } from 'rxjs';
import { range } from 'lodash';
import { Puzzle, Cell, Step } from '../types';
import { row, column, block, locate } from '../util';

function product<T, R>(first: T[], second: R[]): [T, R][] {
  const initial: [T, R][] = [];
  return first.reduce(
    (result, a: T): [T, R][] => [...result, ...second.map((b: R): [T, R] => [a, b])],
    initial,
  );
}

function conjugatePairs(n: number, cells: Cell[]): Cell[][] {
  return product([row, column, block], range(9))
    .map(([fetch, i]) => locate(n, fetch(i, cells)))
    .filter(line => line.length === 2);
}

export default function xCycles(puzzle: Puzzle): Observable<Step> {
  return EMPTY;
}
