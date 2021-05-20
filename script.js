const API_KEY = "67cbdd034db91fb68a728ea0c24c5dd3";
const API_BASE_URL = "https://api.themoviedb.org/3";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieList = document.getElementById('movie-list');
const loadMoreBtn = document.getElementById('load-more-movies-btn');

let moviePage = 1;


// helper function to check for empty string
const isEmpty = str => {
  return (!str || str.length === 0);
}

// helper function to check for blank string
const isBlank = str => {
  return (!str || /^\s*$/.test(str));
}

// Make API call and return movies now playing as HTML
const getMovies = async searchTerm => {
  let moviesRes;

  if (isEmpty(searchTerm) || isBlank(searchTerm)) {
    moviesRes = await fetchAllMovies();
  } else {
    moviesRes = await fetchSearchMovies(searchTerm);
  }

  displayMovies(moviesRes.results);
}


const fetchAllMovies = async () => {
  // Found in API documentation Movies -> GET Now Playing
  let allMoviesRes = await (await fetch(`${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${moviePage}`)).json();
  return allMoviesRes;
}

// Make API call and return movies now playing based on search term
const fetchSearchMovies = async searchTerm => {
  // Found in API documentation Getting Started -> Search & Query
  let searchMoviesRes = await (await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`)).json();
  return searchMoviesRes;
}

// Return movies now playing as HTML
const displayMovies = movieData => {
  let moviesHTML = movieData.map(movie => `
  <li class="movie-card">
      <img class="movie-poster" src=${movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : 'default_poster_img.jpg'} alt="${movie.title}"/>
      <div class="movie-details">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-votes">⭐ ${movie.vote_average}</div>
      </div>
  </li>
`).join('');

  movieList.innerHTML = moviesHTML;
}

// loadMoreMovies

// handleSearch

// displayMovieDetails

// closeMovieDetails

// init