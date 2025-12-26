import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { tmdbService } from '../services/tmdb';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      
      <div className="rows-container">
        <MovieRow 
          title="Trending Now" 
          fetchFunction={() => tmdbService.getTrending('all', 'week')}
          mediaType="movie"
        />
        <MovieRow 
          title="Popular on HoioFlix" 
          fetchFunction={() => tmdbService.getPopular('movie')}
          mediaType="movie"
        />
        <MovieRow 
          title="Top Rated Movies" 
          fetchFunction={() => tmdbService.getTopRated('movie')}
          mediaType="movie"
        />
        <MovieRow 
          title="Popular TV Shows" 
          fetchFunction={() => tmdbService.getPopular('tv')}
          mediaType="tv"
        />
        <MovieRow 
          title="Top Rated TV Shows" 
          fetchFunction={() => tmdbService.getTopRated('tv')}
          mediaType="tv"
        />
        <MovieRow 
          title="Now Playing in Theaters" 
          fetchFunction={() => tmdbService.getNowPlaying()}
          mediaType="movie"
        />
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2025 HoioFlix. All rights reserved.</p>
          <div className="footer-links">
            <a href="/" className="footer-link">Terms of Use</a>
            <a href="/" className="footer-link">Privacy Policy</a>
            <a href="/" className="footer-link">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
