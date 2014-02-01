var mongoose = require('mongoose');
var User = require('./models/user.js');

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

exports.findOrAddUser = function findOrAddUser(userID, userName, callback) {
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