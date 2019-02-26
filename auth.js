const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

function generateJwtToken(user) {
  return jwt.sign(user, 'your_jwt_secret', {
  subject: user.Username,
  expiresIn: '7d',
  algorithm: 'HS256'
  });
}

module.exports = function(app){

  app.post('/login', function(req, res) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'Something wrong',
          user: user
        });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          res.send(err);
        }
        const token = generateJwtToken(user.toJSON());
        return res.json({user, token});
      });
    })(req, res);
  });
}
