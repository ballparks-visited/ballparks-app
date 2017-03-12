app.controller('MyBallparksController', function($scope, $window, UserService, BallparkService, AuthService) {
	// Authenticate the user
	if(!AuthService.isTokenValid()) {
		// redirect to login
		$window.location.href = '/login?invalid_token';
	}

	// Make moment library available in templates
	$scope.moment = moment;

	// load the user
	function loadUser() {
		UserService.getUserById(AuthService.getUserId())
		.then(function(response) {
			// console.log(response);
			$scope.ballparks = response.data.ballparks;
			// $scope.$apply();
		});
	};
	loadUser();

	// load ballparks
	var ballparks;
	BallparkService.loadBallparks()
	.then(function(response) {
		ballparks = response.data;
	});

	$scope.showSearch = function() {
		if(typeof ballparks !== 'undefined') {
			$scope.searchMode = true;
		}
	}

	// output search results
	// $scope.searchMode = true;
	$scope.showSearchResults = function(event, searchInput) {
		if(searchInput.length > 1) {
			$scope.searchMatches = ballparks.filter(function(el) {
				return el.primary_name.toLowerCase().indexOf(searchInput) !== -1
						|| el.home_team.toLowerCase().indexOf(searchInput) !== -1;
				// TODO: exclude stadiums already visited
			});
		}
		else {
			$scope.searchMatches = null
		}
	}

	// add a stadium
	$scope.addBallpark = function(ballparkId) {
		console.log(ballparkId);
		// TODO: add date picker to view
		UserService.addBallpark(AuthService.getUserId(), ballparkId, '2017-01-20')
		.then(function() {
			// reload the user after the ballpark is added
			loadUser();
		});

	};

});