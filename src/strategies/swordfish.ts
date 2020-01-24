import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Puzzle, Step } from '../types';
import { notate } from '../util';
import { eliminate } from '../operations';
import mesh from './mesh';

export default function swordfish(puzzle: Puzzle): Observable<Step> {
  return mesh(3, puzzle).pipe(
    map(
      ({ digit, cells, others }): Step => ({
        operations: [eliminate(digit, others)],
        description: `Swordfish in ${notate(cells)} removes ${digit}s in ${notate(others)}`,
        highlights: [
          { kind: 'wing', cells, numbers: [] },
          { kind: 'eliminate', cells: others, numbers: [digit] },
        ],
      }),
    ),
  );
}
