import React from 'react';

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
       </div>
    );
  }
}
