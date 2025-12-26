import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
