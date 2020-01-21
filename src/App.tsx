import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="1.....5694.2.....8.5...9.4....64.8.1....1....2.8.35....4.5...1.9.....4.2621.....5" />
  </div>
);

export default App;
