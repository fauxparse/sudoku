import { Cell } from '../types';
import rowIndex from './rowIndex';

export default function row(y: number, cells: Cell[]): Cell[] {
  return cells.filter(c => rowIndex(c) === y);
}
