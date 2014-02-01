var mongoose = require('mongoose');

// Simple user schema, more fields will need to be added later
var userSchema = new mongoose.Schema({
	userID: String,
	userName: String	
});

module.exports = mongoose.model('User', userSchema);