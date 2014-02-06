
var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	port = process.env.PORT || 8080,
	passport = require('passport');

// Configure passport using the passport object just created
require('./config/passport.js')(passport);

// Connect to the mongo database
mongoose.connect(require('./config/database.js').address, function(err) {
	if (err) throw err;
});

//-------------------------------------------------------------------

// Configure templating engine
app.set('views', __dirname + '/views');
// Change to the desired templating engine
app.set('view engine', 'ejs');

// Configure express
app.use(express.logger('dev'));
app.use(express.cookieParser()); // Needed for sessions
app.use(express.bodyParser()); // Parse form data
app.use(express.session({ secret: 'oursupercoolsecrettopreventtampering' }));
app.use(express.static(__dirname + '/public')); // Serve static files (css etc)

// Further configure express for use with passport
app.use(passport.initialize());
app.use(passport.session());

//-------------------------------------------------------------------

// Routes initialized here
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('App listening on port ' + port);
