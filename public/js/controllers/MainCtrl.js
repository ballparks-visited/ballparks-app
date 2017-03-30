app.controller('MainController', function($scope, $window, UserService, FacebookService, AuthService, Facebook) {

	// redirect to my-ballparks if logged in
	if(AuthService.isTokenValid()) {
		$window.location.href = '/my-ballparks';
	}

	$scope.login = function() {
		FacebookService.login()
		.then(function(response) {
			loginResponse = response;
			return FacebookService.getUserData();
		})
		.then(function(response) {
			$scope.last_name = response.last_name;
			return response;
		})
		.then(function(userResponse) {
			// save the user
			var userData = userResponse;
			angular.extend(userData, loginResponse.authResponse);

			return UserService.saveUser(userData);
		})
		.then(function(jwt) {
			AuthService.setToken(jwt.data);

			// redirect to main page
			$window.location.href = '/my-ballparks';
		});
	};

});