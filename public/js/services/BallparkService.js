app.factory('BallparkService', ['$http', function($http) {
	var service = {}

	service.loadBallparks = function () {
		return $http.get("/api/v1/ballparks");
	};

	return service;
}]);