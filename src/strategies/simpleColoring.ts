import { Puzzle, Cell, Step } from '../types';
import { Observable, from, EMPTY, of, concat } from 'rxjs';
import { flatMap, map, filter, tap } from 'rxjs/operators';
import { partition, intersection, isEmpty, flatten, uniq, difference, range } from 'lodash';
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

function findEdges(digit: number, cells: Cell[]): Cell[][] {
  const edges = combinations(2, cells)
    .map(cs => Array.from(cs))
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

function partitionGraph<T>(edges: T[][]): T[][][] {
  return edges.reduce((graphs: T[][][], edge: T[]): T[][][] => {
    const [matching, others] = partition(graphs, graph =>
      graph.some(e => !isEmpty(intersection(e, edge))),
    );
    if (isEmpty(matching)) {
      return [...others, [edge]];
    } else {
      return [...others, [...flatten(matching), edge]];
    }
  }, []);
}

function colorGraph<T>(edges: T[][]): T[][] {
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

export default function simpleColoring(puzzle: Puzzle): Observable<Step> {
  const coloured = from(range(1, 10)).pipe(
    map(digit => ({
      digit,
      cells: puzzle.cells.filter(c => !isSolved(c) && c.numbers.includes(digit)),
    })),
    filter(({ cells }) => cells.length > 0),
    map(({ digit, cells }) => ({ digit, edges: findEdges(digit, cells) })),
    flatMap(({ digit, edges }) =>
      from(partitionGraph(edges)).pipe(map(graph => ({ digit, graph }))),
    ),
    filter(({ graph }) => graph.length > 2),
    map(({ digit, graph }) => ({ digit, graph: colorGraph(graph) })),
  );

  return concat(
    coloured.pipe(
      flatMap(({ digit, graph }) =>
        from(graph).pipe(
          filter(conflicts),
          tap(cells => console.log(`remove colliding ${digit} in ${notate(cells)}`)),
          map(cells => ({ operations: [eliminate(digit, cells)] })),
        ),
      ),
    ),

    coloured.pipe(
      flatMap(({ digit, graph }) => {
        const [red, black] = graph;
        const cells = difference(locate(digit, puzzle.cells), red.concat(black)).filter(
          c => red.some(r => sees(c, r)) && black.some(b => sees(c, b)),
        );
        if (cells.length) {
          console.log(`remove off-chain ${digit} in ${notate(cells)}`);
          return of({ operations: [eliminate(digit, cells)] });
        } else {
          return EMPTY;
        }
      }),
    ),
  );
}
