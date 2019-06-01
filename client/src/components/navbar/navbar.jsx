import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, NavLink, Link } from "react-router-dom";

function NavBar(props) {
    return (
      <Navbar
        style={{backgroundColor: '#fff'}}
        variant="light"
        sticky="top"
        collapseOnSelect
      >
        <Navbar.Brand>
          <Link to={process.env.PUBLIC_URL + '/'}>Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link as={NavLink} to={process.env.PUBLIC_URL + '/profile'}>
              Profile
            </Nav.Link>
            <Nav.Link as={NavLink} to={process.env.PUBLIC_URL + '/movies'}>
              Movies
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

export default NavBar;