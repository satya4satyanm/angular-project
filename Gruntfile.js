module.exports = function (grunt) {

	grunt.initConfig({
		sass: {
			dist: {
				files: {
					"dist/css/app.css": ["resources/css/dashboard.css", "resources/css/left-sidebar-fixed.css", "resources/css/login.css", "resources/css/style.css"]
				}
			}
		},
		watch: {
			css: {
				files: ["resources/css/dashboard.css", "resources/css/left-sidebar-fixed.css", "resources/css/login.css", "resources/css/style.css"],
		    tasks: ['sass']
      },
      js: {
				files: ["core/controllers/loginController.js", "core/controllers/dashboardController.js", "core/controllers/visualCrawlerController.js", "core/controllers/crawlerMangementController.js", "core/controllers/navigationController.js", "core/controllers/scheduleController.js", "core/factories/apiService.js", "core/factories/jsonService.js", "app.js","resources/js/index.js"],
		    tasks: ['concat']
      }
		},
		concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ["core/controllers/loginController.js", "core/controllers/dashboardController.js", "core/controllers/visualCrawlerController.js", "core/controllers/crawlerMangementController.js", "core/controllers/navigationController.js", "core/controllers/scheduleController.js", "core/factories/apiService.js", "core/factories/jsonService.js", "app.js","resources/js/index.js"],
        dest: 'dist/js/app.js'
      }
    }
	})

	grunt.loadNpmTasks('grunt-bootstrap');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('generateSassToCss', ['sass']);
	grunt.registerTask('default', ['watch']);
}
