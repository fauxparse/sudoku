import { Cell } from '../types';
import cellIndex from './cellIndex';

export default function rowIndex(i: number | Cell): number {
  return Math.floor(cellIndex(i) / 9);
}
