import { Puzzle, Cell, Step, Link } from '../types';
import { Observable, from, of, concat } from 'rxjs';
import { flatMap, map, filter } from 'rxjs/operators';
import { isEmpty, flatten, uniq, difference, range } from 'lodash';
import {
  isSolved,
  combinations,
  rowIndex,
  columnIndex,
  blockIndex,
  sees,
  locate,
  notate,
} from '../util';
import { eliminate } from '../operations';
import { stronglyConnectedComponents } from '../graph';

function findEdges(digit: number, cells: Cell[]): [Cell, Cell][] {
  const edges = combinations(2, cells)
    .map(cs => Array.from(cs))
    .map(([a, b]: Cell[]): [Cell, Cell] => [a, b])
    .filter(
      ([a, b]) =>
        (rowIndex(a) === rowIndex(b) &&
          cells.filter(c => rowIndex(c) === rowIndex(b)).length === 2) ||
        (columnIndex(a) === columnIndex(b) &&
          cells.filter(c => columnIndex(c) === columnIndex(b)).length === 2) ||
        (blockIndex(a) === blockIndex(b) &&
          cells.filter(c => blockIndex(c) === blockIndex(b)).length === 2),
    );
  return edges;
}

function colorGraph<T>(edges: [T, T][]): T[][] {
  if (isEmpty(edges)) return [];

  const nodes: T[] = uniq(flatten(edges));
  const red = new Set<T>([nodes.shift()!]);
  const black = new Set<T>();

  while (nodes.length > 0) {
    const node = nodes.shift()!;
    if (edges.some(edge => edge.includes(node) && edge.some(n => red.has(n)))) {
      black.add(node);
    } else if (edges.some(edge => edge.includes(node) && edge.some(n => black.has(n)))) {
      red.add(node);
    } else {
      nodes.push(node);
    }
  }

  return [Array.from(red), Array.from(black)];
}

function conflicts(cells: Cell[]): boolean {
  return Array.from(combinations(2, cells)).some(([a, b]) => sees(a, b));
}

interface Colored {
  digit: number;
  graph: Cell[][];
  edges: Cell[][];
}

export default function simpleColoring(puzzle: Puzzle): Observable<Step> {
  const coloured = from(range(1, 10)).pipe(
    map(digit => ({
      digit,
      cells: puzzle.cells.filter(c => !isSolved(c) && c.numbers.includes(digit)),
    })),
    filter(({ cells }) => cells.length > 0),
    map(({ digit, cells }) => ({ digit, edges: findEdges(digit, cells) })),
    flatMap(({ digit, edges }) =>
      from(stronglyConnectedComponents(edges)).pipe(map(graph => ({ digit, graph, edges }))),
    ),
    filter(({ graph }) => graph.length > 2),
    map(({ digit, graph, edges }) => ({ digit, graph: colorGraph(graph), edges })),
  );

  return concat(
    coloured.pipe(
      flatMap<Colored, Observable<Step>>(({ digit, graph, edges }) =>
        from(graph).pipe(
          filter(conflicts),
          map(cells => ({
            operations: [eliminate(digit, cells)],
            description: `Simple coloring removes colliding ${digit}s in ${notate(cells)}`,
            highlights: [
              { kind: 'eliminate', cells, numbers: [digit] },
              { kind: 'red', cells, numbers: [] },
              { kind: 'black', cells: graph.find(cs => cs !== cells) || [], numbers: [] },
            ],
            links: edges.map(
              ([a, b]: Cell[]): Link => ({ from: [a, digit], to: [b, digit], strong: true }),
            ),
          })),
        ),
      ),
    ),

    coloured.pipe(
      flatMap<Colored, Observable<Step>>(({ digit, graph, edges }) => {
        const [red, black] = graph;
        const cells = difference(locate(digit, puzzle.cells), red.concat(black)).filter(
          c => red.some(r => sees(c, r)) && black.some(b => sees(c, b)),
        );
        return of(cells).pipe(
          filter(cells => cells.length > 0),
          map(cells => ({
            operations: [eliminate(digit, cells)],
            description: `Simple coloring removes off-chain ${digit} in ${notate(cells)}`,
            highlights: [
              { kind: 'eliminate', cells, numbers: [digit] },
              { kind: 'red', cells: red, numbers: [] },
              { kind: 'black', cells: black, numbers: [] },
            ],
            links: edges.map(
              ([a, b]: Cell[]): Link => ({ from: [a, digit], to: [b, digit], strong: true }),
            ),
          })),
        );
      }),
    ),
  );
}
