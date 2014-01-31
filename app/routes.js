module.exports = function(app, passport) {
	
	app.get('/', function(req, res) {
		res.send('Hello Sportr');
	});
	
	app.get('/login', function(req, res) {
		res.send('login page');
	});
		
	app.get('/logout', function(req, res) {
		res.send('logout page');
	});

	app.get('/events', function(req, res) {
		res.send('events page');
	});


}
