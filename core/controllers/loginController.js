 /* Login Controller  */
function loginController($scope, $http, $location, localStorageService){

	localStorageService.set('userName', '')
	localStorageService.set('password', '')

	$scope.userName = ''
	$scope.password = ''

    /* To store login information into local storage for user and submit login form */
	$scope.submitLoginForm = function () {
		if($scope.userName !== "" && $scope.password !== "") {
			localStorageService.set('userName', $scope.userName)
			localStorageService.set('password', $scope.password)
			$location.path('/dashboard')
		}
	}

 	/* Login submit with enter Key */
	$scope.handleEnter = function (e) {
    if(event.keyCode === 13) {
			$scope.submitLoginForm()
		}
	}

	$scope.test = function() {
		return "Test is ready";
	}
}
