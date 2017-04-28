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

// Post Link to Facebook
function postLink(userId, userToken, message, link) {
	var deferred = new Deferred();

	fb.setAccessToken(userToken);
	fb.api('/' + userId + '/feed', 'post', { "link": link, "message": message }, function (res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			deferred.reject(res.error);
		}
		else {
			deferred.resolve(res.id);
		}
	});
	
	return deferred;
}

// Delete User
function deleteFBuser(userId, userToken) {
//	var deferred = new Deferred();
	
	fb.setAccessToken(userToken);
	fb.api('/' + fbID +'/permissions', 'delete', function(response) {
		console.log(response); // true
		deferred.resolve();
	});
	
//	return deferred;
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
module.exports.postLink = postLink;
module.exports.testFBpost = testFBpost;
module.exports.deleteFBuser = deleteFBuser;
