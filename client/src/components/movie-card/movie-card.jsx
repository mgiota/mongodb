import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    // This is given to the <MovieCard/> component by the outer world,
    // whatever it is :-)
    const { movie } = this.props;

    return (
      <Card style={{ width: '16rem' }}>
        <Card.Img variant="top" src={process.env.PUBLIC_URL + "/images/" + movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="link">Open</Button>
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
