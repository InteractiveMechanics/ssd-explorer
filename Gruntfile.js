module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        sass: {
            dist: {
                files: {
                    'css/main.css': 'css/sass/main.scss'
                }
            }
        },
        watch: {
            css: {
                files: ['**/*.scss'], 
                tasks: ['sass'] 
            }
		},
        connect: {
            server: {
                options: {
                    port: 4000,
                    debug: true
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['watch']);
};