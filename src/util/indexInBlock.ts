import blockIndex from './blockIndex';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';

export default function indexInBlock(i: number): number {
  const b = blockIndex(i);
  const x = columnIndex(i);
  const y = rowIndex(i);
  const u = (b % 3) * 3;
  const v = Math.floor(b / 3) * 3;
  return (y - v) * 3 + x - u;
}
