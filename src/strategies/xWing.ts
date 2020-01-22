import { Observable, from } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';
import { range, uniq, flatten, difference } from 'lodash';
import { Puzzle, Cell, Step } from '../types';
import { row, rowIndex, column, columnIndex, locate, combinations, notate } from '../util';
import { eliminate } from '../operations';

interface Matcher {
  kind: string;
  major(i: number | Cell, cells: Cell[]): Cell[];
  majorIndex(c: number | Cell): number;
  minor(i: number | Cell, cells: Cell[]): Cell[];
  minorIndex(c: number | Cell): number;
}

interface Match extends Matcher {
  digit: number;
  lines: Cell[][];
  cells?: Cell[];
  others?: Cell[];
  positions?: number[];
}

const MATCHERS: Matcher[] = [
  { kind: 'row', major: row, majorIndex: rowIndex, minor: column, minorIndex: columnIndex },
  { kind: 'column', major: column, majorIndex: columnIndex, minor: row, minorIndex: rowIndex },
];

export default function xWing(puzzle: Puzzle): Observable<Step> {
  return from(MATCHERS).pipe(
    map(matcher => ({ ...matcher, lines: range(9).map(i => matcher.major(i, puzzle.cells)) })),
    flatMap(matcher => from(range(1, 10)).pipe(map(digit => ({ digit, ...matcher })))),
    map(({ digit, lines, ...matcher }) => ({
      ...matcher,
      digit,
      lines: lines.map(line => locate(digit, line)).filter(line => line.length === 2),
    })),
    filter(({ lines }) => lines.length > 1),
    flatMap(({ lines, ...matcher }) =>
      from(combinations(2, lines)).pipe(
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
    filter(({ positions, others }) => positions.length === 2 && others.length > 0),
    map(
      ({ digit, cells, others }): Step => ({
        operations: [eliminate(digit, others)],
        description: `X-Wing on ${digit} in ${notate(cells)}`,
        highlights: [
          { kind: 'wing', cells, numbers: [] },
          { kind: 'eliminate', cells: others, numbers: [digit] },
        ],
      }),
    ),
  );
}
