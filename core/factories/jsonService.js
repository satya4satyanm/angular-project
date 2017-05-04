//This is the apiServices factory
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
