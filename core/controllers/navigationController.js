/* Navigation controller */
function navigationController ($scope, $window, $http, $location, $interval, localStorageService) {
$scope.localUserNameValue = localStorageService.get('userName')
$interval(function () {
        $scope.localUserNameValue = localStorageService.get('userName')
		    if($scope.localUserNameValue === "" || $scope.localUserNameValue === null || $scope.localUserNameValue === undefined) {
			       $location.path('/login')
		         }
    }, 100)

	/* Checking spider chrome extension plugin in chrome for installation  */
	$scope.$on('$routeChangeSuccess', function () {
		var intExtn = $interval(function () {
		var noExtnDisplay = angular.element("#noExtn").css("display")
			if(noExtnDisplay  === "block" && $window.location.hash != "#/login"){
				$('#warningNoExtn').modal('show')
			}
			$interval.cancel(intExtn)
		}, 1000)
    })

	/* Function for logout  */
	$scope.logOut = function () {
	   $location.path('/logout')
	   $window.localStorage.clear()
	   $scope.localUserNameValue = ""
	}

	$scope.iframe = null
	$window.addEventListener('message', function (e) {
		if(e.data[0] === 'loadTarget'){
			window.location.href = e.data[1]  // check if it has http/https
		}
		if(e.data[0] === 'getUserName'){
			$scope.iframe = angular.element('#vcForm').find("iframe")[0]
			if(!$scope.iframe) {
				$scope.iframe = angular.element('#vcForm')[0]
			}
			$scope.iframe.contentWindow.postMessage(['gotUserName', $scope.localUserNameValue], '*')
		}

	})

/* For left navigation selection active */
$scope.$on('$routeChangeStart', function () {
	if($window.location.hash === "#/dashboard"){
		$scope.navDashboard = "active"
	}else{
		$scope.navDashboard = ""
	}
	if($window.location.hash === "#/crawlerManger"){
		$scope.navCrawlerMange = "active"
	}else{
		$scope.navCrawlerMange = ""
	}
})
}
