module.exports = function(app, passport) {

	// Use this route on any facebook login button
	// Use the facebook authentication strategy found in config/passport.js as
	// a route middleware
	app.get('/auth/facebook', passport.authenticate('facebook'));

	// If the authentication is successful redirect to the user's profile
	// If it fails redirect them back to the login page
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/login'
	}));

	// The ensureAuthenticated middleware only allows authenticated users to
	// access /profile. The rendered page uses req.user to display the user's
	// info
	app.get('/profile', ensureAuthenticated, function(req, res) {
		// Views are what are rendered and need to be made
		//res.render('profile', { user: req.user });
	});

	// Simple logout route, that sends the user to the home page post logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// A route middleware that checks whether a user is authenticated
	// If they are the request proceeds, if not they are redirected to login
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
}
