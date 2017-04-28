app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		// users
		.when('/users', {
			templateUrl: 'views/user.html',
			controller: 'UserController'
		})
		.when('/friends', {
			templateUrl: 'views/friends.html',
			controller: 'FriendController'
		})
		.when('/my-ballparks', {
			templateUrl: 'views/my-ballparks.html',
			controller: 'MyBallparksController'
		})
		.when('/user/:userId', {
			templateUrl: 'views/user-ballparks.html',
			controller: 'UserBallparksController'
		})
		
		.when('/privacy-policy', {
			templateUrl: 'views/privacy-policy.html',
			controller: 'FooterController'
		})
		
		.when('/terms-of-service', {
			templateUrl: 'views/terms-of-service.html',
			controller: 'FooterController'
		})
		;

	$locationProvider.html5Mode(true);

}]);