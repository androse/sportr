var db = require("./database.js");

// Add more navbar links here as necessary
var navbarLinks = {
	'loggedin': {
		'Profile': '/profile',
		'Edit Profile': '/editaccount',
		'Logout': '/logout'
	},
	'loggedout': {}
};


module.exports = function(app, passport) {

	//homepage
	app.get('/', function(req, res) {
		//db.addSport("Australian rules football", "just straight nutters");
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

	app.get('/editaccount', ensureAuthenticated, function(req, res) {
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

	// Sends the client an object containing a list of their current sports 
	// and a list of those they can add 
	app.get('/allsports', function(req, res) {
		db.getAllSports(function(allSports) {
			db.getUserSports(req.user.userID, function(userSports) {
				var sports = {
					available: [],
					user: userSports
				};

				for (var i = 0; i < allSports.length; i++) {
					if (!userPlaysSport(allSports[i], userSports)) {
						sports.available.push(allSports[i].Sname);
					}
				}

				res.json(sports);
			});	
		});
	});

	app.post('/addsport', function(req, res) {
		db.addUserSport(req.user._id, req.body.sport, req.body.skill, 
			function() {
				res.send(200, {success: 'Sport added'});
			},
			function() {
				res.status(500, {error: 'Error adding sport'});
			}
		);
	});

	app.post('/editlocation', function(req, res) {
		db.updateLocation(req.user._id, req.body.location,
			function() {
				res.send(200, {success: 'Location changed'});
			},
			function() {
				res.send(500, {error: 'Error changing location'});
			}
		);
	});

	app.delete('/deleteusersport/:id', function(req, res) {
		db.deleteUserSport(req.user._id, req.params.id,
			function() {
				res.send(200, {success: 'Sport removed'});
			},
			function() {
				res.send(500, {error: 'Error removing sport'});
			}
		);
	});

	// Determine if a user plays a certain sport
	function userPlaysSport(sport, userSports) {
		for (var i = 0; i < userSports.length; i++) {
			if (sport.Sname == userSports[i].typeOf) return true;
		}

		return false;
	}

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
