const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
var allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors({
 origin: function(origin, callback){
	 	console.log(origin)
	 	// allow requests with no origin
    // (like mobile apps or curl requests)
		if(!origin) return callback(null, true);

   if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
     var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
     return callback(new Error(message ), false);
   }
   return callback(null, true);
 }
 // origin: 'http://localhost:8080'
}));


const auth = require('./auth')(app);

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myFlix', { useNewUrlParser: true });
// const uri = "mongodb+srv://myFlixDBadmin:WkayMtRiaN0T6ND9@myflixdb-mgsqm.mongodb.net/myFlix?retryWrites=true";
const uri = "mongodb://myFlixDBadmin:WkayMtRiaN0T6ND9@myflixdb-shard-00-00-mgsqm.mongodb.net:27017,myflixdb-shard-00-01-mgsqm.mongodb.net:27017,myflixdb-shard-00-02-mgsqm.mongodb.net:27017/myFlix?ssl=true&replicaSet=myFlixDB-shard-0&authSource=admin&retryWrites=true"
const options = {
	//  reconnectTries: Number.MAX_VALUE,
	//  poolSize: 10,
	// 	reconnectInterval: 500,
	//  autoReconnect: true,
  useNewUrlParser: true,
	//  dbName: 'myFlix'
};

mongoose.connect(uri, options);

/*app.get('/movies', (req, res) => {
	res.send('Welcome');
});*/

/*app.get("/users/:Username", (req, res) => {
	res.json(Users.find(user => user.Username === req.params.Username));
});*/

/*app.get("/users", (req, res) => {
	Users.find().then(users => {
		res.json(users);
	});
});*/

/*app.get("/users", (req, res) => {
	Users.find().then(users => {
		res.status(500).send("test");
	});
});*/

app.get("/users", (req, res) => {
	console.log('users')
	Users.find({}, (err, users) => {
		res.status(201).send(users);
	});
	// Users.find().then(function(users) {
	// 	console.log(users, '!!users');
	// 	res.status(201).send(users);
	// }).catch(e => console.log(e));
});

/*app.post('/users', (req, res) => {
	//res.send("Successful request for creating a new user")
	console.log(req.body.Username);
	Users.findOne({ Username: req.body.Username })
		.then(user => {
			if (user) {
				return res.status(400).send(req.body.Username + " already existis");
			} else {
				Users.create({
					Username: req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday
				})
				.then(function(user) { res.status(201).json(user) })
				.catch(function(error) {
					console.error(error);
					res.status(500).send("Error: " + error);
				});
			}
		}).catch(function(error) {
			console.error(error);
			res.status(500).send("Error: " + error);
		});
});*/

app.post('/users', (req, res) => {
	//res.send("Successful request for creating a new user")
  var hashedPassword = Users.hashPassword(req.body.Password);

	console.log(req.body.Username, req.body.Password);
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

/*Movies.find({"Genre": { "Name": "Thriller"} }, function(err, movies) {
	movies.forEach(function(movie){ console.log(movie);});
});*/

/*Movies.find({"Title": "Silence of the Lambs"}, function(err, movies) {

	movies.forEach(function(movie) { console.log(movie); });
});*/

/*Users.find((err, users) => {
	users.forEach(user => console.log(user));
});*/


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
			Password: req.body.Password,
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
	)
});

// Users.find().then(users => users.forEach(user => console.log(user.Username)));

// app.get("/movies", passport.authenticate('jwt', { session: false }), function(req, res) {

app.get("/movies", function(req, res) {
	Movies.find()
		.then(function(movies) {
			res.status(201).json(movies);

		}).catch(function(error) {
			console.error(error);
			res.status(500).send("Error: " + error);
		});


});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Your app is listening on port 8080`)
);
