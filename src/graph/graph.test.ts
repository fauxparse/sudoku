import { Graph, findCycles } from './index';

describe('findCycles', () => {
  it('finds all the cycles', () => {
    const graph: Graph<string> = [
      ['A', 'B'],
      ['C', 'A'],
      ['C', 'B'],
      ['D', 'E'],
    ];
    expect(findCycles(graph)).toStrictEqual([['A', 'B', 'C']]);
  });
});
