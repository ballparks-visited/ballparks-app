app.factory("FacebookService",function($q, Facebook, AuthService) {
	var service = {};

	service.login = function() {
		var deferred = $q.defer();

		Facebook.login(function(response) {
			if(!response || response.error) {
				deferred.reject('Error occured');
			}
			else {
				deferred.resolve(response);
			}
		},
		{
			scope: 'publish_actions,user_friends,read_custom_friendlists', 
			return_scopes: true
		});

		return deferred.promise;
	};

	service.getLoginStatus = function() {
		var deferred = $q.defer();
		
		Facebook.getLoginStatus(function(response) {
			if(!response || response.error) {
				deferred.reject('Error occured');
			}
			else {
				deferred.resolve(response);
			}
		})

		return deferred.promise;
	}

	service.getUserData = function() {
		var deferred = $q.defer();
		Facebook.api('/me', {
			fields: 'first_name,last_name,email,gender,birthday'
		}, function(response) {
			if(!response || response.error) {
				deferred.reject('Error occured');
			}
			else {
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};

	service.getUserPhoto = function(userID) {
		var deferred = $q.defer();
		
		Facebook.api('/' + userID + '/picture', {
			"height": 250
			,"width": 250
		}, function(response) {
			if(!response || response.error) {
				deferred.reject('Error occured');
			}
			else {
				deferred.resolve(response);
			}
		});
		return deferred.promise;
	};
	
	service.getFriends = function() {
		var deferred = $q.defer();
		var userID = AuthService.getUserId();

		console.log(userID);

		Facebook.api('/' + userID + '/friends', function(response) {
			if(!response || response.error) {
				deferred.reject('Error occured');
			}
			else {
				deferred.resolve(response);
			}
		});

		return deferred.promise;
	};
	return service;
});