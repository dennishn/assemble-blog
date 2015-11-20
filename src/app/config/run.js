(function() {
	'use strict';

	function run() {
		console.info('Starting Application ', angular);
	}

	angular
		.module('assemble-blog')
		.run(run);
})();