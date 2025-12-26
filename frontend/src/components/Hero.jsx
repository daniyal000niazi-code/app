import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import './Hero.css';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const data = await tmdbService.getTrending('movie', 'week');
        if (data.results && data.results.length > 0) {
          const randomMovie = data.results[Math.floor(Math.random() * Math.min(5, data.results.length))];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.error('Error fetching hero movie:', error);
      }
    };

    fetchHeroMovie();
  }, []);

  if (!movie) {
    return <div className="hero-loading"></div>;
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <header 
      className="hero"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(20,20,20,0.8) 80%, #141414 100%), url(${tmdbService.getImageUrl(movie.backdrop_path, 'original')})`,
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>
        
        <div className="hero-buttons">
          <button 
            className="hero-button hero-button-play"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <Play size={24} fill="#000" />
            <span>Play</span>
          </button>
          <button 
            className="hero-button hero-button-info"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <Info size={24} />
            <span>More Info</span>
          </button>
        </div>
        
        <p className="hero-description">
          {truncate(movie.overview, 200)}
        </p>
      </div>
      
      <div className="hero-fade-bottom"></div>
    </header>
  );
};

export default Hero;
