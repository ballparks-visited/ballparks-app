var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;

var stadiumDAO = require('../dao/stadiumDAO');

/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

function getStadiums() {
	var deferred = new Deferred();

	stadiumDAO.readStadiums(0, 10)
	.then(function(stadiums) {
		deferred.resolve(stadiums);
	},
	function(err) {
		deferred.reject(err);
	});

	return deferred;
}

module.exports.getStadiums = getStadiums;
