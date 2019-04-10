const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
const path = require('path');
require('./passport');
const cors = require('cors');

const app = express();
const validator = require('express-validator');
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(validator());
app.use(cors());
const auth = require('./auth')(app);

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

app.get("/users/:Username", (req, res) => {
  res.json(Users.find(user => user.Username === req.params.Username));
});

app.get("/users", (req, res) => {
  Users.find({}, (err, users) => {
    res.status(201).send(users);
  });
});

app.post('/users', (req, res) => {
  var hashedPassword = Users.hashPassword(req.body.Password);
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();
  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {
    return res.status(422).json({ errors: errors });
  }

  Users.findOne({ Username: req.body.Username })
  .then(user => {
    if (user) {
      return res.status(400).send(req.body.Username + " already existis");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }, (err, user) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          //res.status(201).json(user)
          res.json(user);
        }
      });
    }
  }).catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
  });
});

app.delete('/users/:Username', function(req, res) {
  Users.findOneAndRemove({ Username : req.params.Username })
  .then(function(user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

app.put('/users/:Username', function(req, res) {
  Users.update(
    { Username: req.params.Username},
    { $set: {
      Username: req.body.Username,
      Password: Users.hashPassword(req.body.Password),
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }},
    { new: true },
    function(err, updatedUser) {
      if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
      } else {
          res.json(updatedUser);
      }
    }
  );
});

app.get("/movies", passport.authenticate('jwt', { session: false }), function(req, res) {
  Movies.find()
  .then(function(movies) {
    res.status(201).json(movies);

  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Your app is listening on port 8080`)
);
