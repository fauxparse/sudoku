export type CellState = 'empty' | 'given' | 'placed' | 'corner' | 'center';

export interface Cell {
  index: number;
  state: CellState;
  numbers: number[];
}

export interface Puzzle {
  cells: Cell[];
}

export type Mutator = (puzzle: Puzzle) => Puzzle;

export interface Solver {
  name: string;
  solve: Mutator;
}

export interface CellDiff {
  index: number;
  previous: number[];
  numbers: number[];
  state: CellState;
}

export type Diff = CellDiff[];
