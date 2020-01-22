import { Observable, from, of } from 'rxjs';
import { map, filter, flatMap, distinct } from 'rxjs/operators';
import { range } from 'lodash';
import { row, column, block, missing, cellIndex, locate, influence, notate } from '../util';
import { place } from '../operations';
import { Puzzle, Step } from '../types';

export default (puzzle: Puzzle): Observable<Step> =>
  of(row, column, block).pipe(
    flatMap(fetch => from(range(9).map(i => fetch(i, puzzle.cells)))),
    flatMap(cells => from(missing(cells).map(n => ({ n, cells: locate(n, cells) })))),
    filter(({ cells }) => cells.length === 1),
    distinct(({ cells }) => cellIndex(cells[0])),
    map(({ cells, n }) => ({
      operations: [place(n, cells[0])],
      description: `Hidden ${n} in ${notate(cells)}`,
      highlights: [
        { kind: 'force', cells, numbers: [n] },
        { kind: 'eliminate', cells: influence(cells, puzzle.cells), numbers: [n] },
      ],
    })),
  );
