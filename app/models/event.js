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
  comment: [{date:Date, body:String}]
});

module.exports = mongoose.model('Events', eventSchema);