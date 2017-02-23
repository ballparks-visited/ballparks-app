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
		userDAO.upsertUserByFBId(user,
		{
			"success": function(result) {
				deferred.resolve(result);
			},
			"error": function(err) {
				deferred.reject(err);
			}
		});
	});

	return deferred;
}

module.exports.addNewUser = addNewUser;
