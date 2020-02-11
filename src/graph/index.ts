export type Edge<T> = [T, T];

export type Graph<T> = Edge<T>[];

function partition<T>(f: (x: T) => boolean, collection: T[]): [T[], T[]] {
  return collection.reduce(
    ([right, left]: [T[], T[]], elem: T): [T[], T[]] =>
      f(elem) ? [[...right, elem], left] : [right, [...left, elem]],
    [[], []],
  );
}

export function nodes<T>(graph: Graph<T>): T[] {
  return Array.from(
    graph.reduce((result: Set<T>, [a, b]: [T, T]) => result.add(a).add(b), new Set()),
  );
}

export function bidirectional<T>(graph: Graph<T>): Graph<T> {
  return graph.concat(graph.map(([a, b]: Edge<T>) => [b, a]));
}

export function stronglyConnectedComponents<T>(graph: Graph<T>): Edge<T>[][] {
  return graph.reduce((components: Edge<T>[][], edge: Edge<T>) => {
    const [a, b] = edge;
    const [right, left] = partition(
      component => component.some(([c, d]: Edge<T>) => a === c || b === c || a === c || a === d),
      components,
    );
    return [...left, right.reduce((cs, c) => cs.concat(c), [edge])];
  }, []);
}

export function findCycles<T>(graph: Graph<T>): T[][] {
  const result: T[][] = [];
  const edges = bidirectional(graph);
  const stack: { current: T[][] } = { current: [...graph] };

  while (stack.current.length) {
    const path = stack.current.shift();
    if (!path) break;

    stack.current = stack.current.filter(
      nodes => nodes.some(n => !path.includes(n)) || path.some(n => !nodes.includes(n)),
    );

    const first: T = path[0];
    const last: T = path[path.length - 1];

    edges.forEach(([a, b]): void => {
      if (a === last) {
        if (b === first && path.length > 2) {
          result.push(path);
        } else if (!path.includes(b)) {
          stack.current.push([...path, b]);
        }
      }
    });
  }

  return result;
}
