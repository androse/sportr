var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
	userID: { type: Schema.Types.ObjectId, ref: 'User' },
	eventID: { type: Schema.Types.ObjectId, ref: 'Event' },
	comment: String,
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);