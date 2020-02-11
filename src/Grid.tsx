import React from 'react';
import classNames from 'classnames';
import { flatten, uniqBy } from 'lodash';
import { Puzzle, Cell, Highlight, Link } from './types';
import GridCell from './Cell';
import { cellIndex } from './util';

interface Props {
  puzzle: Puzzle;
  highlights?: Highlight[];
  links?: Link[];
}

function endpoint(cell: Cell, n: number): [number, number] {
  const index = cellIndex(cell);
  const x = (index % 9) * 49 + ((n - 1) % 3) * 16 + 8.5;
  const y = Math.floor(index / 9) * 49 + Math.floor((n - 1) / 3) * 16 + 9;
  return [x, y];
}

const Grid: React.FC<Props> = ({ puzzle, highlights = [], links = [] }) => {
  // const links: Link[] = [
  // { from: [puzzle.cells[19], 8], to: [puzzle.cells[24], 8], strong: false },
  // { from: [puzzle.cells[24], 8], to: [puzzle.cells[78], 8], strong: true },
  // { from: [puzzle.cells[78], 8], to: [puzzle.cells[71], 8], strong: false },
  // { from: [puzzle.cells[71], 8], to: [puzzle.cells[65], 8], strong: true },
  // { from: [puzzle.cells[65], 8], to: [puzzle.cells[55], 8], strong: false },
  // { from: [puzzle.cells[55], 8], to: [puzzle.cells[19], 8], strong: true },
  // ];

  const candidates = uniqBy(
    flatten(links.map(link => [link.from, link.to])),
    ([c, n]) => cellIndex(c) * 100 + n,
  );

  return (
    <div className="grid">
      {puzzle.cells.map((cell, i) => (
        <GridCell
          cell={cell}
          key={i}
          highlights={highlights.filter(({ cells }) => cells.includes(cell))}
        />
      ))}
      <svg className="grid__overlay" viewBox="0 0 442 442">
        {links.map(({ from, to, strong }, i) => {
          const [a, b] = cellIndex(from[0]) < cellIndex(to[0]) ? [from, to] : [to, from];
          const [x1, y1] = endpoint(a[0] as Cell, a[1] as number);
          const [x2, y2] = endpoint(b[0] as Cell, b[1] as number);
          const dx = Math.abs(x1 - x2);
          const dy = Math.abs(y1 - y2);
          const d = Math.sqrt(dx * dx + dy + dy);
          const r = 1000 - Math.sqrt(d);
          return (
            <path
              key={`link-${i}`}
              className={classNames('grid__link', !strong && 'grid__link--weak')}
              d={`M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`}
            />
          );
        })}
        {candidates.map(([cell, n]) => {
          const [x, y] = endpoint(cell, n);
          return (
            <circle
              key={cellIndex(cell) * 100 + n}
              className="grid__endpoint"
              cx={x}
              cy={y}
              r={8}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Grid;
