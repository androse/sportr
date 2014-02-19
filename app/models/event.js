var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  // Eid: Schema.ObjectID,
  name: String,
  description:  String,
  startTime: Date,
  location: String,
  sport: String,
  users: [{_ID: String}]
  comment: [{_ID: String, date:Date, body:String}]


});

module.exports = mongoose.model('Events', eventSchema);