import React from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { connect } from 'react-redux';

import './movie-view.scss';

function MovieView(props) {
  const { movies, movieId } = props;
  if (!movies || !movies.length) return null;
  const movie = movies.find(m => m._id == movieId);
  return (
    <Container>
      <Row className="movie-view">
        <Col md={8}>
          <Card>
            <Card.Img variant="top" src={process.env.PUBLIC_URL + "/images/" + movie.ImagePath} />
            <Card.Body>
              <Card.Title>{movie.Title}</Card.Title>
              <Card.Text>{movie.Description}</Card.Text>
              <div className="label h6">Director</div>
              <div className="movie-director">{movie.Director.Name}</div>
              <Link to={`/directors/${movie.Director.Name}`}>
                <Button variant="primary">Learn more</Button>
              </Link>
              <Link to={'/'}>
                <Button className="back-btn" variant="secondary" type="button">
                  BACK
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default connect(({movies}) => ({movies}))(MovieView);
