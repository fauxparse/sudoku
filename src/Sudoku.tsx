import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { mergeScan, mergeMap, first, map, catchError } from 'rxjs/operators';
import './App.scss';
import Grid from './Grid';
import { Puzzle, Diff, Step, State } from './types';
import { newPuzzle, diff } from './util';
import strategies from './strategies';

const EMPTY_STEP = { operations: [] };

const apply = (step: Step, puzzle: Puzzle): Puzzle =>
  step.operations.reduce((puzzle, op) => {
    console.log(op.description);
    return op.mutate(puzzle);
  }, puzzle);

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

  const stream$ = useMemo<Observable<State>>(
    () =>
      step$.pipe(
        mergeScan(
          ({ puzzle, next }: State): Observable<State> => {
            if (next) {
              const nextPuzzle = apply(next, puzzle);
              return from(strategies).pipe(
                mergeMap(op => op(nextPuzzle)),
                first(),
                catchError(() => of(EMPTY_STEP)),
                map(step => ({
                  puzzle: nextPuzzle,
                  next: step,
                })),
              );
            } else {
              return of({ puzzle, next: EMPTY_STEP });
            }
          },
          { puzzle: newPuzzle(givens) },
        ),
      ),
    [givens, step$],
  );

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const [difference, setDifference] = useState<Diff>([]);

  useEffect(() => {
    stream$.subscribe(({ puzzle, next }) => {
      setPuzzle(puzzle);
      if (next) {
        setDifference(diff(puzzle, apply(next, puzzle)));
      }
    });
  }, [stream$]);

  return (
    <div className="sudoku">
      {puzzle && <Grid puzzle={puzzle} diff={difference} />}

      <button onClick={nextStep}>Step</button>
    </div>
  );
};

export default Sudoku;
