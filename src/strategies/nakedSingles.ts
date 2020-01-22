import { Observable, from } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { isSolved } from '../util';
import { place } from '../operations';
import { Puzzle, Step } from '../types';

export default (puzzle: Puzzle): Observable<Step> => {
  return from(puzzle.cells).pipe(
    filter(cell => !isSolved(cell) && cell.numbers.length === 1),
    map(cell => ({ operations: [place(cell.numbers[0], cell)] })),
  );
};
