export type CellState = 'empty' | 'given' | 'placed' | 'corner';

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

export type HighlightKind = 'force' | 'eliminate' | 'restrict' | 'wing' | 'pivot' | 'red' | 'black';

export interface Highlight {
  kind: HighlightKind;
  cells: Cell[];
  numbers: number[];
}

export interface Step {
  operations: Operation[];
  description?: string;
  highlights?: Highlight[];
}

export interface State {
  puzzle: Puzzle;
  step?: Step;
  diff?: Diff;
}
