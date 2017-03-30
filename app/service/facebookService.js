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

// test FB post
function testFBpost() {

	var token = fb.getAccessToken();
	var deferred = new Deferred();
	//var token = "EAASFdgki4BQBAEV3VmCaHrMzYoNJ7OlJf8s20hZCeHaxlggsMAQ2VCVMCwFHsPIXmsVWZCUsZBJrAW1lVL2rw2dWfz2dCXBjUXlbn9Vr6Gj5zR8NaFFDgqyjNz3H9MdQbeqQtGMFeFZAWSK3xnhR35TBnnjoNf8ZD";
	var fbID = "151169545402855";
	fb.setAccessToken(token);
	// insert code here
	fb.api(fbID + '/feed', 'post', { message: 'Test post' }, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			deferred.reject(res.error);
		}
		
		console.log(res);	
		deferred.resolve(res.id); /*remove this line*/
	});
	return deferred.promise;
}

module.exports.getFBLongLivedToken = getFBLongLivedToken;
module.exports.testFBpost = testFBpost;
