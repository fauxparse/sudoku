import { Cell } from '../types';
import cellIndex from './cellIndex';

export default function columnIndex(i: number | Cell): number {
  return cellIndex(i) % 9;
}
