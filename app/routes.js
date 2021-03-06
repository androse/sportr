var db = require("./database.js");

// Add more navbar links here as necessary
var navbarLinks = {
	'loggedin': {
		'Events': '/events',
		'Profile': '/profile',
		'Edit Profile': '/editaccount',
		'Search': '/searchevent',
		'Logout': '/logout'
	},
	'loggedout': {}
};

module.exports = function(app, passport) {


	// ---------- Webpage rendering routes ----------

	// Home page
	app.get('/', addProperNav, function(req, res) {
		res.render('index', {
			user: req.user,
			page: req.url,
			nav: req.navPages
		});
	});

	// Edit account page
	app.get('/editaccount', ensureAuthenticated, addProperNav, function(req, res) {
		res.render('editaccount', {
			user: req.user,
			page: req.url,
			nav: req.navPages
		});
	});

	// Profile page
	app.get('/profile', ensureAuthenticated, addProperNav, function(req, res) {
		console.log(req.user);
		res.render('profile', {
			user: req.user,
			page: req.url,
			nav: req.navPages
		});
	});

	// User page
	app.get('/user/:id', ensureAuthenticated, addProperNav, function(req, res) {
		db.getUser(req.params.id,
			function(user) {
				res.render('user', {
					page: req.url,
					nav: req.navPages,
					user: user,
					isSelf: (user._id + '' == req.user._id + ''),
					areFriends: areFriends(req.user.following, user._id)
				});
			},
			function() {
				// Make an error page ("Sorry I couldn't find that for you!")
				res.render('error');
			}
		);
	});	

	

	// Event creation page
	// Need to create page with form
	app.get('/createevent', ensureAuthenticated, addProperNav, function(req, res) {
		addAllSports(function(sports) {
			res.render('createevent', {
				user: req.user,
				page: req.url,
				nav: req.navPages,
				sports: sports
			});
		});
	});
	
	//Events page
	app.get('/events', ensureAuthenticated, addProperNav, populateInvites, function(req, res) {
        db.getUserEvents(req.user._id, function(userEvents) {
				db.getAllEvents(function(allEvents) {
					var events = {user: [], all: []};
					for (var i = 0; i < allEvents.length; i++) {
						events.all.push(allEvents[i]);
						if (userInEvent(allEvents[i], userEvents)) {
							events.user.push(allEvents[i]);
						} 
					}
					res.render('events', {
					    user: req.user,
					    page: req.url,
					    nav: req.navPages,
					    events: events,
					    invites: req.invites
					});
				},
				function() {
					res.redirect('/events');
				});
			}, 
			function() {
				res.redirect('/events');
			}
  		);
	});

	// Display an individual event
	app.get('/event/:id', ensureAuthenticated, addProperNav, function(req, res) {
		db.getEvent(req.params.id, 
			function(event) {
				// ensure that users that are already in an event cannot be invited again
				for (var i = 0; i < req.user.following.length; i++) {
					if (followeeInEvent(event, req.user.following[i]._id)) {
						req.user.following.splice(i, 1);
					}
				}

				res.render('event', {
					page: req.url,
					nav: req.navPages,
					user: req.user,
					event: event
				});
			},
			function() {
				// Make an error page ("Sorry I couldn't find that for you!")
				res.render('error');
			}
		);
	});
	
	//Search page
	app.get('/searchevent', ensureAuthenticated, addProperNav, function(req, res) {
        addAllSports(function(sports) {
            res.render('search', {
                user: req.user,
                page: req.url,
                nav: req.navPages,
                sports: sports
            });
        });
	});
	
	app.get('/search', ensureAuthenticated, addProperNav, function(req, res) {
		db.search(req.query.searchsport, req.query.searchlocation, req.query.searchdate, 
			function(events) {
                db.getUserEvents(req.user._id, function(userEvents) {
                    db.getAllEvents(function(allEvents) {
                        var eventlist = {user: [], all: []};

                        for (var i = 0; i < events.length; i++) {
                            if (userInEvent(events[i], userEvents)) {
                                eventlist.user.push(events[i]);
                            } else {
                                eventlist.all.push(events[i]);
                            }
                        }

                        res.render('searchresult', {
                            user: req.user,
                            page: req.url,
                            nav: req.navPages,
                            events: events,
                            eventlist: eventlist
                        });
                    },
                        function() {
                            res.redirect('/searchresult');
                        });
                    }, 
                        function() {
                            res.redirect('/searchresult');
                        }
                    );
                },
			function() {
				// Return 500 (or something more specific) and display error message maybe?
				console.log('Search Error!');
				addAllSports(function(sports) {
                    res.render('searchresult', {
                        user: req.user,
                        page: req.url,
                        nav: req.navPages,
                        sports: sports
                    });
                });
			}
		);
	});

	app.get('/searchuser', ensureAuthenticated, addProperNav, function(req, res) {
 		console.log(req.query);
 		db.searchUser(req.query.username, 
 			function(users){
 				if (users.length === 1) {
 					res.redirect('/user/' + users[0]._id);
 				} else {
	 				res.render('userresults', {
	                    users: users,
	                    page: req.url,
	                    nav: req.navPages,
	                });
	            }
 			}, 
			function(){
				res.redirect('/searchevent');
			}
		);
 	});
    
    app.get('/acceptrequest', ensureAuthenticated, addProperNav, function(req, res) {
        addAllSports(function(sports) {
            res.redirect('profile');
        });
	});
    
    app.get('/rejectrequest', ensureAuthenticated, addProperNav, function(req, res) {
        addAllSports(function(sports) {
            res.redirect('profile');
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

	// Creates a new event in the db
	app.post('/newevent', function(req, res) {
		// Should indicate to the user that their event has been added
		db.createEvent(req.user._id, {
				name: req.body.eventname,
				description: req.body.eventdescription,
				startTime: new Date(req.body.eventdatetime),
  				location: req.body.eventlocation,
  				sport: req.body.eventsport
			},
			function() {
				console.log('Event created')
				res.redirect('/events');
			},
			function() {
				console.log('Error creating event');
				res.redirect('/profile');
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

	app.post('/follow/:id', function(req, res){
		db.followUser(req.user._id, req.params.id, 
			function(){
				res.send(200, {success: 'User followed'});
			}, function(){
				res.send(500, {error: 'Error following user'});
			}
		);
	});

	app.delete('/unfollow/:id', function(req, res) {
		db.unfollowUser(req.user._id, req.params.id,
			function() {
				res.send(200, {success: 'User unfollowed'});
			}, function() {
				res.send(500, {error: 'Error unfollowing user'});
			}
		);
	});

	app.post('/comments/:id', ensureAuthenticated, addProperNav, function(req, res){
		db.addComment(req.params.id, req.user.userName, req.body.comment,
			function(){
				res.redirect('/event/' + req.params.id);
			}, function(){
				res.send(500, {error: 'Error leaving commenting'});
			});
	});

	app.delete('/comments/:id', ensureAuthenticated, addProperNav, function(req, res){
		console.log(req.params.id);
		db.deleteComment(req.params.id, 
			function() {
				console.log("DELETED COMMENT");
				res.send(200, {success: 'Comment deleted'});
			},
			function() {
				res.send(500, {error: 'Error deleting comment'});
		});
	});

	// invite users to an event
	app.post('/invite', ensureAuthenticated, function(req, res) {
		var inviteStr = req.body.invite + '';
		var inviteArr = inviteStr.split(',');
		
		db.inviteToEvent(req.body.userID, req.body.eventID, inviteArr,
			function() {
				res.redirect('/event/' + req.body.eventID);
			},
			function() {
				res.redirect('/event/' + req.body.eventID);
			}
		);
	});

	// Need to create the db function to associate an event to a user 
	app.post('/joinevent/:id', ensureAuthenticated, function(req, res) {
		db.joinEvent(req.user._id, req.params.id,
			function() {
				res.send(200, {success: 'Event joined'});
			},
			function() {
				res.send(500, {error: 'Error joining event'});
			}
		);
	});

	app.delete('/invite/:id', ensureAuthenticated, function(req, res) {
		console.log("HERE");
		db.removeInviteByID(req.user._id, req.params.id,
			function() {
				console.log("success");
				res.send(200, {success: 'Invite Declined'});
			},
			function() {
				console.log("error");
				res.send(500, {error: 'Error declining event'});
			});
	});
	// ---------- Utitily functions ----------

	// Used to add all sports to the template object
	function addAllSports(callback) {
		db.getAllSports(callback);
	}

	// Determine if a user plays a certain sport
	function userPlaysSport(sport, userSports) {
		for (var i = 0; i < userSports.length; i++) {
			if (sport.Sname == userSports[i].typeOf) return true;
		}

		return false;
	}

	// Determine if a user has joined an event
	function userInEvent(event, userEvents) {
		for (var i = 0; i < userEvents.length; i++) {
			if (event._id + '' == userEvents[i]._id + '') return true;
		}

		return false;
	}

	function areFriends(following, userID) {
		for (var i = 0; i < following.length; i++) {
			if (userID + '' == following[i]._id + '') return true;
		}

		return false;
	}

	function followeeInEvent(event, followeeID) {
		for (var i = 0; i < event.users.length; i++) {
			if (followeeID + '' == event.users[i]._id + '') return true;
		}

		return false;
	}

	// ---------- Custum middlewares ----------

	// A route middleware that Us whether a user is authenticated
	// If they are the request proceeds, if not they are redirected to login
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	// Used to determine what kind of navbar to display
	function addProperNav(req, res, next) {
		if (req.isAuthenticated()) { req.navPages = navbarLinks.loggedin }
		else {req.navPages = navbarLinks.loggedout }

		return next();
	}

	// Get a populated list of invites and put it in the request
	function populateInvites(req, res, next) {
		db.populateInvites(req.user._id, 
			function(invites) {
				req.invites = invites;
				return next();
			},
			function() {
				res.redirect('/');
			}
		);
	}
}
