import { Cell } from '../types';
import blockIndex from './blockIndex';

export default function block(n: number, cells: Cell[]): Cell[] {
  return cells.filter(c => blockIndex(c) === n);
}
