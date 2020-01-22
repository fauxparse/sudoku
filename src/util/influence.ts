import { Cell } from '../types';
import { union, difference, intersection, isArray, isEmpty } from 'lodash';
import row from './row';
import rowIndex from './rowIndex';
import column from './column';
import columnIndex from './columnIndex';
import block from './block';
import blockIndex from './blockIndex';

export default function influence(cell: Cell | Cell[], cells: Cell[]): Cell[] {
  if (isArray(cell)) {
    return isEmpty(cell)
      ? []
      : cell.reduce((result, c) => intersection(influence(c, cells), result), cells);
  } else {
    const thisRow = row(rowIndex(cell), cells);
    const thisColumn = column(columnIndex(cell), cells);
    const thisBlock = block(blockIndex(cell), cells);

    return difference(union(thisRow, thisColumn, thisBlock), [cell]);
  }
}
