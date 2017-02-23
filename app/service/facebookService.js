var config = require('../../config/config');
var FB = require('fb');
var fb = new FB.Facebook({appId: config.appId, appSecret: config.appSecret});
var PromiseIO = require('promised-io/promise');
var Deferred = PromiseIO.Deferred;


/* ====================================================================================================== */
/* ======================================= [ Public Functions ] ========================================= */
/* ====================================================================================================== */

// Get long-lived-token from facebook
function getFBLongLivedToken(shortToken) {
	var deferred = new Deferred();

	var options = {
		client_id: fb.options('appId'),
		client_secret: fb.options('appSecret'),
		grant_type: 'fb_exchange_token',
		fb_exchange_token: shortToken
	};

	fb.api('oauth/access_token', options, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			deferred.reject(res.error);
		}
	 	
	 	deferred.resolve(res.access_token);
		// var accessToken = res.access_token;
		// var expires = res.expires ? res.expires : 0;
	});
	
	return deferred;
}

module.exports.getFBLongLivedToken = getFBLongLivedToken;