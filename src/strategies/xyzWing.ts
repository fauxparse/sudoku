import { Observable, from } from 'rxjs';
import { filter, map, flatMap } from 'rxjs/operators';
import { isEmpty, difference, union, intersection } from 'lodash';
import { Puzzle, Step } from '../types';
import { combinations, influence, notate } from '../util';
import { eliminate } from '../operations';

export default function xyzWing(puzzle: Puzzle): Observable<Step> {
  return from(puzzle.cells).pipe(
    filter(cell => cell.numbers.length === 3),
    map(pivot => ({
      pivot,
      wings: influence(pivot, puzzle.cells).filter(
        cell => cell.numbers.length === 2 && isEmpty(difference(cell.numbers, pivot.numbers)),
      ),
    })),
    flatMap(({ pivot, wings }) =>
      from(combinations(2, wings)).pipe(
        map(cells => Array.from(cells)),
        filter(
          cells =>
            union(...cells.map(c => c.numbers))
              .sort()
              .join() === pivot.numbers.join(),
        ),
        map(wings => ({ pivot, wings })),
      ),
    ),
    map(match => ({
      ...match,
      number: intersection(...match.wings.map(c => c.numbers))[0],
    })),
    map(({ pivot, wings, number }) => ({
      pivot,
      wings,
      number,
      others: influence([pivot, ...wings], puzzle.cells).filter(c => c.numbers.includes(number)),
    })),
    filter(({ others }) => others.length > 0),
    map(({ pivot, wings, others, number }) => ({
      operations: [eliminate(number, others)],
      description: `XYZ-Wing: pivot ${notate(pivot)}, wings ${notate(
        wings,
      )} removes ${number} from ${notate(others)}`,
      highlights: [
        { kind: 'pivot', cells: [pivot], numbers: [] },
        { kind: 'wing', cells: wings, numbers: [] },
        { kind: 'eliminate', cells: others, numbers: [number] },
      ],
    })),
  );
}
