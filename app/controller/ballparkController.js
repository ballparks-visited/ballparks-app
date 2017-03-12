var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var ballparkDAO = require('../dao/ballparkDAO');

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

function getBallparks() {
	var deferred = new Deferred();

	ballparkDAO.readBallparks(0, 0)
	.then(function(ballparks) {
		deferred.resolve(ballparks);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}

function getBallparkById(ids) {
	var deferred = new Deferred();

	ballparkDAO.readBallparkById(ids)
	.then(function(ballparks) {
		deferred.resolve(ballparks);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}


module.exports.getBallparks = getBallparks;
module.exports.getBallparkById = getBallparkById;
