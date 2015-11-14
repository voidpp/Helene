var fs = require('fs');
var path = require('path');
var envify = require('envify/custom');

module.exports = function(grunt) {

    var base_dir = 'helene/';
    var dir = {
        static: base_dir + 'static/',
        assets: base_dir + 'assets/',
    };
    dir.css_layouts = dir.assets + 'scss/layouts/';
    dir.js_layouts = dir.assets + 'js/layouts/';

    var scss_files = [];
    var js_files = [];

    fs.readdirSync(dir.js_layouts).forEach(function(file){
        js_files.push({
            src: [dir.js_layouts + file],
            dest: dir.static + 'js/' + file,
        });
    });

    fs.readdirSync(dir.css_layouts).forEach(function(file){
        scss_files.push({
            src: [dir.css_layouts + file],
            dest: dir.static + 'css/' + path.basename(file, '.scss') + '.css',
        });
    });

    function config(debug) {
        return {
            debug: debug,
        };
    }

    function log1(err, stdout, stderr, cb) {
        console.log(stdout);
        cb();
    }

	grunt.initConfig({
		browserify: {
			dev: {
				options: {
					watch: true,
					keepAlive: true,
					browserifyOptions: {
						debug: true
					},
                    transform: [
                        ["babelify"],
                        [envify(config(true))],
                    ]
				},
				files: js_files
			},
			dist: {
                options: {
                    transform: [
                        ["babelify"],
                        [envify(config(false))],
                    ]
                },
				files: js_files
			}
		},

        sass: {
            dist: {
                files: scss_files,
            }
        },

        watch: {
            stylesheets: {
                files: [
                    dir.assets + 'scss/**',
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            },
        },

        shell: {
            options: {
            },
            webserver: {
                command: 'python run_dev_server.py',
                options: {
                    callback: log1
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true,
            },
            dev: {
                tasks: ['browserify:dev', 'watch:stylesheets', 'shell:webserver'],
            },
        },

	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', ['browserify:dist', 'sass:dist']);
    grunt.registerTask('dev', ['concurrent:dev'])
};
