import React from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export class MovieView extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie } = this.props;
    if (!movie) return null;
    return (
       <div className="movie-view">
         <div className="movie-title">{movie.Title}</div>
         <div className="movie-description">{movie.Description}</div>
         <div className="movie-genre">{movie.Genre.Name}</div>
         <div className="movie-director">{movie.Director.Name}</div>
         <Link to={`/directors/${movie.Director.Name}`}>
          <Button variant="link">Director</Button>
        </Link>
       </div>
    );
  }
}
