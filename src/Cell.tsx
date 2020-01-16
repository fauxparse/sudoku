import React from 'react';
import classNames from 'classnames';
import { Cell as CellType, CellDiff } from './types';
import { isSolved } from './util';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props {
  cell: CellType;
  diff?: CellDiff;
}

function subtract<T>(a: T[] | Set<T>, b: T[] | Set<T>): Set<T> {
  const set = new Set(b);
  return new Set(Array.from(a).filter(el => !set.has(el)));
}

const Cell: React.FC<Props> = ({ cell, diff }) => {
  const removed = diff ? Array.from(subtract(diff.previous, diff.numbers)) : [];
  const highlighted =
    diff && diff.state === 'placed' && diff.numbers.length === 1 ? diff.numbers : [];

  return (
    <div
      className={classNames('cell', `cell--${cell.state}`)}
      data-highlighted={highlighted.join(' ')}
      data-removed={removed.join(' ')}
    >
      {isSolved(cell) && (
        <span className="number" data-number={cell.numbers[0]}>
          {cell.numbers[0]}
        </span>
      )}
      {cell.state === 'corner' &&
        NUMBERS.map(i => (
          <span key={i} className="number" data-number={i}>
            {cell.numbers.includes(i) ? i : ''}
          </span>
        ))}
      {cell.state === 'center' &&
        cell.numbers.map(i => (
          <span key={i} className="number" data-number={i}>
            {i}
          </span>
        ))}
    </div>
  );
};

export default Cell;
