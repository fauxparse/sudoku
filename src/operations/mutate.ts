import { isEqual } from 'lodash';
import { Puzzle, Cell, Operation } from '../types';

export default function mutate(
  description: string,
  clean: (cell: Cell, puzzle: Puzzle) => Cell,
): Operation {
  return {
    description,
    mutate: (puzzle: Puzzle): Puzzle => {
      const cells = puzzle.cells.map(cell => clean(cell, puzzle));
      return isEqual(cells, puzzle.cells) ? puzzle : { ...puzzle, cells };
    },
  };
}
