import { isObject } from 'lodash';
import { Cell } from '../types';

export default function cellIndex(cell: Cell | number): number {
  return isObject(cell) ? cell.index : cell;
}
