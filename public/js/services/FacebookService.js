app.factory("FacebookService",function($q, Facebook) {
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
			scope: 'publish_actions', 
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
	
	service.getFriends = function() {
		var deferred = $q.defer();
		
		deferred.resolve("hello world");

		return deferred.promise;
	};
	return service;
});