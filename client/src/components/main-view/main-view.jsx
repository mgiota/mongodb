import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { setMovies, setUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import MovieView from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import DirectorView from '../director-view/director-view';
import NavBar from '../navbar/navbar.jsx';
import ProfileUpdate from '../profile-view/profile-update';
import ProfileView from '../profile-view/profile-view';


class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      user: null,
      email: '',
      birthday: '',
      token: '',
      userInfo: {}
    };

    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this)
  }

  updateUser(data) {
    this.setState({
      userInfo: data
    });
    localStorage.setItem('user', data.Username);
  }

  addToFavorites(movie) {
    //https://stackoverflow.com/questions/43040721/how-to-update-nested-state-properties-in-react
    let favorites = this.state.userInfo.FavoriteMovies;
    if (favorites.indexOf(movie) < 0) {
      favorites.push(movie);
    }

    let userInfo = {...this.state.userInfo};
    userInfo.FavoriteMovies = favorites;
    this.setState({userInfo});

    // 2nd solution with spread operator
    // this.setState(prevState => ({
    //     ...prevState,
    //     userInfo: {
    //       ...prevState.userInfo,
    //       FavoriteMovies: favorites
    //     }
    //   })
    // );

    // WRONG SOLUTION - mutuating the state
    // this.setState({
    //   userInfo: {
    //     FavoriteMovies: favorites
    //   }
    // })
  }

  removeFromFavorites(movieId) {
    let currFavorites = this.state.userInfo.FavoriteMovies;
    let favorites = currFavorites.filter(mId => {
      return mId !== movieId
    });
    let userInfo = {...this.state.userInfo};
    userInfo.FavoriteMovies = favorites;
    this.setState({userInfo});
    // this.setState(prevState => ({
    //   ...prevState,
    //   userInfo: {
    //     ...prevState.userInfo,
    //     FavoriteMovies: favorites
    //   }
    // }));
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

  getUser(user, token) {
    axios
      //.get("http://localhost:8080/users/" + user, {
      .get('https://my-flixdb-api2.herokuapp.com/users/' + user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.setState({
          email: response.data.Email,
          birthday: response.data.Birthday,
          token: token,
          userInfo: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
    }

  componentDidMount() {
    // window.addEventListener('hashchange', this.handleNewHash, false);
    // this.handleNewHash();

    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.props.setUser(localStorage.getItem('user'));
      this.getMovies(accessToken);
      this.getUser(localStorage.getItem("user"), accessToken);
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
    this.props.setUser(authData.user.Username);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
    this.setState({
      userInfo: authData.user
    });
  }

  // This overrides the render() method of the superclass
  // No need to call super() though, as it does nothing by default
  render() {
    const { token, userInfo } = this.state;
    const { user } = this.props;
    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    // const selectedMovie = selectedMovieId ? movies.find(m => m._id === selectedMovieId) : null;


    return (
      <Router>
          <NavBar />
          <div className="main-view">
            <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return <MoviesList
                  userInfo={userInfo}
                  addToFavorites={this.addToFavorites}
                  removeFromFavorites={this.removeFromFavorites}
                />
              }
            }/>
            <Route exact path="/movies"
              render={() =>  <MoviesList
                addToFavorites={this.addToFavorites}
                removeFromFavorites={this.removeFromFavorites}
                userInfo={userInfo}
                /> }/>
            <Route path="/movies/:movieId" render={({match}) => <MovieView movieId={match.params.movieId}/>}/>
            <Route path="/directors/:name" render={({ match }) => {
              return <DirectorView directorName={match.params.name} /> }
            } />

            <Route path="/register" render={() => <RegistrationView />} />
            <Route
              exact
              path="/profile/update"
              render={() => <ProfileUpdate userInfo={userInfo} user={user} token={token} updateUser={data => this.updateUser(data)} />}
            />
            <Route
              exact
              path="/profile"
              render={() => <ProfileView userInfo={userInfo} />}
            />
          </div>
       </Router>
     );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

export default connect(mapStateToProps, { setMovies, setUser } )(MainView);
