app.controller('UserBallparksController', function($scope, $window, $routeParams, UserService, BallparkService, AuthService, FacebookService) {

	// Make moment library available in templates
	$scope.moment = moment;

	// load the user
	function loadUser() {
		return UserService.getUserById($routeParams.userId)
		.then(function(response) {
			$scope.userBallparks = response.data.ballparks;
			$scope.user = response.data;
		});
	};
	loadUser();

	// load ballparks
	var ballparks;
	BallparkService.loadBallparks()
	.then(function(response) {
		ballparks = response.data;
		$scope.ballparks = response.data;
	});

	// load logged in user's friends and ballparks
	$scope.mainColumnClass = 'col-sm-12';
	$scope.showFriends = false;
	if(AuthService.isTokenValid()) {
		$scope.mainColumnClass = 'col-sm-12 col-md-9';
		$scope.showFriends = true;

		var loggedInUserBallparks;
		UserService.getUserById(AuthService.getUserId())
		.then(function(response) {
			loggedInUserBallparks = response.data.ballparks;
		})
		.then(function() {
			// load user friends
			return FacebookService.getFriends();
		})
		.then(function(response) {

			$scope.friends = response.data;

			return response.data.map(function(el) {
				return el.id
			}).join(',');
		})
		.then(function(friendIds) {
			return UserService.getFriendData(friendIds);
		})
		.then(function(friendBallparkData) {
			// update friend data with ballparks
			for (var i = 0; i < friendBallparkData.data.length; i++) {
				var ballparkData = friendBallparkData.data[i];
				for (var j = 0; j < $scope.friends.length; j++) {
					if($scope.friends[j].id === ballparkData.fb_id) {
						$scope.friends[j].numBallparks = ballparkData.ballparks.length;
						$scope.friends[j].ballparks = ballparkData.ballparks.map(function(el) { return el.data });
						break;
					}
				}
			}
			calculateBallparkMatches();
		});

	}

	function calculateBallparkMatches() {
		if(typeof $scope.user !== 'undefined' && typeof $scope.friends !== 'undefined') {
			// map user ballparks to array of ids
			var userBallparkIds = loggedInUserBallparks.map(function(el) {
				return el.data._id
			})

			// calculate ballpark matches for user and friends
			for (var i = 0; i < $scope.friends.length; i++) {
				var matches = 0;
				if(typeof $scope.friends[i].ballparks !== 'undefined') {
					for (var j = 0; j < $scope.friends[i].ballparks.length; j++) {
						var ballparkId = $scope.friends[i].ballparks[j];
						if(userBallparkIds.indexOf(ballparkId) !== -1) {
							// we found a match
							matches++;
						}
					}
					
				}
				$scope.friends[i].matches = matches;
			}
		}
	}

});