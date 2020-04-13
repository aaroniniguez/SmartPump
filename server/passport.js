const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(__dirname+'/users.json')
const db = low(adapter);

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require(__dirname+"/keys");
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

function userExists(email) {
	let hasEmail = db.get("users")
		.find({email: email})
		.value();
	return hasEmail
}

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        let email = jwt_payload.email;
        let hasEmail = userExists(email);
        if(hasEmail) {
            return done(null, hasEmail);
        } else {
            return done(null, false);
        }
    })
  );
};
