import { Observable } from 'rxjs';
import { map, filter, concat } from 'rxjs/operators';
import { range, partition, flatMap as flat } from 'lodash';
import { Puzzle, Cell, Step, Highlight } from '../types';
import { influence, notate } from '../util';
import { eliminate, place } from '../operations';
import { cycles, nodeSet } from './graph';

export default function xCycles(puzzle: Puzzle): Observable<Step> {
  const cycles$ = cycles(puzzle);

  const rule1 = cycles$.pipe(
    filter(links => {
      if (links.length % 2 !== 0) return false;
      const [even, odd] = partition(range(links.length), i => i % 2 === 0).map(indexes =>
        indexes.map(i => links[i]),
      );
      return even.every(l => l.strong) || odd.every(l => l.strong);
    }),
    map(links => ({
      links,
      cells: Array.from(nodeSet(links)),
      digit: links[0].from[1],
      others: flat(
        links.filter(link => !link.strong),
        ({ from: [from, digit], to: [to] }) =>
          influence([from, to], puzzle.cells).filter(c => c.numbers.includes(digit)),
      ),
    })),
    filter(({ others }) => others.length > 0),
    map(({ links, digit, others }) => ({
      operations: [eliminate(digit, others)],
      description: `X-cycle removes off-chain ${digit} in ${notate(others)}`,
      highlights: [
        {
          kind: 'eliminate',
          cells: others,
          numbers: [digit],
        } as Highlight,
      ],
      links,
    })),
  );

  const rule2 = cycles$.pipe(
    filter(links => links.length % 2 !== 0),
    filter(links => (links[0].strong && links[links.length - 1].strong ? true : false)),
    map(links => ({
      links,
      cell: links[0].from[0],
      digit: links[0].from[1],
    })),
    map(({ links, digit, cell }) => ({
      operations: [place(digit, cell)],
      description: `X-cycle forces ${digit} in ${notate(cell)}`,
      highlights: [
        {
          kind: 'force',
          cells: [cell] as Cell[],
          numbers: [digit],
        } as Highlight,
      ],
      links,
    })),
  );

  const rule3 = cycles$.pipe(
    filter(links => links.length % 2 !== 0),
    filter(links => !links[0].strong && !links[links.length - 1].strong),
    map(links => ({
      links,
      cell: links[0].from[0],
      digit: links[0].from[1],
    })),
    filter(({ digit, cell }) => cell.numbers.includes(digit)),
    map(({ links, digit, cell }) => ({
      operations: [eliminate(digit, cell)],
      description: `X-cycle eliminates ${digit} in ${notate(cell)}`,
      highlights: [
        {
          kind: 'eliminate',
          cells: [cell] as Cell[],
          numbers: [digit],
        } as Highlight,
      ],
      links,
    })),
  );

  return rule1.pipe(concat(rule2), concat(rule3));
}
