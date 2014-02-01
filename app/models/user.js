var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userID: String,
	userName: String	
});

module.exports = mongoose.model('User', userSchema);