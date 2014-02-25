var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Simple user schema, more fields will need to be added later
// TODO: change the DB so that userID is the primarty key
var userSchema = new mongoose.Schema({
	userID: String,
	userName: String,
	location: String,
    sports: [{typeOf: String, skill: String}],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    following: []
});

module.exports = mongoose.model('User', userSchema);