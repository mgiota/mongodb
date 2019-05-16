import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Link } from "react-router-dom";

export function ProfileUpdate(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const user = props.user;
  const token = props.token;
  console.log(token, '!!token')
  const handleUpdate = e => {
    e.preventDefault();
    axios
      .put(
        "http://localhost:8080/users/" + user,
        {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        },
      )
      .then(response => {
        const data = response.data;
        console.log(data, '!!updated data')
      })
      .catch(e => {
        console.log("Error updating the user info.");
      });
  }

  return (
    <div className="user-profile">
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
            placeholder="Pick a password"
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
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            placeholder="Please provide your birthday in format mm/dd/yyyy"
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleUpdate}>
          Update
        </Button>
        <Form.Text className="text-muted">
          We will never share your personal information with anyone else.
        </Form.Text>
      </Form>
    </div>
  );
}
