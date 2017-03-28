var app = angular.module('ballparksApp', [
	'ngRoute'
	,'facebook'
	,'ngMap'
	,'angular-jwt'
])
.config(function(FacebookProvider) {
	// Set your appId through the setAppId method or
	// use the shortcut in the initialize method directly.
	FacebookProvider.init('1272641912758292');
})
.config(function Config($httpProvider, jwtOptionsProvider) {
    // Please note we're annotating the function so that the $injector works when the file is minified
    jwtOptionsProvider.config({
      tokenGetter: ['AuthService', function(AuthService) {
        return AuthService.getToken();
      }]
      ,authPrefix: 'JWT '
    });

    $httpProvider.interceptors.push('jwtInterceptor');
  })
.directive('ngFocus', function($timeout) {
	return {
		scope : {
			trigger : '@ngFocus'
		},
		link : function(scope, element) {
			scope.$watch('trigger', function(value) {
				if (value === "true") {
					$timeout(function() {
						element[0].focus();
					});
				}
			});
		}
	};
});