import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="...9.3.1...4...6..75.....4....48....2.......3....52....4.....81..5...26..9.2.8..." />
  </div>
);

export default App;
