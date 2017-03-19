app.factory('UserService', ['$http', function($http) {
	var service = {}

	service.loadUsers = function () {
		return $http.get("/api/v1/users");
	};

	service.saveUser = function(params) {
		return $http.post("/api/v1/users", {
			"first_name": params.first_name,
			"last_name": params.last_name,
			"fb_id": params.id,
			"access_token": params.accessToken,
			"token_expire": params.expiresIn,
			"permissions": params.grantedScopes,
			"signed_request": params.signedRequest
		});
	};

	service.getUserById = function(id) {
		return $http.get("/api/v1/users/"+id);
	};

	service.addBallpark = function(id, ballparkId, date) {
		return $http.post("/api/v1/users/"+id+"/ballparks", {
			"ballparkId": ballparkId,
			"dateVisited": date
		});
	};

	return service;
}]);