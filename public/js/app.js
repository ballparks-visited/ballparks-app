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