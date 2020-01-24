import { Observable, from } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';
import { range, uniq, flatten, difference } from 'lodash';
import { Puzzle, Cell } from '../types';
import { row, rowIndex, column, columnIndex, locate, combinations } from '../util';

const MATCHERS = [
  { kind: 'row', major: row, majorIndex: rowIndex, minor: column, minorIndex: columnIndex },
  { kind: 'column', major: column, majorIndex: columnIndex, minor: row, minorIndex: rowIndex },
];

interface Match {
  digit: number;
  cells: Cell[];
  others: Cell[];
}

export default function mesh(order: number, puzzle: Puzzle): Observable<Match> {
  return from(MATCHERS).pipe(
    map(matcher => ({ ...matcher, lines: range(9).map(i => matcher.major(i, puzzle.cells)) })),
    flatMap(matcher => from(range(1, 10)).pipe(map(digit => ({ digit, ...matcher })))),
    map(matcher => {
      const lines = matcher.lines
        .map(line => locate(matcher.digit, line))
        .filter(line => line.length > 1 && line.length <= order);
      return { ...matcher, lines };
    }),
    flatMap(({ lines, ...matcher }) =>
      from(combinations(order, lines)).pipe(
        map(lines => ({ ...matcher, cells: flatten(Array.from(lines)) })),
      ),
    ),
    map(match => ({
      ...match,
      positions: uniq(match.cells.map(match.minorIndex)),
    })),
    map(match => ({
      ...match,
      others: difference(
        locate(match.digit, flatten(match.positions.map(i => match.minor(i, puzzle.cells)))),
        match.cells,
      ),
    })),
    filter(({ positions, others }) => positions.length === order && others.length > 0),
    map(({ digit, cells, others }) => ({ digit, cells, others })),
  );
}
