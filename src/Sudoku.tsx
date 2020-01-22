import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { mergeScan, mergeMap, first, map, catchError, scan, startWith } from 'rxjs/operators';
import './App.scss';
import Grid from './Grid';
import { Puzzle, Diff, Step, State } from './types';
import { newPuzzle, diff } from './util';
import strategies from './strategies';

const EMPTY_STEP = { operations: [] };

const apply = (step: Step, puzzle: Puzzle): Puzzle =>
  step.operations.reduce((puzzle, { mutate }) => mutate(puzzle), puzzle);

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

function stagger<T>(n = 1) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      scan((buffer: T[], value: T) => [value, ...buffer].slice(0, n + 1), []),
      map((buffer: T[]) => buffer[buffer.length - 1]),
    );
}

function staggerZip<T>(n = 1) {
  return (source: Observable<T>): Observable<T[]> =>
    source.pipe(
      scan((buffer: T[], value: T) => [value, ...buffer].slice(0, n + 1), []),
      map((buffer: T[]) => [buffer[buffer.length - 1], buffer[0]]),
    );
}

const Sudoku: React.FC<Props> = ({ givens }) => {
  const [step$, nextStep] = useStepper();

  const initial = useMemo<State>(() => ({ puzzle: newPuzzle(givens) }), [givens]);

  const solve$ = useMemo<Observable<State>>(
    () =>
      step$.pipe(
        mergeScan(
          ({ puzzle }) =>
            from(strategies).pipe(
              mergeMap(strategy => strategy(puzzle)),
              first(),
              catchError(() => of(EMPTY_STEP)),
              map(step => ({
                puzzle: apply(step, puzzle),
                step,
              })),
            ),
          initial,
        ),
        startWith(initial),
      ),
    [initial, step$],
  );

  const stream$ = useMemo<Observable<State>>(
    () =>
      solve$.pipe(
        staggerZip(),
        map(([current, next]) => ({
          puzzle: current.puzzle,
          step: next.step,
          diff: next.step ? diff(current.puzzle, next.puzzle) : [],
        })),
        stagger(),
      ),
    [solve$],
  );

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const [difference, setDifference] = useState<Diff>([]);

  useEffect(() => {
    stream$.subscribe(({ puzzle, diff }) => {
      setPuzzle(puzzle);
      setDifference(diff || []);
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
