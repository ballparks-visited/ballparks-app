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

	service.clearToken = function() {
		localStorage.setItem('stadium-jwt', '');
		this.token = '';
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
		var tokenData;
		var token = service.getToken();
		var isBlank = typeof token === 'undefined' || token === null || token === '';
		if(isBlank) {
			return false;
		}

		try {
			tokenData = jwtHelper.decodeToken(service.getToken());;
		}
		catch(e) {
			return false;
		}

		return !jwtHelper.isTokenExpired(token)
		
	};

	/* ====================================================================================================== */
	/* ======================================= [ Private Functions ] ======================================== */
	/* ====================================================================================================== */

	
	return service;
});