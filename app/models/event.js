var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  // Eid: Schema.ObjectID,
  Edescription:  String,
  startTime: Date,
  location: String,
  sport: String,
  users: [{userID: String}]

});

module.exports = mongoose.model('Events', eventSchema);