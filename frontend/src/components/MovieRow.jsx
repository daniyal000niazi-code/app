import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import './MovieRow.css';

const MovieRow = ({ title, fetchFunction, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchFunction();
        setMovies(data.results || []);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      }
    };

    fetchMovies();
  }, [fetchFunction, title]);

  const handleScroll = (direction) => {
    const container = document.getElementById(`row-${title}`);
    const scrollAmount = container.offsetWidth;
    
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
      setScrollPosition(container.scrollLeft - scrollAmount);
    } else {
      container.scrollLeft += scrollAmount;
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const handleMovieClick = (movie) => {
    const type = movie.media_type || mediaType;
    navigate(`/${type}/${movie.id}`);
  };

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        {scrollPosition > 0 && (
          <button 
            className="row-nav row-nav-left"
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft size={40} />
          </button>
        )}
        
        <div className="row-posters" id={`row-${title}`}>
          {movies.map((movie) => {
            const posterPath = movie.poster_path || movie.backdrop_path;
            if (!posterPath) return null;
            
            return (
              <div 
                key={movie.id} 
                className="row-poster-container"
                onClick={() => handleMovieClick(movie)}
              >
                <img
                  className="row-poster"
                  src={tmdbService.getImageUrl(posterPath, 'w500')}
                  alt={movie.title || movie.name}
                  loading="lazy"
                />
                <div className="poster-overlay">
                  <div className="overlay-actions">
                    <button className="overlay-btn overlay-btn-play">
                      <Play size={20} fill="#000" />
                    </button>
                    <button className="overlay-btn">
                      <Info size={20} />
                    </button>
                  </div>
                  <div className="overlay-info">
                    <p className="overlay-title">{movie.title || movie.name}</p>
                    <div className="overlay-meta">
                      <span className="overlay-rating">
                        {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} ★
                      </span>
                      <span className="overlay-year">
                        {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <button 
          className="row-nav row-nav-right"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
