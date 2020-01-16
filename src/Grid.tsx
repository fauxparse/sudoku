import React from 'react';
import { Puzzle, Diff } from './types';
import Cell from './Cell';

interface Props {
  puzzle: Puzzle;
  diff: Diff;
}

const Grid: React.FC<Props> = ({ puzzle, diff }) => {
  return (
    <div className="grid">
      {puzzle.cells.map((cell, i) => (
        <Cell cell={cell} key={i} diff={diff.find(d => d.index === i)} />
      ))}
    </div>
  );
};

export default Grid;
