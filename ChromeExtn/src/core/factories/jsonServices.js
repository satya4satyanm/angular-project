function jsonService() {

    var jsonService = {}
    var rootObject = {
        "validate": "",
        "credential": {
            "loginUrl": "",
            "password": {
                "content": "",
                "value": "",
                "type": "css selector"
            },
            "userName": {
                "content": "",
                "value": "",
                "type": "css selector"
            },
            "preProcessor": [{
                "url": "",
                "action": "click",
                "type": "css selector",
                "value": ""
            }],
            "postProcessor": [{
                "url": "",
                "action": "click",
                "type": "css selector",
                "value": ""
            }]
        },
        "config": {
            "siteId": "",
            "definitionId": "",
            "definitionName": "",
            "createdBy": "",
            "isApproved": "",
            "modifiedBy": "",
            "modifiedDate": "",
            "createdDate": "",
            "respectRobotText": false,
            "proxyIP": "",
            "visit": "",
            "trainingUrl": "",
            "matches": []
        },
        "trainingFlow": []
    }


    var matchesJson = {
        "urlPattern": "",
        "actualUrl": "",
        "assets":[] 
    }


    jsonService.getMatchesJson = function () {
        return matchesJson
    }

    jsonService.getRootObject = function () {
        return rootObject
    }
    return jsonService
}
