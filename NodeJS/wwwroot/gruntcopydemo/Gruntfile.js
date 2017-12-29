module.exports = function(grunt) {
    "use strict";
  grunt.initConfig({
	copy:{
		main: {
			files: [
			  {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'}	 
			],
		  },
	},
	htmlmin:{
		dist: {
		  options: {
			removeComments: true,//���HTMLע��
			collapseWhitespace: true,//ѹ��HTML
			collapseBooleanAttributes: true,//ʡ�Բ������Ե�ֵ <input checked="true"/> ==> <input />
			removeEmptyAttributes: true,//ɾ�����пո�������ֵ <input id="" /> ==> <input />
			removeScriptTypeAttributes: true,//ɾ��<script>��type="text/javascript"
			removeStyleLinkTypeAttributes: true,//ɾ��<style>��<link>��type="text/css"
			minifyJS: true,//ѹ��ҳ��JS
			minifyCSS: true//ѹ��ҳ��CSS
		  },
		  files: {                                   // Dictionary of files 
			'dist/index.html': 'src/index.html'
		  }
		}
	},
	uglify:{
		options: {
		  mangle: false
		},
		my_target: {
		  files: {
			'dest/output.min.js': ['src/input.js']
		  }
		}
	}


  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('copyTask', ['copy']);
  grunt.registerTask('htmlminTask',['htmlmin']);
  grunt.registerTask('uglifyTask',['uglify']);
};