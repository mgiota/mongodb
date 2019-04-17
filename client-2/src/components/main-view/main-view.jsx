import React from 'react';
import axios from 'axios';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovieId: null,
      user: null
    };
  }

  getMovies(token) {
    axios.get('https://my-flixdb-api2.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      this.setState({
        movies: response.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleNewHash, false);
    this.handleNewHash();

    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  handleNewHash = () => {
    console.log('!!handleNew hash')
    const movieId = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

    this.setState({
      selectedMovieId: movieId[0]
    });
  }

  onMovieClick(movie) {
    window.location.hash = '#' + movie._id;
    this.setState({
      selectedMovieId: movie._id
    });
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  // This overrides the render() method of the superclass
  // No need to call super() though, as it does nothing by default
  render() {
    const { movies, selectedMovieId, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view"/>;
    const selectedMovie = selectedMovieId ? movies.find(m => m._id === selectedMovieId) : null;


    return (
     <div className="main-view">
      { selectedMovie
        ? <MovieView movie={selectedMovie}/>
        : movies.map(movie => (
        <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
        ))
      }

     </div>
    );
  }
}
