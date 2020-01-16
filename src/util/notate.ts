import { isArray, uniq } from 'lodash';
import { Cell } from '../types';
import cellIndex from './cellIndex';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';

function allSame<T>(items: T[]): boolean {
  return uniq(items).length === 1;
}

export default function notate(cell: Cell | number | (Cell | number)[]): string {
  if (isArray(cell)) {
    const rows = cell.map((c: Cell | number) => rowIndex(cellIndex(c)) + 1);
    const columns = cell.map((c: Cell | number) => columnIndex(cellIndex(c)) + 1);

    if (allSame(rows)) {
      return `r${rows[0]}c${columns.join('')}`;
    } else if (allSame(columns)) {
      return `r${rows.join('')}c${columns[0]}`;
    } else {
      return cell.map(notate).join('/');
    }
  } else {
    const row = rowIndex(cellIndex(cell));
    const column = columnIndex(cellIndex(cell));
    return `r${row + 1}c${column + 1}`;
  }
}
