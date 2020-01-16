import { range, values, groupBy } from 'lodash';
import { Puzzle } from '../types';
import { row, rowIndex, column, columnIndex, missing, notate } from '../util';

const MATCHERS = [
  { kind: 'row', major: row, minor: column, minorIndex: columnIndex },
  { kind: 'column', major: column, minor: row, minorIndex: rowIndex },
];

export default function xWing(puzzle: Puzzle): Puzzle {
  return MATCHERS.reduce((puzzle, { kind, major, minor, minorIndex }) => {
    return range(1, 10).reduce((puzzle, digit) => {
      const lines = range(9)
        .map(i => major(i, puzzle.cells))
        .filter(cs => missing(cs).includes(digit))
        .map(cs => cs.filter(c => c.numbers.includes(digit)))
        .filter(line => line.length === 2);
      const pairs = values(groupBy(lines, cs => cs.map(c => minorIndex(c.index)).join())).filter(
        cs => cs.length === 2,
      );
      return pairs.reduce((puzzle, lines) => {
        const wings = lines[0].concat(lines[1]);
        const across = lines[0]
          .map(c => minor(minorIndex(c.index), puzzle.cells))
          .reduce((all, line) => all.concat(line), [])
          .filter(c => !wings.includes(c) && c.numbers.includes(digit));
        if (across.length) {
          console.log(`X-wing (${kind}, ${digit}s) on ${notate(wings)}`);
          return across.reduce((puzzle, c) => {
            const cells = puzzle.cells.slice();
            cells[c.index] = {
              ...c,
              numbers: c.numbers.filter(d => d !== digit),
            };
            return { ...puzzle, cells };
          }, puzzle);
        }
        return puzzle;
      }, puzzle);
    }, puzzle);
  }, puzzle);
}
