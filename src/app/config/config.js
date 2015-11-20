(function () {
	'use strict';

	var core = angular.module('config', []);

	/* @ngInject */
	function configure($stateProvider, $urlRouterProvider, $locationProvider) {

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/404');

		$stateProvider
			.state('application.notfound', {
				url: '/404',
				views: {
					'application@': {
						templateUrl: '404.html'
					}
				}
			})
			.state('error', {
				url: '/503',
				views: {
					'application@': {
						templateUrl: '503.html'
					}
				}
			});
	}

	core.config(configure);

})();