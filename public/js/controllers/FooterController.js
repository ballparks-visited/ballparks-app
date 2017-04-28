app.controller('FooterController', function($scope, $window, UserService, AuthService) {
	
	$scope.isLoggedIn = function() {
		return AuthService.isTokenValid();
	}

	// Delete User
	$scope.deleteUser = function() {
		var remove = confirm('Are You Sure?');
		if(remove) {
			UserService.deleteUser(AuthService.getUserId()).catch(console.log.bind(console));
			console.log('Delete User Triggered');
			AuthService.clearToken();
			$window.location.href = '/';
		}
	};

});