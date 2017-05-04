/* Dashboard Controller  */
function dashboardController($scope,$rootScope, $location, $window,$http,localStorageService,domainUrl,roviVCApiService){

 /* Directly get a value from local storage */
 $scope.localUserNameValue= localStorageService.get('userName');
 $scope.localpasswordValue= localStorageService.get('password');
 $scope.localLoginFlagValue= localStorageService.get('loginFlag');
 $rootScope.localUserNameValue=$scope.localUserNameValue;
 /* Clear all local storage */
 $scope.clearAll=function(){
			$window.localStorage.clear();
}

 $scope.schedule = [];
 $scope.running = [];
 $scope.success = [];
 $scope.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
 /* To get Scheduled data */
 $scope.getSchedule= function(){
	roviVCApiService.getVCSchedule($scope)
	 .success(function(value) {
		 $scope.schedule=value.Scheduled;
		 $scope.running=value.Running;
		 $scope.success=value.Success;
	 });
 }


 $scope.getSchedule();
 /*  Run scheduling on demand  */
 $scope.runScheduleOnDemand =function(schedule){
	 $scope.schedulerData = schedule;
	 if(!$scope.schedulerData.onDemand){
		 $scope.schedulerData["onDemand"] = "true";
	 }else{
		 $scope.schedulerData.onDemand = "true";
	 }
	 $('#confirmOnDemand').modal('show');
	 }

 /* To show on demand confirmation message */
 $scope.confirmOnDemand = function(){
	 roviVCApiService.insertSchedule($scope)
		 .success(function() {
			 $scope.dashboradSuccessTitle ="Schedule On-Demand";
			 $scope.dashboradSuccessMsg ="Your schedule has been prioritized!!";
			 $('#successdashboard').modal('show');
	 });
 }
}
