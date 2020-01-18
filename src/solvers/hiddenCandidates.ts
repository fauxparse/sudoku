import { Puzzle, Mutator, Cell } from '../types';
import { row, column, block, notate, missing, combinations, setName } from '../util';

function union<T>(a: Set<T> | T[], b: Set<T> | T[]): Set<T> {
  return Array.from(b).reduce((set, el) => set.add(el), new Set(a));
}

interface Dictionary<T> {
  [key: number]: T;
}

function setsOf(n: number, group: Cell[]): { numbers: number[]; cells: Cell[] }[] {
  const digits = missing(group);
  const locations: Dictionary<Set<Cell>> = digits.reduce(
    (h, d) => ({ ...h, [d]: group.filter(c => c.numbers.includes(d)) }),
    {},
  );
  return combinations(n, digits)
    .map(s => Array.from(s))
    .map(numbers => {
      const cells: Cell[] = Array.from(numbers.map(d => locations[d]).reduce(union, new Set()));
      return { numbers, cells };
    })
    .filter(({ cells }) => cells.length === n && cells.some(c => c.numbers.length > n));
}

export default function hiddenCandidates(n: number): Mutator {
  return (puzzle: Puzzle): Puzzle => {
    const phases = [row, column, block];
    return phases.reduce((memo: Puzzle, fetch) => {
      const result = { current: memo };
      for (let i = 0; i < 9; i++) {
        const group = fetch(i, result.current.cells);
        setsOf(n, group).forEach(({ numbers, cells }) => {
          console.log(`Hidden ${numbers.join()} ${setName(n)} in ${notate(cells)}`);
          const newCells = result.current.cells.slice();
          cells.forEach(c => {
            newCells[c.index] = {
              ...c,
              numbers: c.numbers.filter(n => numbers.includes(n)),
            };
          });
          result.current = { ...result.current, cells: newCells };
        });
      }
      return result.current;
    }, puzzle);
  };
}
