import { Observable, of, from } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';
import { range, difference } from 'lodash';
import { Puzzle, Step } from '../types';
import { row, column, block, combinations, missing, locate } from '../util';
import { restrict } from '../operations';

export default (n: number) => (puzzle: Puzzle): Observable<Step> =>
  of(row, column, block).pipe(
    flatMap(fetch => from(range(9)).pipe(map(i => fetch(i, puzzle.cells)))),
    flatMap(cells =>
      from(combinations(n, missing(cells))).pipe(
        map(numbers => ({ numbers: Array.from(numbers), cells: locate(numbers, cells) })),
      ),
    ),
    filter(
      ({ cells, numbers }) =>
        cells.length === n && cells.some(cell => difference(cell.numbers, numbers).length > 0),
    ),
    map(({ cells, numbers }) => ({
      operations: [restrict(numbers, cells)],
    })),
  );
