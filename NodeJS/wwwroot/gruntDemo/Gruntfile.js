// 包装函数
module.exports = function(grunt) {
    // 任务配置,所有插件的配置信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		cssmin: {
		  options: {
			shorthandCompacting: false,
			roundingPrecision: -1
		  },
		  target: {
			files: {
			  'css/output.css': ['css/index.css', 'css/default.css']
			}
		  }
		},
        stylus:{
            build: {
                options: {
                    linenos: false,
                    compress: false
                },
                files: [{
                    'css/index.css': ['src/index.styl'],
					'css/default.css':['src/default.styl']
                }]
            }
        },
        // watch插件的配置信息
        watch: {
            another: {
                files: ['css/*','src/*.styl'],
                tasks: ['stylus'],
                options: {
                    livereload: 1337
                }
            }
        }
    });

    // 告诉grunt我们将使用插件
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 告诉grunt当我们在终端中输入grunt时需要做些什么
    grunt.registerTask('default', ['stylus','watch']);
	grunt.registerTask('cssmin_', ['cssmin']);
};