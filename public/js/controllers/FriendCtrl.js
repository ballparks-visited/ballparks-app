app.controller('FriendController', function($scope, FacebookService) {

	$scope.loginStatus = 'Waiting';
	


	$scope.test = function() {
		FacebookService.getFriends()
		.then(function(friendresult) {
			$scope.friendresult=friendresult;
			return FacebookService.getUserPhoto(friendresult.data[0].id);
		})
		.then(function(photoResult) {
			$scope.friendImage = photoResult.data.url;
			console.log(photoResult);
		});
	};

});