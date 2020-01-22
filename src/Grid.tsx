import React from 'react';
import { Puzzle, Highlight } from './types';
import Cell from './Cell';

interface Props {
  puzzle: Puzzle;
  highlights: Highlight[];
}

const Grid: React.FC<Props> = ({ puzzle, highlights = [] }) => {
  return (
    <div className="grid">
      {puzzle.cells.map((cell, i) => (
        <Cell
          cell={cell}
          key={i}
          highlights={highlights.filter(({ cells }) => cells.includes(cell))}
        />
      ))}
    </div>
  );
};

export default Grid;
