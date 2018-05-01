var config = require('../../config/config');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
var User = mongoose.model('User');


var opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
	secretOrKey: config.jwtSecret
	// issuer: "accounts.examplesoft.com",
	// audience: "yoursite.net"
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	User.findOne({fb_id: jwt_payload.fb_id}, function(err, user) {
		if (err) {
			return done(err, false);
		}
		if (user) {
			done(null, user);
		} else {
			done(null, false);
			// or you could create a new account 
		}
	});
}));