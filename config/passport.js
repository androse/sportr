var authConfig = require('./auth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('../app/database.js');

module.exports = function(passport) {

	// To allow for persistent login sessions

	// When the user is authenticated successfully their id is serialized to
	// the session via a cookie
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// When the user visits another page the id from the cookie is deserialized
	// so that it can be used to retrieve a user that is passed to done and
	// accessable later through req.user
	passport.deserializeUser(function(id, done) {
		done(null, id);
		//db.checkUser(id, done);
	});
	
	passport.use(new FacebookStrategy({
		// Options and credentials
		clientID: authConfig.facebookAuth.clientID,
		clientSecret: authConfig.facebookAuth.clientSecret,
		callbackURL: authConfig.facebookAuth.callbackURL
	// Verify callback which accepts the returned user credentials and the done callback
	}, function(accessToken, refreshToken, profile, done) {
		// This may need to be put in a next tick call so that the user is not 
		// redirected before the done is returned
		// db.findOrAddUser(profile.id, profile.name.givenName + ' ' + profile.name.familyName, done);
		process.nextTick(function () {
   			return done(null, profile._json);
 		});
	}));
}