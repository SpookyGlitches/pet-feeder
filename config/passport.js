var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var crypto = require("crypto");
const db = require("./database");

const customFields = {
	usernameField: "email",
	passwordField: "password",
};
const verifyCallback = (email, password, done) => {
    if(!(email || password)){
        return done(null,false);
    }
	db.query(
		"SELECT * FROM users WHERE email = ? LIMIT 1",
		[email],
		(err, result) => {
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

passport.serializeUser((user, done) => {
	done(null, {
		id: user.id,
		email: user.email,
	});
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

function validPassword(password, hash, salt) {
	var hashVerify = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return hash === hashVerify;
}
module.exports = passport;
