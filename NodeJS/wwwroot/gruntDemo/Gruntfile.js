// ��װ����
module.exports = function(grunt) {
    // ��������,���в����������Ϣ
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
        // watch�����������Ϣ
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

    // ����grunt���ǽ�ʹ�ò��
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

    // ����grunt���������ն�������gruntʱ��Ҫ��Щʲô
    grunt.registerTask('default', ['stylus','watch']);
	grunt.registerTask('cssmin_', ['cssmin']);
};