import { Link } from '../types';
import notate from './notate';

export default function notateCycle(cycle: Link[]): string {
  return (
    notate(cycle[0].from[0]) +
    cycle
      .map(
        link =>
          `${link.strong ? '=' : '-'}${link.from[1]}${link.strong ? '=' : '-'}${notate(
            link.to[0],
          )}`,
      )
      .join('')
  );
}
