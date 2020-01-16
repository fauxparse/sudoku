import { isArray } from 'lodash';
import { Cell } from '../types';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';
import blockIndex from './blockIndex';
import cellIndex from './cellIndex';

type CellOrNumber = Cell | number;
type Param = CellOrNumber | CellOrNumber[] | Set<CellOrNumber>;

function makeIndexArray(n: Param): number[] {
  return (isArray(n) ? n : n instanceof Set ? Array.from(n) : [n]).map(cellIndex);
}

export default function sees(a: Param, b: Param): boolean {
  const as = makeIndexArray(a);
  const bs = makeIndexArray(b);

  return as.some(c1 =>
    bs.some(
      c2 =>
        rowIndex(c1) === rowIndex(c2) ||
        columnIndex(c1) === columnIndex(c2) ||
        blockIndex(c1) === blockIndex(c2),
    ),
  );
}
