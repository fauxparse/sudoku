import { Puzzle, Mutator, Cell } from '../types';
import { row, column, block, isSolved, notate, missing, combinations, setName } from '../util';

function isSuperset<T>(set: Set<T> | T[], subset: Set<T> | T[]): boolean {
  set = new Set(set);
  for (const elem of Array.from(subset)) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

function intersects<T>(a: T[] | Set<T>, b: T[] | Set<T>): boolean {
  const set = new Set(a);
  for (const el of Array.from(b)) {
    if (set.has(el)) return true;
  }
  return false;
}

function setsOf(n: number, group: Cell[]): { numbers: number[]; cells: Cell[] }[] {
  return combinations(n, missing(group))
    .map(set => ({
      numbers: Array.from(set),
      cells: group.filter(cell => !isSolved(cell) && isSuperset(set, cell.numbers)),
    }))
    .filter(({ cells }) => cells.length === n);
}

export default function nakedCandidates(n: number): Mutator {
  return (puzzle: Puzzle): Puzzle => {
    const phases = [row, column, block];
    return phases.reduce((memo: Puzzle, fetch) => {
      const result = { current: memo };
      for (let i = 0; i < 9; i++) {
        const group = fetch(i, result.current.cells);
        setsOf(n, group).forEach(({ numbers, cells }) => {
          const others = group.filter(
            c => !isSolved(c) && !cells.includes(c) && intersects(numbers, c.numbers),
          );
          if (others.length) {
            console.log(`${numbers.join()} ${setName(n)} in ${notate(cells)}`);
            const newCells = result.current.cells.slice();
            others.forEach(c => {
              newCells[c.index] = {
                ...c,
                numbers: c.numbers.filter(n => !numbers.includes(n)),
              };
            });
            result.current = { ...result.current, cells: newCells };
          }
        });
      }
      return result.current;
    }, puzzle);
  };
}
