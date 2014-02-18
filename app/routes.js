var db = require("./database.js");

// Add more navbar links here as necessary
var navbarLinks = {
	'loggedin': {
		'Create Event': '/createevent',
		'Profile': '/profile',
		'Edit Profile': '/editaccount',
		'Logout': '/logout'
	},
	'loggedout': {}
};

//TESTING createEvent
// var evnt = {
// 	Edescription: "no equipment game",
// 	startTime: new Date(2014, 2, 24, 5, 30, 0),
// 	location: "Jeanne Mance",
// 	sport: "Hockey",
// 	users: [{userID: "534950216"}]
// };

// db.createEvent(evnt);

// {
//  startTime: Data,      
//  location: String,      This can change once location schema is made
//  sport: String,
//  users: [{userID: String}] }


module.exports = function(app, passport) {

	// ---------- Webpage rendering routes ----------

	// Home page
	app.get('/', function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('index', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// Edit account page
	app.get('/editaccount', ensureAuthenticated, function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('editaccount', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// Profile page
	app.get('/profile', ensureAuthenticated, function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('profile', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// Event creation page
	// Need to create page with form
	app.get('/createevent', ensureAuthenticated, function(req, res) {
		renderProperNav(req, function(navPages) {
			res.render('createevent', {
				user: req.user,
				page: req.url,
				nav: navPages
			});
		});
	});

	// ---------- Login / Logout routes ----------

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

	// Simple logout route, that sends the user to the home page post logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// ---------- API routes ----------

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

	app.put('/editlocation', function(req, res) {
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
	
	app.delete('/deleteaccount', function(req, res) {
		db.deleteAccount(req.user._id,
			function() {
				res.send(200, {success: 'User removed'});
			},
			function() {
				res.send(500, {error: 'Error removing user'});
			}
		);
	});

	// Need to create the db function to add the new event to the db
	app.put('/newevent', function(req, res) {
		var evnt = {
			Edescription: "no equipment game",
			startTime: new Date(2014, 2, 24, 5, 30, 0),
			location: req.body.location,
			sport: req.body.sport,
			users: [{userID: req.user._id}]
		};

		// db.addEvent(req.user._id, req.body.name, req.body.sport, 
		// 	req.body.minPlayers, req.body.maxPlayers, req.body.location,
		// 	req.body.date, req.body.time,
		db.createEvent(evnt,
			function() {
				res.send(200, {success: 'Event created'});
			},
			function() {
				res.send(500, {error: 'Error creating event'});
			}
		);
	});

	// Need to create the db function to associate an event to a user 
	app.post('/joinevent/:id', function(req, res) {
		db.joinEvent(req.user._id, req.params.id,
			function() {
				res.send(200, {success: 'Event joined'});
			},
			function() {
				res.send(500, {error: 'Error joining event'});
			}
		);
	});

	// Need to create the db function to disassociate a user with an event
	app.delete('/leaveevent/:id', function(req, res) {
		db.leaveEvent(req.user._id, req.params.id,
			function() {
				res.send(200, {success: 'Event left'});
			},
			function() {
				res.send(500, {error: 'Error leaving event'});
			}
		);
	});

	// ---------- Utitily functions ----------

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

	// ---------- Custum middlewares ----------

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
