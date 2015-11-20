/*
	Assemble plugin to add each "assemble-page" to a shared config json file.
	Used in nodes-flat-blog in the Angular application.

	author: DHNI
 */

var blogConfigTpl = require('./blog-config-template.json');

module.exports = function(params, callback) {

	'use strict';

	var options    = params.context;
	var grunt      = params.grunt;

	var blogConfig = options.blogConfig || {};
	var pages      = options.pages;
	var page       = options.page;

	var async      = grunt.util.async;

	blogConfig.dest = blogConfig.dest || page.filePair.orig.dest + '/tmp';

	var blogConfigJson = blogConfigTpl;

	async.forEachSeries(pages, function(file, next) {

		if (page.src !== file.src) {
			next();
			return;
		}

		var type;

		if(file.dest.match(/blog/)) {
			type = 'blog';
		} else if(file.dest.match('/pages/')) {
			type = 'pages';
		}

		if(type === undefined) {
			next();
			return;
		}

		var item = {
			title: file.data.title,
			posted: file.data.posted,
			path: file.dest.replace('dist/', '')
		};

		blogConfigJson[type].push(item);

		grunt.file.write(blogConfig.dest + 'site-config.json', JSON.stringify(blogConfigJson, null, 4));

		next();

	}, function (err) {
		callback();
	});
};