import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

import axios from "axios";

import './movie-card.scss';

let toggleClick = false;

export class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fav: props.favorite
    };

    this.toggleClass = this.toggleClass.bind(this);
  }

  //https://blog.bitsrc.io/managing-derived-state-from-props-in-react-f26b5b15069
  // static getDerivedStateFromProps(nextProps, prevState){
  //   if(nextProps.favorite !== prevState.favorite && !toggleClick) {
  //    return { fav: nextProps.favorite};
  //   }
  //   else return null;
  // }

  // https://gist.github.com/sorahn/2cdc344cc698f027a948e3fdf6e0e60f/revisions
  componentDidUpdate(prevProps) {
    if (this.props.favorite !== prevProps.favorite) {
      this.setState({
        fav: this.props.favorite
      })
    }
  }

  removeFromFavorites() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const movieId = this.props.movie._id
    axios
        .delete(`https://my-flixdb-api2.herokuapp.com/users/${user}/movies/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then(response => {
          console.log(response);
          this.setState({
            fav: false
          });
          this.props.removeFromFavorites(movieId);

        })
        .catch(e => {
          console.log(e);
        });
  }

  addToFavorites(movieId) {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token')
    axios
    .post(`https://my-flixdb-api2.herokuapp.com/users/${user}/movies/${movieId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then(response => {
      console.log(response);
      this.setState({
        fav: true
      });
      this.props.addToFavorites(movieId);
    })
    .catch(e => {
      console.log(e);
    });
  }

  toggleClass() {
    toggleClick = true;
    if (!this.state.fav) {
      this.addToFavorites(this.props.movie._id);
    } else {
      this.removeFromFavorites();
    }

  }

  render() {
    // This is given to the <MovieCard/> component by the outer world,
    // whatever it is :-)
    const { movie } = this.props;
    console.log(this.state, '!!movie state')
    return (
      <Card>
        <Card.Img variant="top" src={process.env.PUBLIC_URL + "/images/" + movie.ImagePath} />
        <Card.Body>
          <Card.Title>
            {movie.Title}
            <span
              onClick={() => this.toggleClass()}
              className={this.state.fav ? "favme active" : "favme"}

            >
              &#x2605;
            </span>
          </Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="primary">Open</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
