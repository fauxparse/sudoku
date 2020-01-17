import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { mergeScan, mergeMap, first, map, catchError } from 'rxjs/operators';
import './App.scss';
import Grid from './Grid';
import { Puzzle, Operation } from './types';
import { newPuzzle, isSolved } from './util';
import place from './operations/place';

interface Step {
  operations: Operation[];
}

const findNakedSingles = (puzzle: Puzzle): Observable<Step> =>
  from(
    puzzle.cells
      .filter(cell => !isSolved(cell) && cell.numbers.length === 1)
      .map(cell => ({ operations: [place(cell.numbers[0], cell)] })),
  );

const useStepper = (): [BehaviorSubject<number>, () => void] => {
  const stepper = useRef(new BehaviorSubject<number>(0));

  const step = (): void => {
    stepper.current.next(0);
  };

  return [stepper.current, step];
};

interface Props {
  givens: string;
}

const Sudoku: React.FC<Props> = ({ givens }) => {
  const [step$, nextStep] = useStepper();

  const stream$ = useMemo(
    () =>
      step$.pipe(
        mergeScan(
          puzzle =>
            from([findNakedSingles]).pipe(
              mergeMap(op => op(puzzle).pipe(first())),
              first(),
              catchError(() => of<Step>({ operations: [] })),
              map(step =>
                step.operations.reduce((p: Puzzle, op: Operation) => op.mutate(p), puzzle),
              ),
            ),
          newPuzzle(givens),
        ),
      ),
    [givens, step$],
  );

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    stream$.subscribe(setPuzzle);
  }, [stream$]);

  return (
    <div className="sudoku">
      {puzzle && <Grid puzzle={puzzle} diff={[]} />}

      <button onClick={nextStep}>Step</button>
    </div>
  );
};

export default Sudoku;
