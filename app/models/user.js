var mongoose = require('mongoose');

// Simple user schema, more fields will need to be added later
// TODO: change the DB so that userID is the primarty key
var userSchema = new mongoose.Schema({
	userID: String,
	userName: String,
	location: String,
    sports: [{typeOf: String, skill: String}],
    following: []
});

module.exports = mongoose.model('User', userSchema);