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

export interface Operation {
  description: string;
  mutate: Mutator;
}

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

export interface Step {
  operations: Operation[];
}

export interface State {
  puzzle: Puzzle;
  next: Step;
}
