var passport = require('passport');
var userController = require('./controller/userController');
var stadiumController = require('./controller/stadiumController');
var authController = require('./controller/authController');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	// app.get('/api/v1/user/:userId', function(req, res) {
	// 	userDAO.readUserById(req.params.userId, {
	// 		"success": function(user) {
	// 			res.send(user);
	// 		},
	// 		"error": function(err) {
	// 			console.log(err);
	// 			res.json(err);
	// 		}
	// 	});
	// });

	app.get('/api/v1/users', passport.authenticate('jwt', { session: false}), function(req, res) {
		userController.getUsers()
		.then(function(userResult) {
			res.send(userResult);
			res.end();
		},
		function(err) {
			console.error(err);
			res.send(err);
			res.end();
		});
	});

	app.post('/api/v1/users', function(req, res) {
		userController.addNewUser(req.body)
		.then(function(result) {
			console.log("success");
			res.send(result.generateJwt());
			res.end();
		},
		function(err) {
			console.log(err);
			res.json(err);
			res.end();
		});
	});

	app.get('/api/v1/users/testpost', function(req, res) {
		userController.testFBpost(req.body)
		.then(function(result) {
			console.log("success");
			res.send(result);
			res.end();
		},
		function(err) {
			console.log(err);
			res.json(err);
			res.end();
		});
	});

	app.get('/api/v1/stadiums', function(req, res) {
		stadiumController.getStadiums()
		.then(function(result) {
			res.send(result);
			res.end();
		},
		function(err) {
			console.error(err);
			res.send(err);
			res.end();
		});
	});

	app.get('/test', function(req, res) {
		res.sendfile('./public/indexjay.html');
	});
	app.get('/test2', function(req, res) {
		res.sendfile('./public/viewfriend.html');
	});

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};