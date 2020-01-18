import { Observable, from, of, EMPTY } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { difference, range, uniq } from 'lodash';
import { Puzzle, Step } from '../types';
import { missing, locate, rowIndex, columnIndex, row, column, block } from '../util';
import { eliminate } from '../operations';

export default (puzzle: Puzzle): Observable<Step> =>
  from(range(9)).pipe(
    map(i => block(i, puzzle.cells)),
    flatMap(cells =>
      from(missing(cells)).pipe(map(number => ({ number, cells: locate(number, cells) }))),
    ),
    flatMap(({ number, cells }) => {
      const rows = uniq(cells.map(rowIndex));
      const columns = uniq(cells.map(columnIndex));
      if (rows.length === 1) {
        return of({
          number,
          cells,
          others: difference(locate(number, row(rows[0], puzzle.cells)), cells),
        });
      } else if (columns.length === 1) {
        return of({
          number,
          cells,
          others: difference(locate(number, column(columns[0], puzzle.cells)), cells),
        });
      } else {
        return EMPTY;
      }
    }),
    filter(({ others }) => others.length > 0),
    map(({ number, others }) => ({
      operations: [eliminate(number, others)],
    })),
  );
