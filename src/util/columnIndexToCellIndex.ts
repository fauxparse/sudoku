export default function columnIndexToCellIndex(x: number, y: number): number {
  return y * 9 + x;
}
