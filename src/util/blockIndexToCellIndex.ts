export default function blockIndexToCellIndex(block: number, index: number): number {
  const x = (block % 3) * 3;
  const y = Math.floor(block / 3) * 3;
  const u = index % 3;
  const v = Math.floor(index / 3);
  return (y + v) * 9 + x + u;
}
