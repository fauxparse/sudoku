import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens="9..24.....5.69.231.2..5..9..9.7..32...29356.7.7...29...69.2..7351..79.622.7.86..9" />
  </div>
);

export default App;
