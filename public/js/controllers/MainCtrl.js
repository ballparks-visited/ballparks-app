app.controller('MainController', function($scope, UserService, FacebookService, Facebook) {

	$scope.loginStatus = 'Waiting';
	
	$scope.login = function() {
		// From now on you can use the Facebook service just as Facebook api says
		Facebook.login(function(response) {
			var loginResponse = response;

			console.log(response);
			$scope.loginStatus = 'Logged In';

			FacebookService.getUserData() 
				.then(function(response) {
					console.log(response);
					$scope.last_name = response.last_name;
					return response;
				})
				.then(function(userResponse) {
					// save the user
					var userData = userResponse;
					angular.extend(userData, loginResponse.authResponse);

					UserService.saveUser(userData);
				})
			;
		},
		{
			scope: 'publish_actions', 
			return_scopes: true
		});
	};

	$scope.logout = function() {
		Facebook.logout(function(response) {
			$scope.loginStatus = "Logged Out";
		});
	};

});