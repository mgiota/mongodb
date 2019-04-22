import React from 'react';
import { connect } from 'react-redux';

import { MovieCard } from '../movie-card/movie-card';

const mapStateToProps = state => {
  console.log(state, '!!state')
  const { movies, visibilityFilter, sortColumn } = state;

  let sortedMovies = movies.concat().sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return -1;
    if (a[sortColumn] > b[sortColumn]) return 1;
    return 0;
  });


  return { movies: sortedMovies };
};

function MoviesList(props) {
  const { movies } = props;

  if (!movies) return <div className="main-view"/>;

  return movies.map(m => <MovieCard key={m.id} movie={m}/>);
}

export default connect(mapStateToProps)(MoviesList);
