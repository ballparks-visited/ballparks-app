app.controller('HeaderController', function($rootScope, $scope, $location, $window, AuthService, FacebookService, UserService) {

	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};

	$scope.isLoggedIn = function() {
		return AuthService.isTokenValid();
	};

	$scope.logout = function() {
		AuthService.clearToken();
		$window.location.href = '/';
	};
	
	$scope.login = function () {
		var loc = $location.path();
		
		if (loc == '/') {
			FacebookService.login()
			.then(function(response) {
				loginResponse = response;
				return FacebookService.getUserData();
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
		} else { 
			$window.location.href = '/' 
		};
	};	

});