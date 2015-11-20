'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({

		config: {
			src: 'src',
			dist: 'dist',
			tmp: '.tmp'
		},

		/*
			Watch + Livereload + "dev" Server
		*/
		watch: {
			assemble: {
				files: [
					'src/site/templates/**/*.hbs',
					'src/content/blog/**/*.md',
					'src/content/pages/**/*.hbs',
					'src/data/**/*'
				],
				tasks: ['assemble']
			},
			sass: {
				files: [
					'src/**/*.scss'
				],
				tasks: ['sass', 'autoprefixer']
			}
		},

		browserSync: {
			dev: {
				bsFiles: {
					src: [
						'src/*.html',
						'src/app/**/*.html',
						'./dist/{,*/}*.html'
					]
				},
				options: {
					watchTask: true,
					server: {
						baseDir: ['src'],
						routes: {
							'/bower_components': './bower_components',
							'/content': './dist/content'
						}
					}
				}
			},
			dist: {
				bsFiles: {
					src : [
						'./dist/assets/css/{,*/}*.css',
						'./dist/assets/{,*/}*',
						'./dist/{,*/}*.html'
					]
				},
				options: {
					watchTask: true,
					server: {
						port: 3000,
						baseDir: ['./src']
					}
				}
			}
		},

		/*
			Sass + CSS
		*/
		sass: {
			options: {
				loadPath: [
					'bower_components'
				]
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/site/assets/scss',
					src: ['*.scss'],
					dest: '<%= config.tmp %>/assets/css',
					ext: '.css'
				}]
			},
			build: {
				options:{
					style: 'compressed'
				},
				files: [{
					expand: true,
					cwd: '<%= config.src %>/site/assets/scss',
					src: ['*.scss'],
					dest: '<%= config.dist %>/assets/css',
					ext: '.css'
				}]
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			server:{

			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.tmp %>/styles/',
					src: '{,*/}*.css',
					dest: '<%= config.dist %>/styles/'
				}]
			}
		},

		/*
			Assemble
		*/
		assemble: {
			options: {
				plugins: ['grunt-assemble-blog-config.js'],
				helpers: 'src/site/helpers/**/*.js',
				layout: 'ajax.hbs',
				layoutdir: './src/site/templates/layouts/',
				partials: './src/site/templates/partials/**/*',
				blogConfig: {
					dest: './dist/content/'
				}
			},
			posts: {
				files: [{
					cwd: 'src/content',
					dest: 'dist/content',
					expand: true,
					flatten: false,
					src: ['blog/**/*.md']
				}]
			},
			pages: {
				files: [{
					cwd: 'src/content',
					dest: 'dist/content',
					expand: true,
					flatten: false,
					src: ['pages/**/*.hbs']
				}]
			}
		},

		/*
			Bower Wiring
		*/
		wiredep: {
			options: {
				cwd: '',
				exclude: []
			},

			app: {
				src: [
					'src/index.html'
				],
				ignorePath: /\.\.\//
			}
		},

		imagemin: {
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/site/assets/img/',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.tmp %>/assets/img/'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/site/assets/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.dist %>/assets/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/site/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/assets/images'
				}]
			}
		},

		modernizr: {
			dist: {
				devFile: 'bower_components/modernizr/modernizr.js',
				outputFile: '<%= config.dist %>/assets/js/vendor/modernizr.js',
				files: {
					src: [
						'<%= config.dist %>/assets/js/{,*/}*.js',
						'<%= config.dist %>/assets/css/{,*/}*.css',
						'!<%= config.dist %>/assets/js/vendor/*'
					]
				},
				uglify: true
			}
		},

		copy: {
			server: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.src %>',
					dest: '<%= config.tmp %>',
					src: [
						'*.{ico,png,jpg,txt}',
						'.htaccess',
						'site/assets/fonts/{,*/}*.*',
						'site/assets/js/{,*/}*.js']
				}]
			},
            serverjs: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.src %>',
                    dest: '<%= config.tmp %>',
                    src: [
                        'site/assets/js/{,*/}*.js']
                }]
            },
			build: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.src %>',
					dest: '<%= config.dist %>',
					src: [
						'*.{ico,png,jpg,txt}',
						'.htaccess',
						'site/assets/fonts/{,*/}*.*']
				}]
			}
		},

		clean: ['<%= config.dist %>','<%= config.tmp %>'],

		concurrent: {
			server: [
				'sass:server',
                'sass:server',
                'imagemin:server',
                'copy:server'
			],
			dist: [
				'sass:build',
                'autoprefixer',
                'imagemin',
				'svgmin',
                'concat',
                'uglify'
			]
		}
	});

	grunt.loadNpmTasks('assemble');

	grunt.registerTask('serve', [
		'clean',
		'assemble',
		'wiredep',
		//'sass-convert',
		'browserSync:dev',
		'watch'
	]);

	grunt.registerTask('build', [
		//'clean',
		//'assemble',
		//'copy:build',
		//'useminPrepare',
		//'concurrent:dist',
		//'modernizr',
		//'usemin',
		//'htmlmin'
	]);

	grunt.registerTask('default', [
		'build'
	]);

};
