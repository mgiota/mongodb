import React from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';

function MovieView(props) {
  const { movies, movieId } = props;
  if (!movies || !movies.length) return null;
  const movie = movies.find(m => m._id == movieId);
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

export default connect(({movies}) => ({movies}))(MovieView);
