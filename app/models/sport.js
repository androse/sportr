var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sportSchema = new Schema({
  Sname:  String,
  Sdescription:  String,
  users: [{userID: String}]
});

module.exports = mongoose.model('Sports', sportSchema);