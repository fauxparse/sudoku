import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { flatten } from 'lodash';
import { Puzzle, Step, Cell } from '../types';
import { isSolved, rowIndex, columnIndex, blockIndex, notate } from '../util';
import { place } from '../operations';

function findOddNumber(pivot: Cell, cells: Cell[]): number {
  return pivot.numbers.find(n =>
    [rowIndex, columnIndex, blockIndex].some(
      f => cells.filter(c => f(c) === f(pivot) && c.numbers.includes(n)).length % 2 === 1,
    ),
  )!;
}

export default function bug(puzzle: Puzzle): Observable<Step> {
  return of(puzzle.cells.filter(c => !isSolved(c))).pipe(
    filter(cells => cells.every(({ numbers }) => numbers.length === 2 || numbers.length === 3)),
    filter(cells => flatten(cells.map(c => c.numbers)).length === cells.length * 2 + 1),
    map(cells => ({ cells, pivot: cells.find(c => c.numbers.length === 3)! })),
    map(({ cells, pivot }) => ({
      pivot,
      number: findOddNumber(pivot, cells),
    })),
    map(
      ({ pivot, number }): Step => ({
        operations: [place(number, pivot)],
        description: `BUG found in ${notate(pivot)}, forces ${number}`,
        highlights: [{ kind: 'pivot', cells: [pivot], numbers: [] }],
      }),
    ),
  );
}
