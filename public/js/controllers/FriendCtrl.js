app.controller('FriendController', function($scope, FacebookService) {

	$scope.loginStatus = 'Waiting';
	


	$scope.test = function() {
		FacebookService.getFriends().then(function(friendresult){
			$scope.friendresult=friendresult;
		});
	};

});