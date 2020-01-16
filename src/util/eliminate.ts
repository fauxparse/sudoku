import { Puzzle, Cell } from '../types';
import isSolved from './isSolved';
import rowIndex from './rowIndex';
import columnIndex from './columnIndex';
import blockIndex from './blockIndex';
import indexInBlock from './indexInBlock';
import row from './row';
import column from './column';
import block from './block';
import remove from './remove';

function replaceRow(y: number, base: Cell[], replacement: Cell[]): Cell[] {
  return base.map((cell, i) => (rowIndex(i) === y ? replacement[i % 9] : cell));
}

function replaceColumn(x: number, base: Cell[], replacement: Cell[]): Cell[] {
  return base.map((cell, i) => (columnIndex(i) === x ? replacement[Math.floor(i / 9)] : cell));
}

function replaceBlock(n: number, base: Cell[], replacement: Cell[]): Cell[] {
  return base.map((cell, i) => (blockIndex(i) === n ? replacement[indexInBlock(i)] : cell));
}

export default function eliminate(puzzle: Puzzle): Puzzle {
  let cells = puzzle.cells.slice();
  const givens = cells.map((cell, i) => ({ index: i, cell })).filter(({ cell }) => isSolved(cell));
  givens.forEach(({ index, cell }) => {
    const x = columnIndex(index);
    const y = rowIndex(index);
    const b = blockIndex(index);
    const n = cell.numbers[0];
    cells = replaceRow(
      y,
      cells,
      row(y, cells).map(c => remove(n, c)),
    );
    cells = replaceColumn(
      x,
      cells,
      column(x, cells).map(c => remove(n, c)),
    );
    cells = replaceBlock(
      b,
      cells,
      block(b, cells).map(c => remove(n, c)),
    );
  });
  return {
    ...puzzle,
    cells,
  };
}
