import React from 'react';
import classNames from 'classnames';
import { Cell as CellType, Highlight } from './types';

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
      {cell.numbers.map(n => (
        <span
          key={n}
          className={classNames(
            'number',
            highlights.filter(h => h.numbers.includes(n)).map(h => `number--${h.kind}`),
          )}
          data-number={n}
        >
          {n}
        </span>
      ))}
    </div>
  );
};

export default Cell;
