function userJourneyService(){
  var userJourneyService={}
    var userJourneyObj =  {
  "allQs": [
    {
      "q": "Do you have login details for this site?",
      "type":"YesOrNo",
      "attributeType":"all",
      "yesMessage":"Enter username, password and click on the login button.",
      "yesCallback":"createLoginSubSession",
      "noCallback":"next",
      "mapped": false,
      "required": true
    },
    {
      "q": "Start mapping the attributes.",
      "type":"Informative",
      "mapped": false,
      "required": true
    },
    {
      "q": "Select the asset type you want to map and add it.",
      "type":"Informative",
      "mapped": false,
      "required": true
    },
    {
      "q": "Map asset ID for an asset in the group and click done when complete.",
      "type":"Informative",
      "attributeType":"mandatory",
      "callback":"createMandatoryAttributeSubSession",
      "mapped": false,
      "required": true
    },
    {
      "q": "Map Title for an asset in the group and click done when complete.",
      "type":"Informative",
      "attributeType":"mandatory",
      "callback":"createMandatoryAttributeSubSession",
      "mapped": false,
      "required": true
    },
    {
      "q": "Do you see multiple assets of same type?",
      "type":"YesOrNo",
      "attributeType":"all",
      "yesMessage":"Select few items of the asset type on the page. Click other groups once to include and click again to exclude.",
      "yesCallback":"createAttributeSubSession",
      "noCallback":"createDetailSubSession",
      "mapped": false,
      "required": true
    },
    {
      "q": "Do you see a list pagination for more items of the same asset type?",
      "type":"YesOrNo",
      "paginationType":"click",
      "yesCallback":"createPaginationSubSession",
      "yesMessage":"Perform click on next page link on the pagination control and click done when complete.",
      "noCallback":"next",
      "mapped": false,
      "required": true
    },
    {
      "q": "Do you see scrolling adds more assets of same type? if Yes click done when complete.",
      "type":"YesOrNo",
      "paginationType":"scroll",
      "yesCallback":"createPaginationSubSession",
      "noCallback":"next",
      "mapped": false,
      "required": true
    },

    {
      "q": "Do you want to map additional attributes for the asset you have chosen?",
      "type":"YesOrNo",
      "attributeType":"all",
      "yesMessage":"Click on objects to map and select done when complete.",
      "yesCallback":"createAttributeSubSession",
      "noCallback":"next",
      "mapped": false,
      "required": true
    },
    {
      "q": "Do you see other assets to map on the page?",
      "type":"YesOrNo",
      "yesCallback":"createNewAsset",
      "noCallback":"next",
      "mapped": false,
      "required": true
    },
    {
      "q": "Click a link to load detail page of the asset or click done to complete definition.",
      "type":"Informative",
      "mapped": false,
      "required": true
    },
    {
      "q": "Map all the attributes in this page and click done.",
      "type":"Informative",
      "mapped": false,
      "required": true
    },
    {
      "q": "Do you see other assets to map on the page?",
      "type":"YesOrNo",
      "yesCallback":"createNewAsset",
      "noCallback":"nextEnd",
      "mapped": false,
      "required": true
    }
],
"pages": []
}

userJourneyService.getJson = function () {
      return userJourneyObj
  }

return userJourneyService

}


var pagesArray = [
  {
    "actualUrl": "",
    "mappingPaused": false,
    "assets": [
      {
        "assetTitle": "",
        "activeAsset": true,
        "currentSubSession": "listing",
        "currentQ": 1,
        "subSessions": {

          "mandatoryAttributes": {
            "active": false,
            "noOfAttributesMapped": 1
          },

          "allAttributes": {
            "active": false,
            "noOfAttributesMapped": 1,
            "trainingIdentifiers": ["",""]
          },

          "login": {
            "active": false,
            "noOfAttributesMapped": 1
          },

          "pagination": {
            "active": true,
            "noOfAttributesMapped": 1
          }
        }
      }
    ],
    "subSessionSequences": {
      "seq1": [
        "listing", "pagination", "mandatoryAttributes"
      ],
      "seq2": [
        "detailing", "pagination", "mandatoryAttributes"
      ]
    }
  }
]
