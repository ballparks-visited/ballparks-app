var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var userDAO = require('../dao/userDAO');
var facebookService = require('../service/facebookService');

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

function addNewUser(user) {
	var deferred = new Deferred();

	facebookService.getFBLongLivedToken(user.access_token)
	.then(function(longToken) {
		user.access_token = longToken;
		return userDAO.upsertUserByFBId(user);
	})
	.then(function(result) {
			deferred.resolve(result);
		},
		function(err) {
			deferred.reject(err);
		}
	);

	return deferred;
}

function getUsers() {
	var deferred = new Deferred();

	userDAO.readUsers(0, 10)
	.then(function(users) {
		deferred.resolve(users);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}

module.exports.addNewUser = addNewUser;
module.exports.getUsers = getUsers;
