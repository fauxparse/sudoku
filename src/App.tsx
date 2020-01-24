import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="174832596593461278682957..1.675..9...197.36.5435.968.73.16..7599.8.75.6.7563.9.82" />
  </div>
);

export default App;
