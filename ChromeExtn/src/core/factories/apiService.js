var app = angular.module('roviAppServiceModule', [])

var domainUrl = '//172.26.119.66:8000'

app.service('roviApiService', ['$http', function ($http) {
  this.getDefinition = function ($scope) {
              return $http.post(domainUrl + '/vcrawler/crawlermanagement/view_cd/', {
                      "user_id": $scope.userName,
                      "definitionType": "login",
                      "siteUrl": $scope.siteUrl
                  })
         }

  this.getProxyDetails = function ($scope) {
    return $http.post(domainUrl + '/vcrawler/tivo_proxy/apply_proxy/', $scope.urlProxyIpKeyVals)
  }

  this.getProxies = function ($scope) {
    return $http.post(domainUrl + '/vcrawler/tivo_proxy/proxy_ips/', {
            "url": $scope.url
        })
    }

  this.getField = function () {
    return $http.get(domainUrl + '/tivo_spider/get_field/')
  }

  this.saveDefinition = function ($scope) {
    return $http.post(domainUrl + '/vcrawler/crawlermanagement/cd_insertion/', $scope.rootObject)
  }

  this.validateData = function ($scope) {
    return $http.post(domainUrl + '/vcrawler/tivo_spider/crawl/ ', $scope.rootObject)
  }


}])
