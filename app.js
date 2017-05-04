var app = angular.module('roviVCapp', ['ngRoute', 'LocalStorageModule', 'datatables', 'roviVCAppServiceModule']);

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('demoPrefix');
    }]);

app.config(function($routeProvider) {
	$routeProvider
	  .when('/login', {
		templateUrl: 'views/login.html',
		controller: 'loginController'
	  })
	  .when('/visualCrawler', {
		templateUrl: 'views/visualCrawler.html',
		controller: 'visualCrawlerController'
	  })
	  .when('/dashboard', {
		templateUrl: 'views/dashboard.html',
		controller: 'dashboardController'
	  })
	  .when('/crawlerManger', {
		templateUrl: 'views/crawlerMangement.html',
		controller: 'crawlerMangementController'
	  })
	   .when('/schedule', {
         templateUrl: 'views/scheduling.html',
         controller: 'scheduleController'
       })

	  .otherwise({
		redirectTo: '/login'
	  });
});

app.value('domainUrl', 'http://172.26.119.66:8000');

app.controller('loginController', ['$scope', '$http', '$location', 'localStorageService', loginController]);

app.controller('dashboardController', ['$scope', '$rootScope', '$location', '$window', '$http', 'localStorageService', 'domainUrl', 'roviVCApiService', dashboardController]);

app.controller('visualCrawlerController', ['$scope', '$window', '$rootScope', 'localStorageService', '$location', visualCrawlerController]);

app.controller('crawlerMangementController', ['$scope', '$rootScope', '$http', '$compile', '$location', 'localStorageService', 'domainUrl','roviVCApiService', crawlerMangementController]);

app.controller('navigationController', ['$scope', '$window', '$http', '$location', '$interval', 'localStorageService', navigationController]);

app.controller('scheduleController', ['$scope', '$rootScope', '$http', '$location', 'localStorageService', '$timeout', 'domainUrl', scheduleController]);

app.factory('jsonService', jsonService);
