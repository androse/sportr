var mongoose = require('mongoose');
var User = require('./models/user.js');

// Find a user by their ID
exports.checkUser = function checkUser(userID, callback) {
    User.findOne({'userID': userID}, function(err, user) {
        if (user) {    
            console.log('User: ' + user.userID + ' found!');
        } else {
            console.log('User: ' + userID + ' was not found!');
        }
        callback(err, user);
  });
}

// If a user is already in the db then that user is returned in the callback
// If not a new user is created, added then returned in the callback
exports.findOrAddUser = function findOrAddUser(userID, userName, callback) {
	User.findOne({'userID': userID}, function(err, user) {
        if (err) throw err;
        else if (user) {
            console.log('User: ' + user.userID + ' already exist!');
            callback(false);
        } else {
            var newUser = new User({userID: userID, userName: userName});
            newUser.save(function(err) {
                if (err) throw err;
                else {
                    console.log('New User: ' + newUser.userID + ' added!');
                    callback(true);
                }
            })
        }
    });
}