import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import { tmdbService } from '../services/tmdb';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await tmdbService.getDetails(mediaType, id);
        setDetails(data);
        
        const trailer = tmdbService.getYoutubeTrailer(data.videos);
        setTrailerUrl(trailer);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, mediaType]);

  if (!details) {
    return (
      <div className="detail-page">
        <Navbar />
        <div className="detail-loading">Loading...</div>
      </div>
    );
  }

  const runtime = details.runtime || details.episode_run_time?.[0];
  const releaseDate = details.release_date || details.first_air_date;
  
  return (
    <div className="detail-page">
      <Navbar />
      
      <div 
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(20,20,20,1) 0%, rgba(20,20,20,0.8) 40%, rgba(20,20,20,0.3) 70%, rgba(20,20,20,0.8) 100%), url(${tmdbService.getImageUrl(details.backdrop_path, 'original')})`,
        }}
      >
        <div className="detail-content">
          <h1 className="detail-title">{details.title || details.name}</h1>
          
          <div className="detail-meta">
            <span className="detail-rating">{details.vote_average?.toFixed(1)} ★</span>
            {releaseDate && <span className="detail-year">{releaseDate.split('-')[0]}</span>}
            {runtime && <span className="detail-runtime">{runtime} min</span>}
            {details.status && <span className="detail-status">{details.status}</span>}
          </div>
          
          <div className="detail-buttons">
            {trailerUrl ? (
              <button 
                className="detail-button detail-button-play"
                onClick={() => setShowTrailer(true)}
              >
                <Play size={24} fill="#000" />
                <span>Play Trailer</span>
              </button>
            ) : (
              <button className="detail-button detail-button-play" disabled>
                <Play size={24} fill="#000" />
                <span>No Trailer</span>
              </button>
            )}
            <button className="detail-icon-btn">
              <Plus size={24} />
            </button>
            <button className="detail-icon-btn">
              <ThumbsUp size={24} />
            </button>
          </div>
          
          <p className="detail-overview">{details.overview}</p>
          
          {details.genres && details.genres.length > 0 && (
            <div className="detail-genres">
              <span className="detail-label">Genres: </span>
              {details.genres.map((genre, index) => (
                <span key={genre.id}>
                  {genre.name}{index < details.genres.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
          
          {details.credits?.cast && details.credits.cast.length > 0 && (
            <div className="detail-cast">
              <span className="detail-label">Cast: </span>
              {details.credits.cast.slice(0, 5).map((actor, index) => (
                <span key={actor.id}>
                  {actor.name}{index < Math.min(4, details.credits.cast.length - 1) ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="detail-poster-container">
          <img 
            src={tmdbService.getImageUrl(details.poster_path, 'w500')} 
            alt={details.title || details.name}
            className="detail-poster"
          />
        </div>
      </div>
      
      {details.similar && details.similar.results && details.similar.results.length > 0 && (
        <div className="detail-similar">
          <MovieRow 
            title="More Like This" 
            fetchFunction={async () => details.similar}
            mediaType={mediaType}
          />
        </div>
      )}
      
      {showTrailer && trailerUrl && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>
              <X size={32} />
            </button>
            <iframe
              src={trailerUrl}
              title="Trailer"
              className="trailer-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
