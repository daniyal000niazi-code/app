import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { tmdbService } from '../services/tmdb';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await tmdbService.search(searchQuery);
      setResults(data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleResultClick = (item) => {
    const type = item.media_type === 'tv' ? 'tv' : 'movie';
    if (item.media_type !== 'person') {
      navigate(`/${type}/${item.id}`);
    }
  };

  return (
    <div className="search-page">
      <Navbar />
      
      <div className="search-container-page">
        <form className="search-form-page" onSubmit={handleSearch}>
          <Search className="search-icon-page" size={24} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows..."
            className="search-input-page"
            autoFocus
          />
        </form>
        
        {loading ? (
          <div className="search-loading">Searching...</div>
        ) : (
          <>
            {results.length > 0 ? (
              <>
                <h2 className="search-results-title">
                  Results for "{searchParams.get('q')}"
                </h2>
                <div className="search-results">
                  {results.map((item) => {
                    if (item.media_type === 'person') return null;
                    
                    const posterPath = item.poster_path || item.backdrop_path;
                    if (!posterPath) return null;
                    
                    return (
                      <div 
                        key={item.id} 
                        className="search-result-item"
                        onClick={() => handleResultClick(item)}
                      >
                        <img
                          src={tmdbService.getImageUrl(posterPath, 'w500')}
                          alt={item.title || item.name}
                          className="search-result-poster"
                          loading="lazy"
                        />
                        <div className="search-result-info">
                          <h3 className="search-result-title">
                            {item.title || item.name}
                          </h3>
                          <div className="search-result-meta">
                            <span className="search-result-type">
                              {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                            </span>
                            {item.vote_average > 0 && (
                              <span className="search-result-rating">
                                {item.vote_average.toFixed(1)} ★
                              </span>
                            )}
                            {(item.release_date || item.first_air_date) && (
                              <span className="search-result-year">
                                {(item.release_date || item.first_air_date).split('-')[0]}
                              </span>
                            )}
                          </div>
                          {item.overview && (
                            <p className="search-result-overview">
                              {item.overview.length > 150 
                                ? item.overview.substr(0, 150) + '...' 
                                : item.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : searchParams.get('q') ? (
              <div className="search-no-results">
                <p>No results found for "{searchParams.get('q')}"</p>
                <p className="search-no-results-hint">Try different keywords or check your spelling</p>
              </div>
            ) : (
              <div className="search-empty">
                <Search size={64} className="search-empty-icon" />
                <p>Search for movies and TV shows</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
