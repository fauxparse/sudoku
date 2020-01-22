import React from 'react';
import classNames from 'classnames';
import { Cell as CellType, Highlight } from './types';
import { isSolved } from './util';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props {
  cell: CellType;
  highlights?: Highlight[];
}

const Cell: React.FC<Props> = ({ cell, highlights = [] }) => {
  const highlighters = highlights.reduce(
    (result, h) =>
      h.numbers.length
        ? {
            ...result,
            [`data-${h.kind}`]: h.numbers.join(' '),
          }
        : result,
    {},
  );

  return (
    <div
      className={classNames(
        'cell',
        `cell--${cell.state}`,
        highlights.filter(h => !h.numbers.length).map(h => `cell--${h.kind}`),
      )}
      {...highlighters}
    >
      {isSolved(cell) && (
        <span className="number" data-number={cell.numbers[0]}>
          {cell.numbers[0]}
        </span>
      )}
      {cell.state === 'corner' &&
        NUMBERS.map(i => (
          <span
            key={i}
            className={classNames(
              'number',
              highlights.filter(h => h.numbers.includes(i)).map(h => `number--${h.kind}`),
            )}
            data-number={i}
          >
            {cell.numbers.includes(i) ? i : ''}
          </span>
        ))}
    </div>
  );
};

export default Cell;
