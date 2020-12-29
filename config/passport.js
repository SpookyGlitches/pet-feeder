var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const db = require("./database");
const { validPassword } = require('../helpers/password');

const customFields = {
	usernameField: "email",
	passwordField: "password",
};

const verifyCallback = function (email, password, done) {
	if (!(email || password)) {
		return done(null, false);
	}
	db.query(
		"SELECT * FROM users WHERE email = ? LIMIT 1",
		[email],
		function (err, result) {
			if (err) {
				throw err;
			}
			if (result.length == 0) {
				return done(null, false);
			} else {
				if (
					validPassword(
						password,
						result[0].hash,
						result[0].salt
					)
				) {
					return done(null, result[0]);
				} else {
					return done(null, false);
				}
			}
		}
	);
};
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser(function (user, done) {
	done(null, {
		id: user.id,
		email: user.email,
	});
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

module.exports = passport;
