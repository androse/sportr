var authConfig = require('./auth.js');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {

	// To allow for persistent login sessions

	// When the user is authenticated successfully their id is serialized to
	// the session via a cookie
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// When the user visits another page the id from the cookie is deserialized
	// so that it can be used to retrieve a user that is passed to done and
	// accessable later through req.user
	passport.deserializeUser(function(id, done) {
		// Call a function which finds the user based on the id
		// then call done(err, user) in that functions callback
		
		/*
		fakeuser.findByID(id, function(err, user) {
			done(err, user);
		});
		*/
	});
	
	passport.use(new FacebookStrategy({
		// Options and credentials
		clientID: authConfig.facebookAuth.clientID,
		clientSecret: authConfig.facebookAuth.clientSecret,
		callbackURL: authConfig.facebookAuth.callbackURL
	// Verify callback which accepts the returned user credentials and a done
	// callback function that is called when finished
	}, function(accessToken, refreshToken, profile, done) {
		 
		// This may need to be put in a next tick call so that the user is not 
		// redirected before the done is returned
		// fakeuser.findByID(profile.id, function(err, user) {
		// 	// Access the user in the DB if they exist through profile.id
		// 	if (user) {
		// 		return done(null, user);
		// 	// Or create a new user if they do not
		// 	} else {
		// 		fakeuser.newUser(profile, function(err, user) {
		// 			return done(null, user);
		// 		});
		// 	}
		// });
		
	}
	));
}