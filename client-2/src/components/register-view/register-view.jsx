import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

export function RegisterView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ email, setEmail ] = useState('');
  const [birthday, setBirthday ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios.post('http://localhost:8080/users', {
      Username: username,
      Password: password,
      Email: email
    })
    .then(response => {
      const data = response.data;
      console.log(data);
    })
    .catch(e => {
      console.log('problem registering new user');
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
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Email</Form.Label>
          <Form.Control type="password" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Card>
  )
}
