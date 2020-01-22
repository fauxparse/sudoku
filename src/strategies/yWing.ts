import { Observable, from } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { Puzzle, Cell, Step } from '../types';
import { isSolved, combinations, influence, sees } from '../util';
import { eliminate } from '../operations';

interface YWing {
  pivot: Cell;
  wings: Cell[];
  number: number;
}

function findYWing({ pivot, wings }: { pivot: Cell; wings: Cell[] }): YWing | false {
  const [a, b] = pivot.numbers;

  if (!wings[0] || !wings[1] || sees(wings[0], wings[1])) return false;

  const wingA = wings.find(c => c.numbers.includes(a));
  const wingB = wings.find(c => c.numbers.includes(b));

  if (!wingA || !wingB || wingA === wingB) return false;

  const ca = wingA.numbers.filter(n => n !== a)[0];
  const cb = wingB.numbers.filter(n => n !== b)[0];

  if (ca !== cb) return false;

  return {
    pivot,
    wings: [wingA, wingB],
    number: ca,
  };
}

export default function yWing(puzzle: Puzzle): Observable<Step> {
  return from(puzzle.cells).pipe(
    filter(c => !isSolved(c) && c.numbers.length === 2),
    flatMap(cell =>
      from(
        Array.from(
          combinations(
            2,
            influence(cell, puzzle.cells).filter(c => c.numbers.length === 2),
          ),
        ),
      ).pipe(map(wings => ({ pivot: cell, wings: Array.from(wings) }))),
    ),
    map(findYWing),
    filter((y: YWing | false): y is YWing => y !== false),
    map(y => ({
      ...y,
      others: influence(y.wings, puzzle.cells).filter(c => c.numbers.includes(y.number)),
    })),
    filter(({ others }) => others.length > 0),
    map(({ others, number }) => ({
      operations: [eliminate(number, others)],
    })),
  );
}
