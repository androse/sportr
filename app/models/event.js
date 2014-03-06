var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  // Eid: Schema.ObjectID,
  name: String,
  description:  String,
  startTime: Date,
  location: String,
  sport: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Event', eventSchema);