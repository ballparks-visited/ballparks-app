app.controller('MainController', function($scope, $window, UserService, FacebookService, AuthService, Facebook) {

	$scope.login = function() {
		FacebookService.login()
		.then(function(response) {
			loginResponse = response;
			return FacebookService.getUserData();
		})
		.then(function(response) {
			console.log(response);
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
			$window.location.href = '/my-ballparks'
		});
	};

	$scope.logout = function() {
		Facebook.logout(function(response) {
		});
	};

});