import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import axios from "axios";
import { Link } from "react-router-dom";

export default function ProfileUpdate(props) {
  const {
    Username: currUsername,
    Email: currEmail,
    Birthday: currBirthday
  } = props.userInfo;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  // https://stackoverflow.com/questions/54130948/how-to-change-props-to-state-in-react-hooks
  useEffect(() => {
    setUsername(currUsername);
    setEmail(currEmail);
    setBirthday(currBirthday);
      }, [currUsername, currEmail, currBirthday]);

  const user = props.user;

  const handleUpdate = e => {
    e.preventDefault();
    const userInfo = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };
    axios
      .put(
        `https://my-flixdb-api2.herokuapp.com/users/${user}`,
        userInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        },
      )
      .then(response => {
        props.updateUser(userInfo);
        alert('User info was updated successfully');
      })
      .catch(e => {
        const errors = e.response.data.errors || [];
        let errorMessage = '';
        errors.forEach(err => {
          errorMessage += err.msg;
        });
        alert(`Oops there was an error ${errorMessage}`)
        console.log(`Error updating the user info.`);
      });
  }
  return (
    <Container>
      <Row className="profile-view">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Img variant="top" style={{ maxWidth: "50px"}} src={process.env.PUBLIC_URL + "/images/update.png" } />

              <Form>
                Please update your profile information.
                <Form.Group controlId="formUsername">
                  <Form.Label>Username: </Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Pick a username"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password: </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter old password or a new one"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email: </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Please provide your email"
                  />
                </Form.Group>
                <Form.Group controlId="formBirthday">
                  <Form.Label>Birthday: </Form.Label>
                  <Form.Control

                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    placeholder="Please provide your birthday in format mm/dd/yyyy"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleUpdate}>
                  Update
                </Button>
                <Link to={`${process.env.PUBLIC_URL}/profile`}>
                  <Button className="back-btn" variant="secondary" type="button">
                    BACK
                  </Button>
                </Link>
                <Form.Text className="text-muted">
                  We will never share your personal information with anyone else.
                </Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
