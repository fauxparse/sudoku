import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="....3..86....2.........85..371....949.......54....76..2..7..8...3...5...7....4.3." />
  </div>
);

export default App;
