var mongoose = require("mongoose");

mongoose.connect('mongodb://jstirl:ecse428@dharma.mongohq.com:10086/sportr', function(err) {
                 if (err) throw err;
    });

var User = mongoose.model('Cat', { name: String });

exports.checkUser = function checkUser(userID, userName, callback){
	User.find({}, function(err, documents) {
           console.log(documents);
        });
}
