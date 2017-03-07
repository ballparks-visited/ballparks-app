app.factory("AuthService",function($q, FacebookService, UserService) {
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
	
	/* ====================================================================================================== */
	/* ======================================= [ Private Functions ] ======================================== */
	/* ====================================================================================================== */

	function isTokenValid() {
		return true; /*TODO: add logic here*/
	}
	
	return service;
});