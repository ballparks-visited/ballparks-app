app.controller('FooterController', function($scope, UserService, AuthService) {
	
	$scope.isLoggedIn = function() {
		return AuthService.isTokenValid();
	}
	
	// load the user
	function loadUser() {
		return UserService.getUserById(AuthService.getUserId())
		.then(function(response) {
			$scope.userBallparks = response.data.ballparks;
			$scope.user = response.data;
			calculateBallparkMatches();
		});
	};
	loadUser();

	// Delete User
	$scope.deleteUser = function() {
		var remove = confirm('Are You Sure?');
		if(remove) {
			UserService.deleteUser(AuthService.getUserId()).catch(console.log.bind(console));
			console.log('Delete User Triggered');
		}
	};

});