import { Cell } from '../types';
import columnIndex from './columnIndex';

export default function column(x: number, cells: Cell[]): Cell[] {
  return cells.filter(c => columnIndex(c) === x);
}
