var mongoose = require('mongoose');
var User = require('./models/user.js');
var Sport = require('./models/sport.js');
var Event = require('./models/event.js');
var Comment = require('./models/comment.js');

// Find a user by their ID
function checkUser(userID, callback) {
    User
    .findOne({'userID': userID})
    .populate('following', '_id userName')
    .exec(function(err, user) {
        // if (err) errorCB() ;
        // else {
            if (user) {    
                console.log('User: ' + user.userID + ' found!');
            } else {
                console.log('User: ' + userID + ' was not found!');
            }
            callback(err, user);
        // } 
    });
  //   User.findOne({'userID': userID}, function(err, user) {
  //       if (user) {    
  //           console.log('User: ' + user.userID + ' found!');
  //       } else {
  //           console.log('User: ' + userID + ' was not found!');
  //       }
  //       callback(err, user);
  // });
}

// If a user is already in the db then that user is returned in the callback
// If not a new user is created, added then returned in the callback
function findOrAddUser(userID, userName, callback) {
	User.findOne({'userID': userID}, function(err, user) {
        if (err) throw err;
        else if (user) {
            console.log('User: ' + user.userID + ' already exist!');
            return callback(null, user);
        } else {
            var newUser = new User({userID: userID, userName: userName});
            newUser.save(function(err) {
                if (err) throw err;
                else {
                    console.log('New User: ' + newUser.userID + ' added!');
                    return callback(null, newUser);
                }
            })
        }
    });
}

// Find a user to display their profile
function getUser(userID, successCB, errorCB) {
    User
    .findById(userID)
    .populate('following', '_id userName')
    .exec(function(err, user) {
        if (err) errorCB();
        else successCB(user);
    });
}

// Update a user's location
function updateLocation(userID, userLocation, successCB, errorCB) {
    User.findByIdAndUpdate(userID, { $set: { location: userLocation }}, function(err, user) {
        if (err) {
            console.log(err);
            errorCB();
        } else {
            successCB();
        }
    });
}

// Use function to add a sport to a user passing in userID, sport, and skill
// TODO: change the DB so that the typeOf is the primary key
function addUserSport(userID, sport, skill, successCB, errorCB){
    User.findByIdAndUpdate(userID, { $push: { 
        sports: { typeOf: sport, skill: skill }
    }}, function(err, user) {
        if(err) {
            errorCB();
        } else {
            successCB();
        }
    });
}

// function to get all sports of user passing userID
// callback: used to return the array of sports
//           takes 1 argument
function getUserSports(userID, callback){
    User.findOne({'userID': userID}, function(err, user){
        if(err) throw err;
        else{
            callback(user.sports);
        }
    });
}

function deleteUserSport(userID, sportID, successCB, errorCB) {
    User.findByIdAndUpdate(userID, { $pull: {
        sports: { _id: sportID }
    }}, function(err, user) {
        if(err) {
            errorCB();
        } else {
            successCB();
        }
    });
}

function deleteAccount(userID, successCB, errorCB) {
    User.findByIdAndRemove(userID, function(err, user) {
        if(err) {
            errorCB();
        } else {
            successCB();
        }
    });
	console.log('in db deleted user'+userID);
}

// function to get all sports in the DB
// callback: used to return array of all sports
//           takes 1 argument 
function getAllSports(callback){
    Sport.find(function(err, sports){
        if(err) throw err;
        else{
            callback(sports);
        }
    });
}

// function to add sport to DB, pass name and description 
function addSport(sname, sdescription){
    console.log(sname);
    console.log(sdescription);
    var sport = new Sport({Sname: sname, Sdescription: sdescription});
    sport.save(function(err){
        if(err) throw err;
    });
}

// Find a single event
function getEvent(eventID, successCB, errorCB) {
    Event
    .findById(eventID)
    .populate('users', '_id userName')
    .populate('comments', null, null, {sort: {date: -1 }})
    .exec(function(err, event) {
        if (err) errorCB() ;
        else successCB(event); 
    });
}

// function to create a new event, 
function createEvent(userID, data, successCB, errorCB){
    var event = new Event(data);
    event.save(function(err, event){
        if(err) errorCB();
        else {
            joinEvent(userID, event._id, successCB, errorCB);
        }
    });
}

function joinEvent(userID, eventID, successCB, errorCB) {
    // Add user to the event and the event to the user
    User.findByIdAndUpdate(userID, { $push: { events: eventID }}, 
        function(err, user) {
            if(err) {
                errorCB();
            } else {
                Event.findByIdAndUpdate(eventID, { $push: { users: userID }}, 
                    function(err, event) {
                        if (err) {
                            errorCB();
                        } else {
                            successCB();
                        }
                });
            }
    });
}

function leaveEvent(userID, eventID, successCB, errorCB) {
    // Remove user from the event and the event from the user
    User.findByIdAndUpdate(userID, { $pull: { events: eventID }}, 
        function(err, user) {
            if(err) {
                errorCB();
            } else {
                Event.findByIdAndUpdate(eventID, { $pull: { users: userID }}, 
                    function(err, event) {
                        if (err) {
                            errorCB();
                        } else {
                            successCB();
                        }
                });
            }
    });
}

// Get all events a specific user has joined
function getUserEvents(userID, successCB, errorCB) {
    User.findById(userID, 'events', function(err, user) {
        Event
        .find({ '_id': { $in: user.events }})
        .populate('users', '_id userName')
        .exec(function(err, events) {
            if (err) errorCB();
            else successCB(events);
        })
    });
}

function getAllEvents(successCB, errorCB) {
	Event
    .find()
    .populate('users', '_id userName')
	.exec(function(err, events) {
        if (err) errorCB();
		else {
		    console.log("couldnt get all events");
            successCB(events);
        }
    });
}

// ---------- Search ----------

function search(sport, location, date, successCB, errorCB) {
    var query = {};

    // Query if specified
    if (sport) {query.sport = sport;}
    if (location) {
        var regLoc = new RegExp(location, 'i');
        // regex search for any location containing location
        query.location = regLoc;
    } if (date) {
        var startDate = new Date(date);
        var endDate = new Date(date);
        endDate.setTime(endDate.getTime() + 864e5); // +1 day

        query.startTime = {$gte: startDate, $lt: endDate};
    }

    Event
    .find(query)
    .populate('users', 'userName')
    .exec(function(err, events) {
        if (err) errorCB();
        else {
            console.log(events);
            successCB(events);
        }
    });
}

// Function to search Users
function searchUser(username, successCB, errorCB){
    User.findOne({'userName': username}, '_id', function(err, user){
        if(err) errorCB(err);
        else if(user) successCB(user._id);
    });
}

// Function to follow users
function followUser(followerID, followeeID, successCB, errorCB){
    User.findByIdAndUpdate(followerID, { $push: { following: followeeID }}, 
        function(err, user) {
            if(err) {
                errorCB();
            } else {
               successCB();
            }
    });
}

function addComment(eventID, userName, comment, successCB, errorCB){
    var data = {user: userName, comment: comment};
    var comment = new Comment(data);
    comment.save(function(err, comment){
        if(err) errorCB(err);
        else {
            Event.findByIdAndUpdate(eventID, { $push: {comments: comment._id}},
                function(err, event) {
                    if (err) errorCB();
                    else successCB();
                });
        }
    });
}

// This allows functions to be used by others in this file
// Make sure to add any function you add to the module to this
module.exports = {
    checkUser: checkUser,
    findOrAddUser: findOrAddUser,
    getUser: getUser,
    updateLocation: updateLocation,
    addUserSport: addUserSport,
    getUserSports: getUserSports,
    deleteUserSport: deleteUserSport,
    deleteAccount: deleteAccount,
    getAllSports: getAllSports,
    addSport: addSport,
    getEvent: getEvent,
    createEvent: createEvent,
    joinEvent: joinEvent,
    leaveEvent: leaveEvent,
    getUserEvents: getUserEvents,
    getAllEvents: getAllEvents,
    search: search,
    searchUser: searchUser,
    followUser: followUser,
    addComment: addComment
}
