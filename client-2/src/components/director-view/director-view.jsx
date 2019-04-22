import React from 'react';
import { connect } from 'react-redux';

function DirectorView(props) {

  const { movies, directorName } = props;
  if (!movies || !movies.length) return null;
  const director = movies.find(m => m.Director.Name == directorName).Director
  // if (!director) return <div className="main-view">No director</div>;
  return (
     <div className="movie-view">
        <div>{director.Name}</div>
        <div>{director.Bio}</div>
     </div>
  );
}

export default connect(({movies}) => ({movies}))(DirectorView);
