const API_KEY = "67cbdd034db91fb68a728ea0c24c5dd3";
const API_BASE_URL = "https://api.themoviedb.org/3";

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

const moviesNowPlayingContainer = document.querySelector('.movies-now-playing-container');
const moviesNowPlaying = document.getElementById('movies-now-playing');
const moviesSearchedContainer = document.querySelector('.movies-searched-container')
const moviesSearched = document.getElementById('movies-searched');
const notFoundMsg = document.getElementById('not-found-msg');

let moviePage = 1;

// helper function to check for blank string
const isBlank = str => {
  return (!str || /^\s*$/.test(str));
}

// makes API call for movies now playing and displays as HTML
const loadMoviesNowPlaying = async () => {
  let moviesRes = await (await fetch(`${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${moviePage}`)).json();
  return displayMovies(moviesRes.results, moviesNowPlaying);
}

// makes API call for movies searched and displays as HTML
const fetchMoviesSearched = async searchTerm => {
  let moviesRes = await (await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`)).json();
  return displayMovies(moviesRes.results, moviesSearched);
}

// event handler for search form submit
const handleSearchFormSubmit = evt => {
  evt.preventDefault();

  let searchTerm = searchInput.value;
  if (isBlank(searchTerm)) return;

  moviesNowPlayingContainer.classList.add('display-none');
  moviesSearchedContainer.classList.remove('display-none');
  moviesSearched.innerHTML = '';

  fetchMoviesSearched(searchTerm);
}

// clears searchInput text and closes search results
const clearMoviesSearched = () => {
  searchInput.value = '';

  if (moviesSearchedContainer.classList.contains('display-none')) return;  

  moviesSearched.innerHTML = '';
  notFoundMsg.classList.add('display-none');
  moviesSearchedContainer.classList.add('display-none');
  moviesNowPlayingContainer.classList.remove('display-none');
}

// return movies as HTML
const displayMovies = (movieData, htmlElement) => {

  // handle empty search results
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

// const displayMoviePopup = movie => {
//   let popup = document.createElement('div');
//   popup.className = 'popup';

//   let genres = movie.genres.slice(0, 3).map(genre => genre.name).join(', ');

//   popup.innerHTML = `
//       <button id="close-btn" onclick="closePopup()">Close</button>
//       <article class="movie-popup">
//           <img class="movie-backdrop" src="${imageBaseUrl}/w780${movie.backdropPath}" alt="${movie.title}" title="${movie.title}"/>
//           <section class="movie-details">
//               <div class="movie-image">
//                   <img class="movie-poster" src="${imageBaseUrl}/w342${movie.posterPath}" alt="${movie.title}" title="${movie.title}"/>
//               </div>
//               <div class="movie-info">
//                   <p class="movie-genres">${genres}</p>
//                   <h3 class="movie-title">${movie.title}</h3>
//                   <p class="movie-specs">${movie.runtime} min | ${movie.releaseDate}</p>
//               </div>
//               <div class="movie-votes">
//                   <span>⭐</span><br>
//                   ${movie.voteAvg}
//               </div>
//           </section>
//           <p class-"movie-overview">${movie.overview}</p>
//       </article>
//   `;

//   document.body.appendChild(popup)
//   document.body.style.height = '100vh';
//   document.body.style.overflowY = 'hidden';
// }

// function closePopup() {
//   let popup = document.querySelector('.popup');
//   popup.parentElement.removeChild(popup);

//   document.body.style.height = '';
//   document.body.style.overflowY = '';
// }

// increments moviePage and makes API call for movies now playing
const loadMoreMovies = async () => {
  moviePage++;
  loadMoviesNowPlaying();
}

// triggers searchForm event listener and loads movies now playing
const initializeApp = async () => {
  searchForm.addEventListener('submit', handleSearchFormSubmit);
  loadMoviesNowPlaying();
}

initializeApp();