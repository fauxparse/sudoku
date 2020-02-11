import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens=".762..4...941.7.6.2..46...7.6.371...74.592.16...684.7.3.97.6..568.9.573.4578.36.." />
  </div>
);

export default App;
