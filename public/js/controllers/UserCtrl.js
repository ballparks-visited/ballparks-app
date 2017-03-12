app.controller('UserController', function($scope, $http, UserService) {

	$scope.loadUserMessage = 'Waiting';

	$scope.loadUsers = function() {
		$scope.loadUserMessage = 'Loading...';
		UserService.loadUsers()
		.then(function(response){
			$scope.users = response.data;
			console.log(response);
		});
	};

});