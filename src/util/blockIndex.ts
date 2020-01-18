import { Cell } from '../types';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';

export default function blockIndex(i: number | Cell): number {
  const u = Math.floor(columnIndex(i) / 3);
  const v = Math.floor(rowIndex(i) / 3);
  return v * 3 + u;
}
