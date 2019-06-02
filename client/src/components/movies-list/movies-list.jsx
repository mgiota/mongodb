import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from '../movie-card/movie-card';

const mapStateToProps = state => {
  const { movies, visibilityFilter, sortColumn } = state;

  let moviesToShow = movies.concat().sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return -1;
    if (a[sortColumn] > b[sortColumn]) return 1;
    return 0;
  });

  if (visibilityFilter !== '') {
    moviesToShow = moviesToShow.filter(m => m.Title.toLowerCase().includes(visibilityFilter));
  }

  return { movies: moviesToShow };
};

function MoviesList(props) {
  const { movies, userInfo } = props;
  const favMovies = userInfo.FavoriteMovies || [];

  if (!movies) return <div className="main-view"/>;

  return <div className="movies-list">
    <VisibilityFilterInput/>
    <Container>
      <Row>
        {
          movies.map(m =>
            (<Col key={m._id} xs={12} sm={6} md={4}>
              <MovieCard
                key={m._id}
                movie={m}
                favorite={favMovies.indexOf(m._id) > -1}
                addToFavorites={props.addToFavorites}
                removeFromFavorites={props.removeFromFavorites}
              />
            </Col>)
          )
        }
      </Row>
    </Container>
  </div>;

}

export default connect(mapStateToProps)(MoviesList);
