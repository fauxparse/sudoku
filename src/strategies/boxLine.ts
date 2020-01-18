import { Observable, from, of, EMPTY } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { difference, range, uniq } from 'lodash';
import { Puzzle, Step } from '../types';
import { missing, locate, blockIndex, row, column, block } from '../util';
import { eliminate } from '../operations';

export default (puzzle: Puzzle): Observable<Step> =>
  of(row, column).pipe(
    flatMap(fetch => from(range(9)).pipe(map(i => fetch(i, puzzle.cells)))),
    flatMap(cells =>
      from(missing(cells)).pipe(map(number => ({ number, cells: locate(number, cells) }))),
    ),
    flatMap(({ number, cells }) => {
      const blocks = uniq(cells.map(blockIndex));
      if (blocks.length === 1) {
        return of({
          number,
          cells,
          others: difference(locate(number, block(blocks[0], puzzle.cells)), cells),
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
