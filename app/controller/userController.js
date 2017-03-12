var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var userDAO = require('../dao/userDAO');
var facebookService = require('../service/facebookService');
var ballparkDAO = require('../dao/ballparkDAO');

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

function getUserById(userId) {
	var deferred = new Deferred();
	
	userDAO.readUserById(userId)
	.then(function(user) {
		deferred.resolve(user);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}

function addUserBallpark(userId, params) {
	var deferred = new Deferred();
	
	userDAO.addUserBallpark(userId, params.ballparkId, params.dateVisited)
	.then(function(user) {
		deferred.resolve(user);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}

function testFBpost() {

	return facebookService.testFBpost();

}

module.exports.addNewUser = addNewUser;
module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.addUserBallpark = addUserBallpark;
module.exports.testFBpost = testFBpost;
