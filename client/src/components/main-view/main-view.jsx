import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { setMovies } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import MovieView from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import DirectorView from '../director-view/director-view';

class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      user: null
    };
  }

  getMovies(token) {
    //axios.get('http://localhost:8080/movies', {
    axios.get('https://my-flixdb-api2.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      // this.setState({
      //   movies: response.data
      // });
      this.props.setMovies(response.data);
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
    console.log('render')
    const { user } = this.state;

    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    // const selectedMovie = selectedMovieId ? movies.find(m => m._id === selectedMovieId) : null;


    return (
      <Router>
          <div className="main-view">
            <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return <MoviesList />
              }
            }/>
            <Route path="/movies/:movieId" render={({match}) => <MovieView movieId={match.params.movieId}/>}/>
            <Route path="/directors/:name" render={({ match }) => {
              return <DirectorView directorName={match.params.name} /> }
            } />

            <Route path="/register" render={() => <RegistrationView />} />
          </div>
       </Router>
     );
  }
}

export default connect(null, { setMovies } )(MainView);
