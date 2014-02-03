var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  fname:  String,
  lname:  String,
  FBID: String,
});

