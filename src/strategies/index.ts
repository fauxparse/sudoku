import nakedSingles from './nakedSingles';
import hiddenSingles from './hiddenSingles';
import nakedTuples from './nakedTuples';
import hiddenTuples from './hiddenTuples';
import pointingTuples from './pointingTuples';
import boxLine from './boxLine';
import xWing from './xWing';
import simpleColoring from './simpleColoring';
import yWing from './yWing';
import swordfish from './swordfish';
import xyzWing from './xyzWing';
import bug from './bug';
import xCycles from './xCycles';

export default [
  nakedSingles,
  hiddenSingles,
  nakedTuples(2),
  hiddenTuples(2),
  nakedTuples(3),
  hiddenTuples(3),
  nakedTuples(4),
  hiddenTuples(4),
  pointingTuples,
  pointingTuples,
  boxLine,
  xWing,
  simpleColoring,
  yWing,
  swordfish,
  xyzWing,
  bug,
  xCycles,
];
