var app = angular.module('ballparksApp', [
	'ngRoute',
	'facebook'
])
.config(function(FacebookProvider) {
	// Set your appId through the setAppId method or
	// use the shortcut in the initialize method directly.
	FacebookProvider.init('1272641912758292');
});