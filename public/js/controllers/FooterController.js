app.controller('FooterController', function($scope, $window, UserService, AuthService) {
	
	$scope.isLoggedIn = function() {
		return AuthService.isTokenValid();
	}

	// Delete User
	$scope.deleteUser = function() {
		var remove = confirm('Are You Sure? This action will permanently delete your data.');
		if(remove) {
			UserService.deleteUser(AuthService.getUserId())
			.then (function() {
				AuthService.clearToken();
				console.log('Delete User Triggered');
				$window.location.href = '/';
			},
			function(err) {
				console.error(err);
			});
		}
	};
	
	$scope.privacyLink = function() {
		$window.location.href = '/privacy-policy';
	}
	
	$scope.tos = function() {
		$window.location.href = '/terms-of-service';
	}

});