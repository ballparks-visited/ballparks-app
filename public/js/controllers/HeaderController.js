app.controller('HeaderController', function($scope, $location, $window, AuthService) {

	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};

	$scope.isLoggedIn = function() {
		return AuthService.isTokenValid();
	}

	$scope.logout = function() {
		AuthService.clearToken();
		$window.location.href = '/';
	}

});