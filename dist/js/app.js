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
;/* Dashboard Controller  */
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
;/* Visual Crawler controller */
function visualCrawlerController ($scope, $window) {
		$window.parent.postMessage(['selectAssetID'], '*')
}
;/* crawler management Controller  */
function crawlerMangementController($scope, $rootScope, $http, $compile, $location, localStorageService,domainUrl,roviVCApiService) {
   $scope.vm = {};
   $scope.vm.dtInstance = {};

   $('#crawlerTable').removeClass('display').addClass('table table-striped table-bordered');
   $scope.userName = localStorageService.get('userName');
   $scope.assetType = [];
   /* To get user crawler defintion data*/
   roviVCApiService.viewCd($scope)
       .then(function(data) {
           $scope.crawlerdata = data.data.json_data
           angular.forEach($scope.crawlerdata, function(value) {
               var array = []
               angular.forEach(value.config.matches, function(field) {
                   angular.forEach(field.fields, function(asset) {
                       if (array.indexOf(asset.assetType) == -1) {
                           array.push(asset.assetType);
                       }
                   })
               })
               $scope.assetType.push(array.join(","));
           });
       });

   /* to display the particular defination details    */
   $scope.crawledData = function(detail, $event) {
       /* adding new rows to display data-on click of icon */
       var link = angular.element($event.currentTarget),
           icon = link.find('.fa'),
           tr = link.parent().parent(),
           table = $scope.vm.dtInstance.DataTable,
           row = table.row(tr);
       /*  expand and collapse based on condition   */
       if (row.child.isShown()) {
           icon.removeClass('fa-minus-circle').addClass('fa-plus-circle');
           row.child.hide();
           tr.removeClass('shown');
       } else {
           /* displaying selected defination details */
           $scope.clickedConfigId = this.value.config.definitionName;
           var value = $scope.crawlerdata[this.$index];
           var objString = JSON.stringify(value);
           var cName = value.config.definitionName;
           var cId = value.config.definitionId;
           if (angular.equals(value.config.definitionName, $scope.clickedConfigId)) {
               var assetType = $scope.assetType;
               row.child($compile('<div class="clearfix ng-scope"><table class="table boderless"><tbody><tr><th class="crawlerTable">Last Modified :</th><td class="ng-binding">' + value.config.modifiedDate + '</td><th class="crawlerTable">Created  :</th><td class="ng-binding">' + value.config.createdDate + '</td></tr><tr><th>Modified by :</th><td class="ng-binding">' + value.config.modifiedBy + '</td><th class="crawlerTable">Created By :</th><td class="ng-binding">' + value.config.createdBy + '</td></tr><tr><th>Asset :</th><td class="ng-binding">' + assetType[this.$index] + '</td></tr><tr></tr></tbody></table><div><button type="button" id="view_' + this.$index + '" data-json=' + escape(objString) + ' class="btn btn-info btn-style">View </button><button type="button" class="btn btn-info btn-style">Trash</button><button class="btn btn-info btn-style" ng-click="storeIdName(\'' + cName + '\',\'' + cId + '\')">Schedule</button><button type="button" class="btn btn-info btn-style">Add Credential</button><button type="button" class="btn btn-info btn-style">Add Proxy </button></div></div>')($scope)).show();
               icon.removeClass('fa-plus-circle').addClass('fa-minus-circle');
               tr.addClass('shown');
           }
       }
   }

   /* Store ID and Name in configObj */
   $scope.storeIdName = function(name, id) {
       $rootScope.configObj = {
           "cName": name,
           "cId": id
       };
       $location.path('/schedule');
   }

   /* View Id and name from crawler data */
   $scope.viewIdName = function(index) {
       var viewCMData = angular.element(document.querySelector("#viewCMData"));
       viewCMData.text(angular.toJson($scope.crawlerdata[index]));
   }
}
;/* Navigation controller */
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
;/* Scheduler Controller  */
function scheduleController($scope,$rootScope,$http,$location,localStorageService, $timeout, domainUrl){
 $scope.durationName="";
 $scope.success = false;
 $scope.startDate = "";
 $scope.hours = 00;
 $scope.minutes = 00;
 $scope.mode = "On Demand";
 $scope.duration = "";
 $scope.recurrMax = 4;
 $scope.keepUpOn = false;
 $scope.weekDays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
 $scope.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
 $scope.choices = [];
 $scope.schedulerData = {
   "startUrl":"",
   "otherSourceId":"",
   "userName": "",
   "crawlerId": "",
   "crawlerName": "",
   "isCrawlerConnected":1,
   "linkedProperty": [],
   "frequency": {
   "type": "",
   "bypassFlag": "",
   "recurrence": 1,
   "weekDay": []
   },
   "startDate": "",
   "createDateTime": "",
   "keepUp": false,
   "KeepupProperty": {
   "noOfPages": "",
   "depth": false
   },
   "startTime": "",
   "respectRobot":true,
   "onDemand":"false"
 }
 $scope.userName = localStorageService.get('userName');
 $scope.DefinitionToLinkList = [];

 /* To get user crawler defintion data*/
   roviVCApiService.viewCd($scope)
       .then(function(data) {
           $scope.crawlerdata = data.data.json_data;
           var array=[];
           angular.forEach($scope.crawlerdata, function(value) {
             if($scope.DefinitionToLink != value.config.definitionId){
               array.push(value.config);
             }
           });
           $scope.DefinitionToLinkList[0]=array;
       });


 /* To get URL selector pattern */
 $scope.UrlSelectorPattern= function(){
   $scope.UrlSelectorInput ="3000";
     roviVCApiService.getUrlPattern($scope)
   .success(function(value) {
     $scope.UrlSelectordata=value;
   });
 }

 $scope.UrlSelectorPattern();
 $scope.schedulerData.crawlerId = $rootScope.configObj.cId;
 $scope.schedulerData.crawlerName = $rootScope.configObj.cName;
 $scope.schedulerData.userName = localStorageService.get('userName');
 $scope.prevDate = null;
 angular.element("INPUT[type='number']").keypress(function (evt) {
   evt.preventDefault();
 });
 /* Update Recurrence change input */
 $scope.update=function() {
   $scope.durationName = "";
   $scope.recurr=1;
   if($scope.duration == 'Daily') {
     $scope.durationName= 'Day(s)';
   }
   if($scope.duration == 'Weekly') {
     $scope.durationName= 'Week(s)';
     $scope.recurrMax = 4;
   }
   if($scope.duration == 'Monthly') {
     $scope.durationName= 'Month(s)';
     $scope.recurrMax = 11;
   }
   $scope.schedulerData.frequency.type = $scope.duration;
 }

 /* Formate function for time */
 $scope.format = function(){
   if(angular.element("#minutes").val().length === 1){
   angular.element("#minutes").val("0" + angular.element("#minutes").val());
   }
   if(angular.element("#hours").val().length === 1){
   angular.element("#hours").val("0" + angular.element("#hours").val());
   }
 }
 $timeout(function(){
   $scope.format();
 },300);


 /* Binding start date */
 $scope.startdateChange = function() {
   if($scope.startDate != null){
     var dateObj =  $scope.startDate;
     var dateFormat = $scope.GetDateFormat(dateObj);
     $scope.schedulerData.startDate = dateFormat;
   }else{
     $scope.schedulerData.startDate=null;
   }

   var todayDate = new Date();
   $scope.schedulerData.createDateTime =  $scope.GetDateFormat(todayDate) + " " + (todayDate.getHours()<10?'0':'') + todayDate.getHours() + ":" + (todayDate.getMinutes()<10?'0':'') + todayDate.getMinutes() + ":" + (todayDate.getSeconds()<10?'0':'') + todayDate.getSeconds() + " " + todayDate.toString().match(/([-\+][0-9]+)\s/)[1];
 }

 /* Function for date(yyyy-mm-dd) */
 $scope.GetDateFormat = function (date) {
   var month = (date.getMonth() + 1).toString();
   month = month.length > 1 ? month : '0' + month;
   var day = date.getDate().toString();
   day = day.length > 1 ? day : '0' + day;
   return date.getFullYear() + '-' +  month + '-' + day;
 }

 /* Keep Up Mode data binding */
 $scope.modeChange = function() {
   $scope.schedulerData.keepUp = $scope.keepupMode;
   if($scope.keepupMode == false){
     $scope.schedulerData.KeepupProperty.depth = false;
     $scope.schedulerData.KeepupProperty.noOfPages = "";
   }else{
     $scope.schedulerData.KeepupProperty.noOfPages = 1;
     $scope.schedulerData.KeepupProperty.depth = true;
   }
 }

 /* Binding Definition dropdown change */
 $scope.DefinitionLinkChange = function(){
   if($scope.DefinitionToLink != ''){
   $scope.schedulerData.linkedProperty.linkedCrawlerId = $scope.DefinitionToLink;
     var array=[];
     $scope.DefinitionToLinkList=[];
     $scope.LinksConnectList=[];
     angular.forEach($scope.crawlerdata, function(value) {
       if($scope.DefinitionToLink != value.config.definitionId){
         array.push(value.config);
       }
     });
     $scope.DefinitionToLinkList[0]=array;
   }else{
     $scope.LinksConnectList = [];
   }
 }

 /* Add more button click binding*/
 $scope.addNewChoice = function() {
   var newItemNo = $scope.choices.length+1;
   if(newItemNo < 3){  //'add more' button click user restricted by 3 times based on requirement
     $scope.choices.push({});
     $scope.fetchAssetResult = "false";
   }
 };

 /* Remove function for 'defintion to link' abd 'link to connect' drop down */
 $scope.removeChoice = function() {
   var lastItem = $scope.choices.length-1;
   $scope.choices.splice(lastItem);
   if($scope.fetchAssetResult == "false"){
     $scope.fetchAssetResult = "true";
   }
 };

 /* Definition To Link input change data binding*/
 $scope.LinksConnectList=[];
 $scope.DefinitionLinkAddChange = function($index){
   if($scope.choices!= ''){
   var choiceCount=1;
   var definitionId="";
   if($index == 0){
     definitionId = $scope.DefinitionToLink;
   }else{
     angular.forEach($scope.choices, function(value) {
     if(($scope.choices.length-1) == choiceCount){
       definitionId = value.linkedCrawlerId;
     }
     choiceCount++;
   });
   }

   $scope.childAssetTypeId = "";
   $scope.parentAssetTypeId = "";
   angular.forEach($scope.crawlerdata, function(value) {
     var array = [];
     if(definitionId == value.config.definitionId){
     angular.forEach(value.config.matches, function(linkList) {
       angular.forEach(linkList.links, function(linksId) {
         array.push(linksId);
       });
     });
     $scope.LinksConnectList[$index]=array;
     }
   });

   var arrayDefinition=[];
   var definitionIdDef = [];
   var i = 0;
   var startDelete = $index+1;
   var numberOfItem =	$scope.choices.length -	$index;
   $scope.choices.splice(startDelete,numberOfItem);
   angular.forEach($scope.choices, function(value) {
   definitionIdDef[i] = value.linkedCrawlerId;
   angular.forEach($scope.crawlerdata, function(value) {
     if($scope.DefinitionToLink != value.config.definitionId && definitionIdDef[i] != value.config.definitionId){
       arrayDefinition.push(value.config);
     }

     if($scope.choices[$index].linkedCrawlerId == value.config.definitionId){
       var parentLI = 0;
       angular.forEach(value.config.matches, function(parentLinkList) {
         angular.forEach(parentLinkList.links, function(parentlinksId) {
         if(parentLI == 0){
           $scope.childAssetTypeId = parentlinksId.assetTypeId;
           parentLI++;
         }
         });
       });
     }
   });
   i++;
   });

   $scope.DefinitionToLinkList[$index+1]=arrayDefinition;
   $scope.schedulerData.linkedProperty = $scope.choices;
   if($scope.choices[$index].urlMappedId){
     $scope.fetchAssetRel($index);
   }
   }
 }

 /* Link to connect dropdown change data binding*/
 var linkedCrawlerId ="";
 $scope.LinksConnectAddChange = function($index){
   $scope.schedulerData.linkedProperty = $scope.choices;
       if($index == 0){
     linkedCrawlerId =$scope.DefinitionToLink;
   }else{
     linkedCrawlerId = $scope.choices[$index-1].linkedCrawlerId;
   }
   var urlMappedId =  $scope.choices[$index].urlMappedId;
     angular.forEach($scope.crawlerdata, function(value) {
     if(linkedCrawlerId == value.config.definitionId){
       angular.forEach(value.config.matches, function(childLinkList) {
         angular.forEach(childLinkList.links, function(childlinksId) {
         if(urlMappedId == childlinksId.id){
           $scope.parentAssetTypeId = childlinksId.assetTypeId;
         }
         });
       });
     }
   });

   roviVCApiService.fetchAssetRel($scope)
   .success(function(value) {
     $scope.fetchAssetResult = value;
   });
 }

 /* To get asset Type Id relation between two definitions */
 $scope.fetchAssetRel = function($index){
     var urlMappedId="";
     if($index == 0){
     linkedCrawlerId =$scope.DefinitionToLink;
     }else{
       linkedCrawlerId = $scope.choices[$index-1].linkedCrawlerId;
     }
     urlMappedId =$scope.choices[$index].urlMappedId;
     angular.forEach($scope.crawlerdata, function(value) {
     if(linkedCrawlerId == value.config.definitionId){
       angular.forEach(value.config.matches, function(childLinkList) {
         angular.forEach(childLinkList.links, function(childlinksId) {
         if(urlMappedId == childlinksId.id){
           $scope.parentAssetTypeId = childlinksId.assetTypeId;
         }
         });
       });
     }
   });
    roviVCApiService.fetchAssetRel($scope)
   .success(function(value) {
     $scope.fetchAssetResult = value;
   });
 }

 /* Start URL input data binding */
   $scope.startUrlChange = function(){
   var startUrlStr = $scope.schedulerData.startUrl;
   if(startUrlStr != ''){
    $scope.startUrlFlag=$scope.validateStartUrl(startUrlStr);
    $scope.schedulerData.otherSourceId = "";
    $scope.otherSource = "";
   }else{
     $scope.startUrlFlag = false;
   }
 }

 /* URL Selector Pattern input data chenge binding*/
 $scope.otherSourceChange = function(){
   $scope.schedulerData.otherSourceId = $scope.otherSource;
 }

 /* Validation for start url input */
 $scope.validateStartUrl =function(ele){
 str = ele.split(",");
 var result = [], counter = 0;
 for (var i = 0; i < str.length; i++) {
   str[i] = str[i].replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
   if(str[i].length !== 0){
   if ($scope.isValidAddress(str[i])) {
     result.push(str[i]);
   }
   counter += 1;
   }
 }
   return (result.length === counter);
 }

 /* URL validation*/
 $scope.isValidAddress=function(s) {
   return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(s)
 }

 /* Binding hour change input */
 $scope.hourChange = function() {
   $scope.format();
   $scope.hoursProcessed = (String($scope.hours).length === 1) ? ("0"+String($scope.hours)) : $scope.hours;
   $scope.minutesProcessed = (String($scope.minutes).length === 1) ? ("0"+String($scope.minutes)) : $scope.minutes;
   $scope.schedulerData.startTime = $scope.hoursProcessed + ":" + $scope.minutesProcessed;
 }

 /* Binding Respect Robot Change input change */
 $scope.RespectRobotChange = function(){
   if($scope.schedulerData.respectRobot == false){
     $scope.SchedulingWarning = "Crawler may be blocked!!!";
     $('#warningScheduling').modal('show');
   }
 }

 /* Day selection input binding */
 $scope.daySelected = function(day) {
   var hasDay = $scope.schedulerData.frequency.weekDay.indexOf(day);
   if(hasDay > -1) {
     $scope.schedulerData.frequency.weekDay.splice(hasDay, 1);
   } else {
     $scope.schedulerData.frequency.weekDay.push(day);
   }
 }

 /* Function for save button and send data to backend */
 $scope.sendData = function() {
   //validation for hours and minutes for backtime
   var todayDate = new Date();
   var hr = todayDate.getHours();
   var min = todayDate.getMinutes();
   var sec = todayDate.getSeconds();
   var todayDateFormat = $scope.GetDateFormat(todayDate);
   $scope.hrMinFlag=true;
   var t1 = hr+":"+min+":"+sec;
   var t2 = $scope.hours+":"+$scope.minutes+":00";
   if($scope.schedulerData.startDate == todayDateFormat ){
     if(t2 > t1){
       $scope.hrMinFlag =true;
      }else{
           $scope.hrMinFlag =false;
      }
   }

   if($scope.schedulerData.frequency.type=="" || ($scope.schedulerData.frequency.type=="Weekly" && $scope.schedulerData.frequency.weekDay.length==0) || ($scope.schedulerData.frequency.type=="Monthly") || $scope.hrMinFlag == false) {
   }
   else {
    roviVCApiService.insertSchedule($scope)
     .success(function(data) {
       $scope.success = true;

       $scope.schedulingSuccessTitle ="Scheduler";
       $scope.schedulingSuccessMsg ="Schedule data saved successfully!!";
       $('#successScheduling').modal('show');
     });
   }
 }

 /* Go back to CM page */
 $scope.goBackTo = function(){
   $timeout( function(){
     $location.path('/crawlerManger');
       }, 2000 );
 }
}
;var app = angular.module('roviVCAppServiceModule', []);

var domainUrl = 'http://172.26.119.66:8000';

app.service('roviVCApiService', ['$http', function($http) {

  this.getVCSchedule = function ($scope) {
	  return $http.post(domainUrl + '/vcrawler/tivo_spider/get_schedule/', {
	          "input": $scope.localUserNameValue
	      });
  }

  this.viewCd = function ($scope) {
	  return $http.post(domainUrl + '/vcrawler/crawlermanagement/view_cd/', {
	          "user_id": $scope.userName
	      });
  }

  this.insertSchedule = function ($scope) {
    return $http.post(domainUrl + '/tivo_spider/insert_schedule/', $scope.schedulerData);
  }

  this.getUrlPattern = function ($scope) {
    return $http.post(domainUrl + '/tivo_spider/UrlPattern/', {
            "UrlSelectorPattern": $scope.UrlSelectorInput
        });
  }

  this.fetchAssetRel = function ($scope) {
    return $http.post(domainUrl + '/tivo_spider/fetch_asset_rel/', {
            "property_1":$scope.childAssetTypeId,
            "property_2":$scope.parentAssetTypeId
        });
  }



}]);
;//This is the apiServices factory
function jsonService(){

    var jsonService = {};

	var jsonSkeleton = {
     "validate": "",
     "credential": {
          "password": "",
          "userName": ""
     },
     "config": {
          "siteId": "",
          "definitionId": "",
          "definitionName": "",
          "createdBy": "",
          "isApproved": "",
          "respectRobotText": "",
          "proxyIP": "",
          "visit": "",
          "matches": [
               {
                    "urlPattern": "",
                    "links": [
                         {
                              "attribute": "",
                              "value": "",
                              "type": "",
                              "id": "",
                              "actions": [
                                   {
                                        "action": "",
                                        "type": "",
                                        "value": ""
                                   }
                              ]
                         }
                    ],
                    "fields": [
                         {
                              "assetType": "",
                              "attribute": "",
                              "name": "",
                              "type": "",
                              "id": "",
                              "value": "",
                              "actions": [
                                   {
                                        "action": "",
                                        "type": "",
                                        "value": ""
                                   }
                              ],
                              "multiple": "",
                              "fields": [
                                   {
                                        "assetType": "",
                                        "name": "",
                                        "attribute": "",
                                        "type": "",
                                        "id": "",
                                        "value": "",
                                        "function": {
                                             "name": "",
                                             "multiOut": "",
                                             "parameters": {
                                                  "string": "",
                                                  "operator": ""
                                             },
                                             "fields": []
                                        }
                                   }
                              ]
                         }
                    ]
               }
          ]
     }
};

    jsonService.getJson = function() {
        return jsonSkeleton;
    }

    return jsonService;
}
;var app = angular.module('roviVCapp', ['ngRoute', 'LocalStorageModule', 'datatables', 'roviVCAppServiceModule']);

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
;$(document).on('click', '.panel-heading span.clickable', function(){

		var $this = $(this);
		if(!$this.hasClass('panel-collapsed')) {
			$this.parents('.panel').find('.panel-body').slideUp();
			$this.addClass('panel-collapsed');
			$this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
		} else {
			$this.parents('.panel').find('.panel-body').slideDown();
			$this.removeClass('panel-collapsed');
			$this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
		}
	})

	$("#menu-toggle").click(function(e) {
		e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});
