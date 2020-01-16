export default function combinations<T>(
  n: number,
  list: T[],
  prefix: Set<T> = new Set(),
): Set<T>[] {
  if (n === 0) {
    return [prefix];
  } else if (n > list.length) {
    return [];
  } else {
    const yes = combinations(n - 1, list.slice(1), new Set(prefix).add(list[0]));
    const no = combinations(n, list.slice(1), prefix);
    return yes.concat(no);
  }
}
