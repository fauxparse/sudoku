import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="...1.5...14....67..8...24...63.7..1.9.......3.1..9.52...72...8..26....35...4.9..." />
  </div>
);

export default App;
