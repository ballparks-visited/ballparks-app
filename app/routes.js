var userController = require('./controller/userController');
var userDAO = require('./dao/userDAO');
var facebookService = require('./service/facebookService');

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

	app.get('/api/v1/users', function(req, res) {
		userDAO.readUsers(0, 10, {
			"success": function(user) {
				res.send(user);
				res.end();
			},
			"error": function(err) {
				console.log(err);
				res.json(err);
				res.end();
			}
		});
	});

	app.post('/api/v1/users', function(req, res) {
		userController.addNewUser(req.body)
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

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};