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
		});

	$locationProvider.html5Mode(true);

}]);