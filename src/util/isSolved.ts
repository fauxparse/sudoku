import { Cell } from '../types';

export default function isSolved(cell: Cell): boolean {
  return cell.state === 'placed' || cell.state === 'given';
}
