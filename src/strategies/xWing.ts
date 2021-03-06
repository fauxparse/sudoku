import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Puzzle, Step } from '../types';
import { notate } from '../util';
import { eliminate } from '../operations';
import mesh from './mesh';

export default function xWing(puzzle: Puzzle): Observable<Step> {
  return mesh(2, puzzle).pipe(
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
