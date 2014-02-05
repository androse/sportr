var mongoose = require('mongoose');
var User = require('./models/user.js');
var Sport = require('./models/sport.js');

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

// Use function to add a sport to a user passing in userID, sport, and skill
// TODO: change the DB so that the typeOf is the primary key
exports.addUserSport = function addSport(userID, sport, skill){
    console.log("HERHEHRHE");
    User.findOne({'userID': userID}, function(err, user){
        console.log(user.sports);
        if(err) console.log(err);
        else{
            console.log(user);
            User.update({_id: user._id}, {
                $push:{
                    "sports": {typeOf: sport, skill: skill}
                }
            }, function(err, data){
                if(err) console.log(err);
                else console.log(data);
            });
        }
    });
}

// function to get all sports of user passing userID
// callback: used to return the array of sports
//           takes 1 argument
exports.getUserSports = function getSports(userID, callback){
    User.findOne({'userID': userID}, function(err, user){
        if(err) throw err;
        else{
            callback(user.sports);
        }
    });
}

// function to get all sports in the DB
// callback: used to return array of all sports
//           takes 1 argument 
exports.getAllSports = function getAllSports(callback){
    Sport.find(function(err, sports){
        if(err) throw err;
        else{
            callback(sports);
        }
    });
}

// function to add sport to DB, pass name and description 
exports.addSport = function addSport(sname, sdescription){
    console.log(sname);
    console.log(sdescription);
    var sport = new Sport({Sname: sname, Sdescription: sdescription});
    sport.save(function(err){
        if(err) throw err;
    });
}