var database = require("./database.js");

// Add more navbar links here as necessary
var navbarLinks = {
	'loggedin': {
		'Profile': '/profile',
		'Edit Profile': '/editaccount',
		'Logout': '/logout'
	},
	'loggedout': {}
};

// used to test DB connections
// database.addUserSport("534950216", "hockey", "intermediate", function(){
// 	console.log("ADDED SPORT");
// });
// database.getUserSports("534950216", function(sports){
// 	console.log(sports);
// });
// database.addSport("ice hockey", "nutters on ice");
// database.addSport("Australian rules football", "just straight nutters");
database.getAllSports(function(sports){
	console.log(sports);
});

module.exports = function(app, passport) {

	//homepage
	app.get('/', function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('index', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// Use this route on any facebook login button
	// Use the facebook authentication strategy found in config/passport.js as
	// a route middleware
	app.get('/auth/facebook', passport.authenticate('facebook'));

	// If the authentication is successful redirect to the user's profile
	// If it fails redirect them back to the index page
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'})
	);

	app.get('/editaccount', function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('editaccount', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// The ensureAuthenticated middleware only allows authenticated users to
	// access /profile. The rendered page uses req.user to display the user's
	// info
	app.get('/profile', ensureAuthenticated, function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('profile', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});

		/*
		// Views are what are rendered and need to be made
		console.log("sdgfhjgsdfkwfkjbkef");

		console.log(req.user);
		// console.log("ID: ?   name: ?", [req.user.userID, req.user.userName]);
		database.findOrAddUser(req.user.id, req.user.name, function(isNew){
			if(isNew){
				res.render('profile', {user: req.user, welcome: "Welcome!"});
			}
			else{
				res.render('profile', { user: req.user, welcome: "Welcome back!" });
			}
		});
		// res.render('profile', { user: req.user, welcome: "Welcome back!" });
		*/
	});

	app.get('/newUser', ensureAuthenticated, function(req, res){
		res.render('profile', {user: req.user, welcome: "Welcome!"});
	});

	// Simple logout route, that sends the user to the home page post logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//testing DB connection
	app.get('/testadd', function(req, res){
		database.addUser("123", "Jordan", function(temp){
			res.writeHeader(200, {"Content-Type": "text/plain"});
            res.write(temp);
            res.end();
		});
	});
	app.get('/testquery', function(req, res){
		database.checkUser("kfm", "dkjfb", function(temp){
			res.writeHeader(200, {"Content-Type": "text/plain"});
            res.write("check log");
            res.end();
		});
	});

	// Used to determine what kind of navbar to display
	function renderProperNav(req, callback) {
		if (req.isAuthenticated()) { var navPages = navbarLinks.loggedin }
		else {var navPages = navbarLinks.loggedout }

		callback(navPages);
	}

	// A route middleware that checks whether a user is authenticated
	// If they are the request proceeds, if not they are redirected to login
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}
}
