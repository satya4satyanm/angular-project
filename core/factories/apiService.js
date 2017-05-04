var app = angular.module('roviVCAppServiceModule', []);

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
