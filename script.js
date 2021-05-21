const API_KEY = "67cbdd034db91fb68a728ea0c24c5dd3";
const API_BASE_URL = "https://api.themoviedb.org/3";

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchCloseBtn = document.getElementById('search-close-btn');

const moviesNowPlayingContainer = document.querySelector('.movies-now-playing-container');
const moviesNowPlaying = document.getElementById('movies-now-playing');
const loadMoreBtn = document.getElementById('load-more-movies-btn');

const moviesSearchedContainer = document.querySelector('.movies-searched-container')
const moviesSearched = document.getElementById('movies-searched');
const notFoundMsg = document.getElementById('not-found-msg');

let moviePage = 1;

// helper function to check for blank string
const isBlank = str => {
  return (!str || /^\s*$/.test(str));
}

// Makes API call for movies now playing and display as HTML
const loadMoviesNowPlaying = async () => {
  let moviesRes = await (await fetch(`${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${moviePage}`)).json();
  return displayMovies(moviesRes.results, moviesNowPlaying);
}

// Makes API call for movies based on search term and display as HTML
const fetchSearchMovies = async searchTerm => {
  let moviesRes = await (await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`)).json();
  return displayMovies(moviesRes.results, moviesSearched);
}


const handleSearchInputFocus = evt => {
  searchCloseBtn.classList.remove('visibility-hidden');
  moviesNowPlayingContainer.classList.add('display-none');
  moviesSearchedContainer.classList.remove('display-none');
}

// Event handler for search form submit
const handleSearchFormSubmit = evt => {
  evt.preventDefault();
  moviesNowPlayingContainer.classList.add('display-none');
  moviesSearched.innerHTML = '';
  
  let searchTerm = searchInput.value;
  if (isBlank(searchTerm)) return;
  
  fetchSearchMovies(searchTerm);
}

const closeMoviesSearched = () => {
  searchInput.value = '';
  moviesSearched.innerHTML = '';

  if (!notFoundMsg.classList.contains('display-none')) notFoundMsg.classList.add('display-none');

  searchCloseBtn.classList.add('visibility-hidden');
  moviesNowPlayingContainer.classList.remove('display-none');
  moviesSearchedContainer.classList.add('display-none');
}

// Return movies as HTML
const displayMovies = (movieData, htmlElement) => {

  // handle empty results
  if (!movieData.length) {
    notFoundMsg.classList.remove('display-none');
    htmlElement.innerHTML = '';
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
  notFoundMsg.classList.add('display-none');
  htmlElement.innerHTML = htmlElement.innerHTML + moviesHTML;
}

// Increments moviePage and makes API call for movies now playing
// Returns data as JSON 
const loadMoreMovies = async () => {
  moviePage++;
  loadMoviesNowPlaying();
}

// displayMovieDetails

// closeMovieDetails

const initializeApp = async () => {
  searchInput.addEventListener('focus', handleSearchInputFocus);
  searchForm.addEventListener('submit', handleSearchFormSubmit);
  loadMoviesNowPlaying();
}

initializeApp();