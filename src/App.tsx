import React, { useState, useCallback, useMemo } from 'react';
import { isEqual } from 'lodash';
import './App.scss';
import Grid from './Grid';
import { Puzzle } from './types';
import { newPuzzle, diff } from './util';
import solvers from './solvers';

function solve(puzzle: Puzzle): Puzzle {
  const result = { current: puzzle };
  for (let i = 0; i < solvers.length; i++) {
    const solver = solvers[i];
    result.current = solver.solve(result.current);
    if (!isEqual(result.current, puzzle)) {
      console.log(solver.name);
      return result.current;
    }
  }
  return puzzle;
}

const App: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle>(
    newPuzzle('.1..37..........1.6....8.29.7..496..1.......3..935..7.39.2....8.4..........79..6.'),
  );

  const [nextPuzzle, setNextPuzzle] = useState(puzzle);

  const difference = useMemo(() => diff(puzzle, nextPuzzle), [puzzle, nextPuzzle]);

  const step = useCallback(() => {
    setPuzzle(nextPuzzle);
    setNextPuzzle(solve(nextPuzzle));
  }, [nextPuzzle, setPuzzle, setNextPuzzle]);

  return (
    <div className="app">
      <Grid puzzle={puzzle} diff={difference} />

      <button onClick={step}>Step</button>
    </div>
  );
};

export default App;
