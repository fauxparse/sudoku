import { Observable, from } from 'rxjs';
import { filter, map, flatMap } from 'rxjs/operators';
import { flatMap as flat, range, difference } from 'lodash';
import { Puzzle, Cell, Link } from '../types';
import {
  locate,
  combinations,
  row,
  rowIndex,
  column,
  columnIndex,
  block,
  blockIndex,
} from '../util';

type Fetcher = (i: number, cs: Cell[]) => Cell[];
type Indexer = (c: Cell) => number;

const FINDERS: [Fetcher, Indexer][] = [
  [row, rowIndex],
  [column, columnIndex],
  [block, blockIndex],
];

export function links(puzzle: Puzzle): Observable<Link[]> {
  return from(range(1, 10)).pipe(
    map(digit => {
      const cells = locate(digit, puzzle.cells);
      const pairs = Array.from(combinations(2, cells)).map(cs => Array.from(cs));

      return flat(FINDERS, ([fetch, index]) =>
        pairs
          .filter(([a, b]) => index(a) === index(b))
          .map(
            ([from, to]: Cell[]): Link => ({
              from: [from, digit],
              to: [to, digit],
              strong: locate(digit, fetch(index(from), puzzle.cells)).length === 2,
            }),
          ),
      );
    }),
    filter(links => links.length > 0),
  );
}

export function nodeSet(links: Link[]): Set<Cell> {
  return new Set(flat(links.map(({ from: [from], to: [to] }) => [from, to])));
}

function stronglyConnected(links: Link[]): Link[][] {
  return links.reduce((components: Link[][], link: Link): Link[][] => {
    const {
      from: [a],
      to: [b],
    } = link;
    const right = components.filter((component: Link[]) =>
      component.some(({ from: [c], to: [d] }) => a === c || b === c || a === c || a === d),
    );
    const left = difference(components, right);
    return [...left, right.reduce((cs, c) => cs.concat(c), [link])];
  }, []);
}

export function cycles(puzzle: Puzzle): Observable<Link[]> {
  return links(puzzle).pipe(
    flatMap(links => from(stronglyConnected(links))),
    filter(links => links.length > 2),
    flatMap(links => {
      const edges = links.concat(
        links.map(({ from, to, ...link }) => ({ from: to, to: from, ...link })),
      );
      const strongEdges = edges.filter(edge => edge.strong);
      const stack: { cells: Cell[]; path: Link[] }[] = Array.from(nodeSet(edges)).map(cell => ({
        cells: [cell],
        path: [],
      }));
      const result: Link[][] = [];

      while (stack.length > 0) {
        const candidate = stack.shift();
        if (!candidate) break;
        const { cells, path } = candidate;

        const first = cells[0];
        const last = cells[cells.length - 1];

        // Ensure alternating strong/weak links, but allow for arbitrary start and
        // let strong links act as weak links
        const needsStrong = path.some((link, i) => !link.strong && i % 2 !== path.length % 2);
        const candidateEdges = needsStrong ? strongEdges : edges;

        candidateEdges.forEach(edge => {
          const {
            from: [from],
            to: [to],
          } = edge;

          if (from === last) {
            if (to === first && cells.length > 2) {
              result.push([...path, edge] as Link[]);
            } else if (!cells.includes(to)) {
              stack.push({
                cells: [...cells, to],
                path: [...path, edge],
              });
            }
          }
        });
      }

      return from(result);
    }),
  );
}
