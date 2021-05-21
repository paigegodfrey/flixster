const API_KEY = "67cbdd034db91fb68a728ea0c24c5dd3";
const API_BASE_URL = "https://api.themoviedb.org/3";

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieList = document.getElementById('movie-list');
const notFoundMsg = document.getElementById('not-found-msg');
const loadMoreMoviesContainer = document.querySelector('.load-more-movies-container')
const loadMoreMoviesBtn = document.getElementById('load-more-movies-btn');

let moviePage;

// helper function to check for blank string
const isBlank = str => {
  return (!str || /^\s*$/.test(str));
}

// Makes conditional API call and returns movies as HTML 
const getMovies = async searchTerm => {
  let moviesRes;
  // reset page to 1 with every search
  moviePage = 1;

  if (isBlank(searchTerm)) {
    loadMoreMoviesContainer.classList.remove('hidden')
    moviesRes = await fetchMoviesNowPlaying();
  } else {
    loadMoreMoviesContainer.classList.add('hidden')
    moviesRes = await fetchSearchMovies(searchTerm);
  }

  displayMovies(moviesRes.results);
}

// Makes API call for movies now playing and returns data as JSON
const fetchMoviesNowPlaying = async () => {
  // Found in API documentation Movies -> GET Now Playing
  let allMoviesRes = await (await fetch(`${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${moviePage}`)).json();
  return allMoviesRes;
}

// Makes API call for movies based on search term and returns data as JSON
const fetchSearchMovies = async searchTerm => {
  // Found in API documentation Getting Started -> Search & Query
  let searchMoviesRes = await (await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`)).json();
  return searchMoviesRes;
}

// Event handler for search form submit
const handleSearchFormSubmit = evt => {
  evt.preventDefault();
  movieList.innerHTML = '';

  let searchTerm = searchInput.value;
  getMovies(searchTerm);
}

// Return movies now playing as HTML
const displayMovies = movieData => {
  // handle empty results
  if (!movieData.length) {
    loadMoreMoviesContainer.classList.add('hidden');
    notFoundMsg.innerText = 'Sorry, no results were found';
    movieList.innerHTML = '';
    return;
  }

  let moviesHTML = movieData.map(movie => `
    <li class="movie-card">
      <img class="movie-poster" src=${movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : 'default_poster_img.jpg'} alt="${movie.title}"/>
      <div class="movie-details">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-votes">⭐ ${movie.vote_average}</div>
      </div>
    </li>
  `).join('');
  notFoundMsg.innerText = '';
  movieList.innerHTML = movieList.innerHTML + moviesHTML;
}

// Increments moviePage and makes API call for movies now playing
// Returns data as JSON 
const loadMoreMovies = async () => {
  moviePage++;
  let moviesRes = await fetchMoviesNowPlaying();
  displayMovies(moviesRes.results);
}

// displayMovieDetails

// closeMovieDetails

searchForm.addEventListener('submit', handleSearchFormSubmit);
getMovies();