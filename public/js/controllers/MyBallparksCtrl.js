app.controller('MyBallparksController', function($scope, $window, UserService, BallparkService, AuthService, FacebookService, NgMap) {
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

    //ng-map Marker clusterer
    NgMap.getMap().then(function (map) {
        $scope.map = map;
        $scope.initMarkerClusterer();
    });

    $scope.initMarkerClusterer = function () {
	// Try changing the below scope
	var markers = $scope.ballparks.map(function (userballpark) {
            return $scope.createMarker(userballpark);
        });
        var mcOptions = { imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m' };
        return new MarkerClusterer($scope.map, markers, mcOptions);
    };

    $scope.createMarker = function (usrbp) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(usrbp.latitude, usrbp.longitude),
            title: usrbp.primary_name
        });
        google.maps.event.addListener(marker, 'click', function () {
            $scope.userBallparkMarker = usrbp;
            $scope.map.showInfoWindow('myInfoWindow', this);
        });
        return marker;
    }
    // loadUser();
    
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

	// remove a ballpark
	$scope.removeBallpark = function(ballparkId) {
		var remove = confirm('Are You Sure?');

		if(remove) {
			UserService.removeBallpark(AuthService.getUserId(), ballparkId)
			.then(function() {
			// reload the user after the ballpark is removed
			return loadUser();
		})
		}
	};

});
