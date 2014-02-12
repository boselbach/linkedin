module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {										
			dist: {									
				files: [{
					'web/css/screen.css': 'src/sass/screen.scss',
				}]
			}
		},
		watch: {
			styles: {
				files: ['src/sass/**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
					interrupt: true,
				},
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['sass','watch']);
	grunt.registerTask('compile', ['sass']);
};