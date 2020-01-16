import nakedSingles from './nakedSingles';
import hiddenSingles from './hiddenSingles';
import nakedCandidates from './nakedCandidates';
import hiddenCandidates from './hiddenCandidates';
import pointing from './pointing';
import boxLine from './boxLine';
import xWing from './xWing';

export default [
  {
    name: 'Naked singles',
    solve: nakedSingles,
  },
  {
    name: 'Hidden singles',
    solve: hiddenSingles,
  },
  {
    name: 'Naked pairs',
    solve: nakedCandidates(2),
  },
  {
    name: 'Naked triples',
    solve: nakedCandidates(3),
  },
  {
    name: 'Hidden pairs',
    solve: hiddenCandidates(2),
  },
  {
    name: 'Hidden triples',
    solve: hiddenCandidates(3),
  },
  {
    name: 'Naked quads',
    solve: nakedCandidates(4),
  },
  {
    name: 'Hidden quads',
    solve: hiddenCandidates(4),
  },
  {
    name: 'Pointing pairs',
    solve: pointing(2),
  },
  {
    name: 'Box/line reduction',
    solve: boxLine,
  },
  {
    name: 'X-wing',
    solve: xWing,
  },
];
