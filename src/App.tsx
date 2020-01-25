import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens=".241..67..6..7.41.7..964.2.2465913871354872968796231544....976.35.71694.697.4..31" />
  </div>
);

export default App;
