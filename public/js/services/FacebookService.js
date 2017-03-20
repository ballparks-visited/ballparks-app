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
	
	// load user friends and their photos
	service.getFriends = function() {
		var deferred = $q.defer();
		var userID = AuthService.getUserId();
		var userToken = AuthService.getUserToken();

		Facebook.api('/' + userID + '/friends', {access_token: userToken, fields: 'first_name, name, id'}, function(response) {
			if(!response || response.error) {
				console.log(response.error);
				deferred.reject('Error occured');
			}
			else {
				var promises = [];
				for (var i = 0; i < response.data.length; i++) {
					var fData = response.data[i];
					(function(data){
						var thisPromise = service.getUserPhoto(fData.id)
						.then(function(userPhoto) {
							data.photoURL = userPhoto.data.url;
						});
						promises.push(thisPromise);
					})(fData);
				}

				$q.all(promises)
				.then(function() {
					deferred.resolve(response);
				});
			}
		});

		return deferred.promise;
	};
	return service;
});