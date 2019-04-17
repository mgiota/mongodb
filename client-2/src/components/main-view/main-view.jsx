import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
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
    // window.addEventListener('hashchange', this.handleNewHash, false);
    // this.handleNewHash();

    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  // handleNewHash = () => {
  //   console.log('!!handleNew hash')
  //   const movieId = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
  //
  //   this.setState({
  //     selectedMovieId: movieId[0]
  //   });
  // }

  // onMovieClick(movie) {
  //   window.location.hash = '#' + movie._id;
  //   this.setState({
  //     selectedMovieId: movie._id
  //   });
  // }

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
    const { movies, user } = this.state;

    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    // if (!movies) return <div className="main-view"/>;
    // const selectedMovie = selectedMovieId ? movies.find(m => m._id === selectedMovieId) : null;


    return (
      <Router>
          <div className="main-view">
            <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return movies.map(m => <MovieCard key={m._id} movie={m}/>)
              }
            }/>
            <Route exact path="/login" render={() => <LoginView onLoggedIn={user => this.onLoggedIn(user)} />}/>
            <Route path="/movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>
            <Route path="/register" render={() => <RegistrationView />} />
          </div>
       </Router>
     );

  }
}
