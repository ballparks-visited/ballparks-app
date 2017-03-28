app.factory("AuthService",function($q, UserService, jwtHelper) {
	var service = {};
	var token;

	/* ====================================================================================================== */
	/* ======================================= [ Public Functions ] ========================================= */
	/* ====================================================================================================== */

	service.authenticate = function() {
		var deferred = $q.defer();
		
		if(isTokenValid()) {
			deferred.resolve();
		}
		else {
			deferred.reject();
		}

		return deferred.promise;
	};

	service.setToken = function(token) {
		this.token = token;
		localStorage.setItem('stadium-jwt', token);
	};

	service.getToken = function() {
		if(typeof this.token === 'undefined') {
			this.token = localStorage.getItem('stadium-jwt');
		}
		return this.token;
	};

	service.getUserId = function() {
		return jwtHelper.decodeToken(service.getToken()).fb_id;
	};

	service.getUserToken = function() {
		return jwtHelper.decodeToken(service.getToken()).access_token;
	};
	
	service.isTokenValid = function() {
		var token = service.getToken();

		return typeof token !== 'undefined' && token !== null && token !== ''
				// && !jwtHelper.isTokenExpired()
		;
	};

	/* ====================================================================================================== */
	/* ======================================= [ Private Functions ] ======================================== */
	/* ====================================================================================================== */

	
	return service;
});