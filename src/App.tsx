import React from 'react';
import Sudoku from './Sudoku';
import './App.scss';

const App: React.FC = () => (
  <div className="app">
    <Sudoku givens=".93..456..6...314...46.83.9981345...347286951652.7.4834.6..289....4...1..298...34" />
  </div>
);

export default App;
