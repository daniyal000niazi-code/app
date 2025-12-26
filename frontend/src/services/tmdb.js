const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];

let currentKeyIndex = 0;

const getApiKey = () => {
  return TMDB_API_KEYS[currentKeyIndex];
};

const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
  return getApiKey();
};

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const fetchWithRetry = async (url) => {
  try {
    const response = await fetch(url);
    
    if (response.status === 429) {
      const newKey = rotateApiKey();
      const newUrl = url.replace(/api_key=[^&]+/, `api_key=${newKey}`);
      const retryResponse = await fetch(newUrl);
      return retryResponse.json();
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const tmdbService = {
  getTrending: async (mediaType = 'all', timeWindow = 'week') => {
    const url = `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${getApiKey()}`;
    return fetchWithRetry(url);
  },

  getPopular: async (mediaType = 'movie') => {
    const url = `${BASE_URL}/${mediaType}/popular?api_key=${getApiKey()}`;
    return fetchWithRetry(url);
  },

  getTopRated: async (mediaType = 'movie') => {
    const url = `${BASE_URL}/${mediaType}/top_rated?api_key=${getApiKey()}`;
    return fetchWithRetry(url);
  },

  getNowPlaying: async () => {
    const url = `${BASE_URL}/movie/now_playing?api_key=${getApiKey()}`;
    return fetchWithRetry(url);
  },

  getDetails: async (mediaType, id) => {
    const url = `${BASE_URL}/${mediaType}/${id}?api_key=${getApiKey()}&append_to_response=videos,credits,similar`;
    return fetchWithRetry(url);
  },

  search: async (query, page = 1) => {
    const url = `${BASE_URL}/search/multi?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&page=${page}`;
    return fetchWithRetry(url);
  },

  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getYoutubeTrailer: (videos) => {
    if (!videos || !videos.results) return null;
    
    const trailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
    }
    
    const teaser = videos.results.find(
      video => video.type === 'Teaser' && video.site === 'YouTube'
    );
    
    return teaser ? `https://www.youtube.com/embed/${teaser.key}?autoplay=1` : null;
  }
};
