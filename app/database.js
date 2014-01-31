var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect('mongodb://jstirl:ecse428@dharma.mongohq.com:10086/sportr', function(err) {
                 if (err) throw err;
    });

var userSchema = new Schema({userID: String, userName: String});

var User = mongoose.model('User', userSchema);

exports.checkUser = function checkUser(userID, userName, callback){
	User.find({}, function(err, documents) {
           console.log(documents);
           callback("documents");
        });
}

exports.addUser = function addUser(userID, userName, callback){
	var newUser = new User({userID: userID, userName: userName});
	newUser.save(function (err) {
 		 if (err) // ...
  	console.log('saved');
	});
	callback("Add user i think");
}
