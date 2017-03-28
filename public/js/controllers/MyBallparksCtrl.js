app.controller('MyBallparksController', function($scope, $window, UserService, BallparkService, AuthService, FacebookService) {
	// Authenticate the user
	if(!AuthService.isTokenValid()) {
		// redirect to login
		$window.location.href = '/?invalid_token';
	}

	// Make moment library available in templates
	$scope.moment = moment;

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

	// load ballparks
	var ballparks;
	BallparkService.loadBallparks()
	.then(function(response) {
		ballparks = response.data;
		$scope.ballparks = response.data;
	});

	// load user friends
	FacebookService.getFriends()
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


	function calculateBallparkMatches() {
		if(typeof $scope.user !== 'undefined' && typeof $scope.friends !== 'undefined') {
			// map user ballparks to array of ids
			var userBallparkIds = $scope.userBallparks.map(function(el) {
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
	

	// $scope.showSearch = function() {
	// 	if(typeof ballparks !== 'undefined') {
	// 		$scope.searchMode = true;
	// 	}
	// }

	// output search results
	// $scope.searchMode = true;
	// $scope.showSearchResults = function(event, searchInput) {
	// 	if(searchInput.length > 1) {
	// 		$scope.searchMatches = ballparks.filter(function(el) {
	// 			return el.primary_name.toLowerCase().indexOf(searchInput) !== -1
	// 					|| el.home_team.toLowerCase().indexOf(searchInput) !== -1;
	// 			// TODO: exclude stadiums already visited
	// 		});
	// 	}
	// 	else {
	// 		$scope.searchMatches = null
	// 	}
	// }

	$scope.searchBallpark = function(searchKey) {
		for(var i = 0; i < ballparks.length; i++) {
			if(ballparks[i].primary_name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
				|| ( ballparks[i].home_team !== null && ballparks[i].home_team.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 )
			) {
				$scope.selectedBallpark = ballparks[i];
				$scope.searchName = "";
				break;
			}
		}
	}

	// add a ballpark
	$scope.addBallpark = function(ballparkId, dateVisited) {
		if(typeof dateVisited === 'undefined') {
			dateVisited = new Date();
		}

		UserService.addBallpark(AuthService.getUserId(), ballparkId, dateVisited)
		.then(function() {
			// reload the user after the ballpark is added
			return loadUser();
		})
		.then(function() {
			$scope.selectedBallpark = null;
		});

	};

});