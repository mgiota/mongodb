import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('https://my-flixdb-api2.herokuapp.com/login', {
      Username: username,
      Password: password
    })
    .then(response => {
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(e => {
      console.log('no such user')
    });

  };

  return (
    <Card style={{ width: '16rem', marginLeft: '20px', padding: '20px' }}>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Card>
  )
}
