var app = angular.module('roviApp', ['roviAppServiceModule','LocalStorageModule'])

app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('demoPrefix')
}])

app.factory('jsonService', jsonService)
app.factory('userJourneyService', userJourneyService)
//for vcForm.html//
app.controller("vcFormController", ['$scope', '$window', '$http', 'localStorageService','roviApiService' ,function ($scope, $window, $http, localStorageService,roviApiService) {
    $scope.userName = ""
    $scope.vcFormeErrorMessage = ""
    $scope.proxyUrl = []
    $scope.proxyList = []
    $scope.title = localStorageService.get('title')
    $scope.url = localStorageService.get('url')
    $scope.trainingUrl = localStorageService.get('trainingUrl')
    $scope.proxy = localStorageService.get('proxy')
    $scope.createdUser = localStorageService.get('createdUser')
	  $scope.siteUrl = localStorageService.get('siteUrl')
    $scope.vcFormeErrorMessage = ""

    $scope.$watch('[title,url,proxy,siteUserName,sitePassword,createdUser,definitionType,siteUrl]', function (values) {
        // adds a value to local storage //
        localStorageService.set('title', $scope.title)
        localStorageService.set('url', $scope.url)
        localStorageService.set('trainingUrl', $scope.trainingUrl)
        localStorageService.set('proxy', $scope.proxy)
        localStorageService.set('siteUserName', $scope.siteUserName)
        localStorageService.set('sitePassword', $scope.sitePassword)
        localStorageService.set('createdUser', $scope.userName)
        localStorageService.set('definitionType', $scope.definitionType)
        localStorageService.set('siteUrl', $scope.url)
        $scope.getLoginDefinition()

    })

    //checks if user's login details are available for the particular site.
    $scope.getLoginDefinition = function () {
        $scope.userName = localStorageService.get('createdUser')
        $scope.definitionType = localStorageService.get('definitionType')
        $scope.siteUrl = localStorageService.get('siteUrl')
        if ($scope.siteUrl != null ) {
          $scope.siteUrl = $scope.siteUrl.split('/')[2].replace(/www./, "")
        }
        roviApiService.getDefinition($scope)
            .then(function (data, success) {
                $scope.crawlerdata = data.data.json_data
                localStorageService.set('logindetails', JSON.stringify($scope.crawlerdata))
                if ($scope.crawlerdata.length !== 0) {
                    localStorageService.set('loginRequired', true)
                    localStorageService.set('loginObjectFromLS', JSON.stringify($scope.crawlerdata))
                    $scope.loginCheckbox = {
                        value1: true
                    }
                } else {
                    localStorageService.set('loginRequired', false)
                    $scope.loginCheckbox = {
                        value1: false
                    }
                }
            })
    }


    //clears the vcformcontroller localstorage data
    $scope.clearAll = function () {
        localStorageService.clearAll()
    }

    $window.parent.postMessage(['getUserName', ""], '*')

    $window.addEventListener('message', function (e) {
        if (e.data[0] === 'gotUserName') {
            $scope.userName = e.data[1]
        }
    })


    // on vc form submit we navigate to the site based on url entered.
    $scope.sendData = function() {
        $scope.vcFormeErrorMessage = 'Loading Please wait...'
        if ($scope.url != null) {
          loadExtensionDetails = {
            "loadExtension": true,
            "loadedUrl": $scope.url
          }
          chrome.storage.local.set({
              "loadExtensionDetails": loadExtensionDetails
          }, function() {
              return "loadExtension"
          })

          $window.parent.location = $scope.url
        } else {
            $scope.vcFormeErrorMessage = 'Please Enter valid URL !!!'
        }

        if ($scope.definitionType == null) {
          $scope.vcFormeErrorMessage = 'Please choose a definition type !!!'
        }

    }
    //code written for proxy but currently this is not used.
    $scope.getSiteProxy = function () {
        roviApiService.getProxyDetails($scope)
            .then(function (response) {
                $scope.proxyUrl = response.data
                $window.parent.location = $scope.proxyUrl
            }, function (response) {
                $scope.vcFormeErrorMessage = "Page Error : " + response.status + " " + response.statusText
            })
    }

    //code written for proxy but currently this is not used.
    $scope.getProxies = function () {
        if ($scope.url !== "") {
            $scope.loading = true
            roviApiService.getProxies($scope)
                .then(function (response) {
                    $scope.proxyList = response.data.ip_list
                    $scope.loading = false
                }, function (response) {
                    if (response.status === -1) {
                        $scope.vcFormeErrorMessage = 'Error in loading Choose proxy list : ERR_CONNECTION_REFUSED'
                    }
                })
        }
    }

}])
//controller for iframe.html//
app.controller("roviController", ['$scope', '$http', '$window', 'jsonService', 'userJourneyService', 'localStorageService','roviApiService', function ($scope, $http, $window, jsonService, userJourneyService, localStorageService,roviApiService) {
    localStorageService.set('stateManager', null)
    $scope.currentPageUrl = ""
    $scope.defnSaved = ""
    $scope.example2 = ""
    $scope.assetIDNTypeAreMaped = false
    $scope.pageType = ["List Page", "Detail Page"]
    $scope.flagViewCMData = false
    var error
    //state manager is used for the messenger(user flow messages will be triggered based on this).
    $scope.stateManager = (localStorageService.get('stateManager') === null) ? userJourneyService.getJson() : localStorageService.get('stateManager')
    localStorageService.set('stateManager', $scope.stateManager)

    $scope.$watch('stateManager', function () {
        localStorageService.set('stateManager', JSON.stringify($scope.stateManager))
    }, true)


    //based on this flag(loginRequired) we post the login definition of the user to the UIhandler to log the user in.
    if (localStorageService.get('loginRequired')) {
        $window.parent.postMessage(['loginJSON', localStorageService.get('loginObjectFromLS')], '*')
        $window.parent.postMessage(["stateManager", $scope.stateManager], '*')
        }

        else {
          $window.parent.postMessage(["stateManager", $scope.stateManager], '*')
        }


        $scope.goBack = function() {
            localStorageService.set('stateManager', null)
            localStorageService.set('loginObjectFromLS', null)
            $window.parent.postMessage(["goBack"], '*')
        }

    $window.parent.postMessage(['start_selection'], '*') // do not delete this line
    $scope.start = function () {
        //yet to be implemented
    }

    $scope.createLabels = function () {
        $window.parent.postMessage(['createLabels', $scope.rootObject.config.matches[$scope.currentMatcheId], $scope.currentMatcheId], '*')
    }

    $scope.currentMatcheId = localStorageService.get('currentMatcheId')

    if ($scope.currentMatcheId === null) {
        $scope.currentMatcheId = 0
    }

    $scope.changePage = function (url = "") {
        if ($scope.rootObject.config.matches.length > 0) {
            for (var o = 0; o < $scope.rootObject.config.matches.length; o++) { // if user comes back
                if ($scope.rootObject.config.matches[o].actualUrl === $scope.currentPageUrl) {
                    $scope.currentMatcheId = o // this will work for back button but not on second define on sae page
                    $scope.matchFound = 1
                    break
                }
            }
            $scope.createLabels()
        } else {
            $scope.currentMatcheId = $scope.rootObject.config.matches.length
        }

        localStorageService.set('currentMatcheId', $scope.currentMatcheId)

        if (url !== "") {
            $window.parent.location.replace($scope.rootObject.config.matches[$scope.currentMatcheId].actualUrl)
        }
    }

    //this loads the data available for the current mapping in the extension
    $scope.loadData = function () {
        if ($scope.flagViewCMData === "true") {
            chrome.storage.local.get("viewCMData", function(result) {
                if (result.viewCMData !== null) {
                    $scope.rootObject = JSON.parse(result.viewCMData)
                    localStorageService.set('rootObjectFromLS', JSON.stringify($scope.rootObject))
                    $window.parent.postMessage(['definitionType', $scope.rootObject.config.definitionType], '*')
                    $scope.createLabels()
                    $scope.$watch('rootObject', function () {
                        localStorageService.set('rootObjectFromLS', JSON.stringify($scope.rootObject))
                        chrome.storage.local.set({
                            "viewCMData": JSON.stringify($scope.rootObject)
                        }, function () {
                          //need to be implemented
                        })
                    }, true)
                    $scope.$apply()
                }
            })
        } else {
            $scope.getSiteId()
            $scope.rootObjSkeleton = jsonService.getRootObject()
            $scope.pageObjSkeleton = userJourneyService.getJson()
            $scope.rootObjFromLS = JSON.parse(localStorageService.get('rootObjectFromLS'))
            $scope.rootObject = ($scope.rootObjFromLS === null) ? $scope.rootObjSkeleton : $scope.rootObjFromLS
            //check url and get the match id
            if ($scope.rootObject.config.matches.length > 0) {
                for (o = 0; o < $scope.rootObject.config.matches.length; o++) { // if user comes back
                    if ($scope.rootObject.config.matches[o].actualUrl === $scope.currentPageUrl) {
                        $scope.currentMatcheId = o // this will work for back button but not on second define on sae page
                        $scope.matchFound = 1
                        break
                    }
                }
                $scope.createLabels()
            } else {
                $scope.currentMatcheId = $scope.rootObject.config.matches.length
            }

            localStorageService.set('currentMatcheId', $scope.currentMatcheId)
            $scope.rootObject.config.siteId = localStorageService.get('siteId')

            if ($scope.rootObject.config.definitionName === "") {
                $scope.rootObject.config.definitionName = localStorageService.get('title')
                $scope.rootObject.config.proxyIP = localStorageService.get('proxy')
                $scope.rootObject.credential.loginUrl = localStorageService.get('url')
                $scope.rootObject.config.trainingUrl = localStorageService.get('trainingUrl')
                $scope.rootObject.config.createdBy = localStorageService.get('createdUser')
                $scope.rootObject.config.definitionType = localStorageService.get('definitionType')
                $scope.rootObject.config.loginRequired = localStorageService.get('loginRequired')
                $window.parent.postMessage(['definitionType', $scope.rootObject.config.definitionType], '*')
                var visit = $scope.extractDomain(localStorageService.get('url'))
                $scope.rootObject.config.visit = visit
            }

            $scope.$watch('rootObject', function () {
                localStorageService.set('rootObjectFromLS', JSON.stringify($scope.rootObject))
                chrome.storage.local.set({
                    "loginObjectFromLS": localStorageService.get('loginObjectFromLS')
                }, function () {
                    return 'Chrome app storage set with loginObjectFromLS'
                })
                chrome.storage.local.set({
                    "rootObjectFromLS": $scope.rootObject
                }, function () {
                    return 'Chrome app storage set with'
                })
            }, true)
            $scope.$apply()
        }
    }
    /* To get site Id */
    $scope.getSiteId = function () {
       roviApiService.getField()
        .success(function (response) {
        $scope.siteUrl = localStorageService.get('url')
        if ($scope.siteUrl !== null ) {
          $scope.siteUrl = $scope.siteUrl.split('/')[2].replace(/www./, "")
        }
            var url = $scope.siteUrl
        localStorageService.set('siteId', response.siteId[url])
        })
    }

    //extract the domain name from the url
    $scope.extractDomain = function (url) {
        var domain
        if (url.indexOf("://") > -1) {
            var domainParts = url.split('/')
            domain = domainParts[0] + "/" + domainParts[1] + "/" + domainParts[2]
        } else {
            domain = url.split('/')[0]
        }
        return domain
    }

    //saves the crawler definition to the db
    $scope.save = function () {
        var todayDate = new Date()
        $scope.rootObject.config.createDateTimeZone = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate() + " " + todayDate.toTimeString()
        if ($scope.rootObject.config.definitionName !== "" && $scope.rootObject.config.createdBy !== "" && $scope.rootObject.config.visit !== "") {
            angular.element('#saveBtn').attr("disabled", "disabled")
            roviApiService.saveDefinition($scope)
                .then(function() {
                    $window.parent.postMessage(['saveSuccess'], '*')
                    chrome.storage.local.clear( function () {
                    error = chrome.runtime.lastError
                    })
                    setTimeout(function () {
                        localStorageService.clearAll()
                        $window.parent.location.replace("http://localhost/crawler-wizard/#/visualCrawler")
                    }, 2000)
                }, function () {
                    $window.parent.postMessage(['saveError'], '*')
                })
        }
    }
    //Binds the matches object( like url pattern) to the json object.
    $scope.addMatch = function (obj, url, urlPattern, assetObj) {
        $scope.matchFound = 0

        $scope.matchedPatterns = []
        if ($scope.rootObject.config.matches.length > 0) {
            for (o = 0; o < $scope.rootObject.config.matches.length; o++) { // if user comes back
                if ($scope.rootObject.config.matches[o].actualUrl === url.split("?action")[0]) {
                    $scope.currentMatcheId = o // this will work for back button but not on second define on sae page
                    $scope.matchFound = 1
                    break
                }
            }

            if ($scope.matchFound > 0) { // if user comes back and match found

            } else { // this is for second page
                $scope.rootObject.config.matches.push(obj)
                $scope.currentMatcheId = $scope.rootObject.config.matches.length - 1
                for (var u = 0; u < urlPattern.p.length; ++u) {
                    var pattern = urlPattern.p[u].split(".*").join("")
                    if (url.indexOf(pattern) > -1) {
                        $scope.matchedPatterns.push(pattern)
                    }
                }
                if ($scope.matchedPatterns.length > 0)
                    $scope.mapURLPattern($scope.matchedPatterns)
                    $scope.updateMatchData(url)
            }
        } else if ($scope.rootObject.config.trainingUrl === null) { //  first page first time. Second time on first page no match is required
            $scope.rootObject.config.matches.push(obj)
            $scope.rootObject.config.matches[$scope.currentMatcheId].assets.push(assetObj)
            $scope.trainingUrl = url.split("?action")[0]
            localStorageService.set('trainingUrl', $scope.trainingUrl)
            $scope.rootObject.config.trainingUrl = $scope.trainingUrl
            $scope.rootObject.config.matches[$scope.currentMatcheId].urlPattern = $scope.trainingUrl + "$"
            $scope.updateMatchData(url)
        } else { // This is a temporary fix for start URL
            $scope.rootObject.config.matches.push(obj)
        }
    }

    //updates the match object if updated by user
    $scope.updateMatch = function (url, assetType, name, value, dropdownValue, index, currentMatchId) {
        var currentMatchIndex = (currentMatchId !== null) ? currentMatchId : $scope.currentMatcheId
        var attributesLength = $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes.length
            for (var i = 0; i < attributesLength; i++) {
                if ($scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i].labelIndex == index) {
                    $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i].value = value
                      $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i].name = name
                    break
                }
            }
        }

    //edits the label and sedns it to UIhandler
    $scope.editLabel = function (index, currentMatchId) {
        var currentMatchIndex = (currentMatchId !== null) ? currentMatchId : $scope.currentMatcheId
      var attributesLength = $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes.length
        for (var i = 0; i < attributesLength; i++) {

            if ($scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i].labelIndex == index) {
                $window.parent.postMessage(['editAttribute', $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i]], '*')
                break
            }
        }
    }

    //called on addMatch binds the match data to json based on current match id.
    $scope.updateMatchData = function (url) {
        $scope.rootObject.config.matches[$scope.currentMatcheId].actualUrl = url.split("?action")[0]
    }

    //called on addMatch binds the urlPatter data to json based on current match id.
    $scope.mapURLPattern = function (arr) {
        $scope.longest = arr.reduce(function (a, b) {
            return a.length > b.length ? a : b
        })
        $scope.rootObject.config.matches[$scope.currentMatcheId].urlPattern = $scope.longest + ".*"
    }


    //deletes the fields mapping based on the currentMatchId
    $scope.removeField = function (index, currentMatchId) {
        var currentMatchIndex = (currentMatchId !== null) ? currentMatchId : $scope.currentMatcheId
        var attributesLength = $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes.length
        for (var i = 0; i < attributesLength; i++) {
            if ($scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes[i].labelIndex == index) {
                $scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes.splice(i, 1)
                break
            }
        }
        // check if all fields and links has been deleted from the current match. if so delete the match as well
        if ($scope.rootObject.config.matches[currentMatchIndex].assets[currentMatchIndex].attributes.length == 0) {
            $scope.rootObject.config.matches.splice(currentMatchIndex, 1)
            // if this was the first match, then handle start URL again

            // if this was somewhere in between, where should the user go
        }

        // Send a message to uiHandler to set trainingUrl tracked as false
         // check a value field to remove instead of index as it updates every time
        $scope.$apply()
    }

    //validates the crawler definition via API
    $scope.validatePopup = function () {
        $scope.rootObject.validate = "true"
        $window.parent.postMessage(['clearValidateResult'], '*')
        roviApiService.validateData($scope)
            .then(function(value) {
                $window.parent.postMessage(['validate', value.data], '*')
            })
    }


    //mouseover functionality
    $scope.mouseOver = function (indexValue) {
        $window.parent.postMessage(['mouseOver', indexValue], '*')
    }

    //mouseout functionality
    $scope.mouseOut = function (indexValue) {
        $window.parent.postMessage(['mouseOut', indexValue], '*')
    }
      var obj
    // all the UIhandler post messages captured here
    window.addEventListener('message', function (e) {
        if (e.data[0] === 'currentPageUrl') {
            $scope.currentPageUrl = e.data[1].split("?action=")[0]
            chrome.storage.local.get("flagViewCMData", function (result) {
                if (result.flagViewCMData !== null) {
                    $scope.flagViewCMData = result.flagViewCMData
                }

                $scope.loadData()
            })
        }

        if (e.data[0] === 'Remove') {
            $scope.removeField(e.data[1], e.data[2])
        }

        if (e.data[0] === 'AddDetailPage') {
            $scope.addNewPage(e.data[1])
        }

        if (e.data[0] === 'source') {
            $scope.rootObject.config.siteId = e.data[1]
            $scope.$apply()
        }

        if (e.data[0] === 'visitUrl') {
            if ($scope.rootObject.config.visit === null) {
                $scope.rootObject.config.visit = String(e.data[1]).split("?")[0]
                $scope.$apply()
            }
        }
        if (e.data[0] === 'addMatch') {
          obj = jsonService.getMatchesJson()
            $scope.addMatch(obj, e.data[1], e.data[2], e.data[3])
        }

        if (e.data[0] === 'addAttribute') {
        $scope.rootObject.config.matches[$scope.currentMatcheId].assets[$scope.currentMatcheId].attributes.push(e.data[1])
        $scope.$apply()
        }
        if(e.data[0] === "addPagination") {
          if (e.data[2] === "preObj") {
              $scope.rootObject.config.matches[$scope.currentMatcheId].assets[$scope.currentMatcheId].preProcessor = e.data[1]
          } else {
            $scope.rootObject.config.matches[$scope.currentMatcheId].assets[$scope.currentMatcheId].postProcessor = e.data[1]
          }
        }
        if (e.data[0] === 'Edit') {
            $scope.rootObject.config
            $scope.editLabel(e.data[1], e.data[2])
        }

        if (e.data[0] === 'updateMatch') {
            obj = jsonService.getMatchesJson()
            $scope.updateMatch(e.data[1], e.data[2], e.data[3], e.data[4], e.data[5], e.data[6], e.data[7])
        }

        if (e.data[0] === 'updaterootObject') {
            $scope.rootObject.credential.preActions = e.data[1].preActions
            $scope.rootObject.credential.password = e.data[1].password
            $scope.rootObject.credential.userName = e.data[1].userName
            $scope.rootObject.credential.postActions = e.data[1].postActions
            $scope.$apply()
        }

        if (e.data[0] === 'updatePageObj') {
            $scope.pageObjSkeleton = e.data[1]
            chrome.storage.local.set({
                "pageObjSkeleton": JSON.stringify($scope.pageObjSkeleton)
            }, function () {
                return "pageObjSkeleton updated"
            })
            $scope.rootObject.trainingFlow = $scope.pageObjSkeleton
            $scope.$apply()
        }

        if (e.data[0] === 'goBackResponse') {
            localStorageService.clearAll()

            chrome.storage.local.clear(function () {
             error = chrome.runtime.lastError
            })

            setTimeout(function () {
                $window.parent.location.replace("http://localhost/crawler-wizard/#/visualCrawler")
            }, 1000)
        }

    })
}])
