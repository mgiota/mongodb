const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Models = require('./models.js');
const Users = Models.User;

const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
        usernameField: 'Username',
        passwordField: 'Password'
    }, function(username, password, callback) {
		console.log(username, '!!username');
		console.log(password, '!!password');
    var hashedPassword = Users.hashPassword(password);

		Users.findOne({Username: username }, function(err, user) {
			if (err) {
				console.log(err);
				return callback(err);
			}

			if (!user) {
				return callback(null, false, { message: 'Incorrect username' });
			}

      if (!user.validatePassword(password)) {
				console.log("incorrect password");
				return callback(null, false, { message: 'Incorrect password.' });
			}

			return callback(null, user);

		})

	}
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, callback) {
        return Users.findById(jwtPayload._id)  // See if any users match the one stored in the JWT token
            .then(user => {
                return callback(null, user);
            })

            .catch(err => {
                return callback(err);
            });
    }
));
