import { isArray, uniq } from 'lodash';
import { Cell } from '../types';
import cellIndex from './cellIndex';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';

function product<T, R>(first: T[], second: R[]): [T, R][] {
  return first.reduce((r, a) => r.concat(second.map(b => [a, b])), [] as [T, R][]);
}

export default function notate(cell: Cell | number | (Cell | number)[]): string {
  if (isArray(cell)) {
    const rows = uniq(cell.map(rowIndex).sort());
    const columns = uniq(cell.map(columnIndex).sort());
    const grid = product(columns, rows).reduce((set, coords) => set.add(coords.join()), new Set());

    if (
      (rows.length < cell.length || columns.length < cell.length) &&
      cell.every(c => grid.has(`${columnIndex(c)},${rowIndex(c)}`))
    ) {
      return `r${rows.map(r => r + 1).join('')}c${columns.map(c => c + 1).join('')}`;
    } else {
      return cell.map(notate).join('/');
    }
  } else {
    const row = rowIndex(cellIndex(cell));
    const column = columnIndex(cellIndex(cell));
    return `r${row + 1}c${column + 1}`;
  }
}
