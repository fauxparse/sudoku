import { Cell } from '../types';
import isSolved from './isSolved';

export default function remove(n: number, cell: Cell, except: Cell[] = []): Cell {
  if (!isSolved(cell) && cell.numbers.includes(n) && !except.includes(cell)) {
    return { ...cell, numbers: cell.numbers.filter(x => x !== n) };
  } else {
    return cell;
  }
}
