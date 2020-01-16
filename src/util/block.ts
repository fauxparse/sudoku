import { Cell } from '../types';
import blockIndexToCellIndex from './blockIndexToCellIndex';

export default function block(n: number, cells: Cell[]): Cell[] {
  return Array(9)
    .fill(0)
    .map((_, i) => cells[blockIndexToCellIndex(n, i)]);
}
