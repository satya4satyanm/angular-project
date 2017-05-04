/* crawler management Controller  */
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
