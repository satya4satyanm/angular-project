var extensionOrigin = 'chrome-extension://' + chrome.runtime.id
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var src = chrome.extension.getURL("/src/views/iframe.html")
    var iframeContainer = document.createElement('div')
    var extensionLogo = chrome.runtime.getURL("/src/resources/images/48.png")
    var jsonWithLogin
    var viewCMData
    //configuration tab html//

      iframeContainer.innerHTML = '<input id="toggle1" type="checkbox" checked=""><label id="l1" for="toggle1"><img src="' + extensionLogo + '"/></label><div id="collapse-right"><div id="wizard" class="swMain"> <ul class="anchor" style="margin: 0;padding: 0;"> <li id="th1" class="tabs selected" rel="1" onclick="changeTab(1)">Configuration</li><li id="th2" class="tabs" rel="2" onclick="changeTab(2)">Validation</li><li id="th3" class="tabs" rel="3" onclick="changeTab(3)">Extension</li><li id="th4" class="tabs" rel="4" onclick="changeTab(4)">Login</li></ul> <div class="stepContainer"> <div id="step-1-c" class="content" style="display: block;height: 530px;"> <h2 class="StepTitle"></h2> <div id="cntnr"> <button class="ok" id="start">Start Mapping</button> <div id="div_Scheme" style="display:none"> Asset Type: <select id="assetType" class="assetType"> <option value="select">Select Asset Type</option> </select> <button class="ok" id="addAsset" value="Add Asset">Add Asset</button> </div><div id="assetTypeContainer" style="display:none"></div><div id="assetSSContainer" class="assetSSContainer" style="display:none"> <div id="assettypebtn"> </div><div id="subSessionContainer" style="display:none"> <div id="subsessionbtn"> </div><div id="subSessionContent" class="subSessionContent"> </div></div><br/> <div id="devMode" style="display:none;"> <br/> <select style="display:block" id="linksOrFieldsDropdown"> <option value="links">Links</option> <option value="fields">Fields</option> <option value="images">Images</option> </select> <div id="div_Scheme1"> <span class="formLabel">Attribute Name:</span> <select id="assetSubType" class="assetSubType"> <option value="select">Select Attribute Name</option> </select> <br/> </div><div id="div_assetId" style="display:none"><button class="btn-blue" id="viewElementSource" style="margin-left:105px;">View Element Source</button><span class="formLabel">Attribute:</span> <input type="text" id="attributeName" class="actionElement"> <br><span class="formLabel">Value:</span><input type="text" id="attributeValue" class="actionElement"><br></div><div style="display:none"> <span class="formLabel">Type of Selecter:</span> <select id="selectorType"> <option value="css selector">CSS Selector</option> <option value="XPath">XPath</option> <option value="RegExp">RegExp</option> </select> <br/> </div><span class="formLabel">Selector:</span><input type="text" id="selectorVal"/> <br/> <div style="display:none">Attribute: <select id="attributeTxt"></select></div><span class="formLabel">Action Type:</span> <select id="actionType"> <option value="select">Select Action Type</option> <option value="click">Click</option> <option value="scroll">Scroll</option> </select> </br><span class="formLabel">Action Element:</span><input type="text" id="actionElem" class="actionElement"/><br/> <div id="functionWraper"> <span class="formLabel">Function:</span> <select class="fnDropdown" id="functionType"> <option value="0">Select a function</option> <option value="1">substring</option> <option value="2">escape_character</option> <option value="3">split</option> <option value="4">current_timestamp</option> <option value="5">timeZone_to_string</option> </select> </div><div id="functionBlock" style="position: absolute; bottom: 0; left: 0; padding: 10px;width: 100%; text-align: right; box-sizing: border-box;"> </div><div style="text-align:left;"> <span id="ok">Add Attribute</span> </div></div></div><div style="position: absolute; bottom:10px; text-align: right; width:94%; display:none" id="subSessionControls"> <button id="subSessionDone" class="done">Done</button> </div><br/> <div id="fieldsError" style="display:none; color:red;">Selected combination is already defined in schema.</div></div></div><div id="step-2-c" class="content" style="display: none;max-height: 560px;"> <h2 class="StepTitle"></h2> <div id="userModalPopup1"> <div class="modal-body" style="position:relative; overflow: scroll;overflow-x: hidden;height: 530px;"></div></div></div><div id="step-3-c" class="content" style="display: none;height:530px;"> <h2 class="StepTitle"></h2> <iframe id="roviTiVoApp" style="width: 100%; height: 530px; border: 0;" src="' + src + '"></iframe> </div><div id="step-4-c" class="content" style="display: none;height:530px;"> <div class="loginActionElement">Username: <input type="text" id="loginActionElemU"/></div><div class="loginActionElement"> Password: <input type="text" id="loginActionElemP"/></div><div class="loginActionElement"> Login Buttn: <input type="text" id="loginActionBtn"/> </div><div id="loginBlock" style="position: absolute; bottom: 0px; left: 0px; padding: 10px; width: 100%; text-align: right; box-sizing: border-box; outline: none;"> <button class="loginOk" id="loginTrackBtn">Track Login</button> </div></div></div></div>';

//appending libraries to chrome extension//
    var appStyle = document.createElement('link')
    appStyle.setAttribute('rel', 'stylesheet')
    appStyle.setAttribute('type', 'text/css')
    appStyle.setAttribute('media', 'screen')
    appStyle.setAttribute('href', chrome.runtime.getURL('/src/resources/css/app-style.css'))

    var bootstrapJs = document.createElement('script')
    bootstrapJs.type = 'text/javascript'
    bootstrapJs.src = "chrome-extension://" + chrome.runtime.id + '/src/vendors/bootstrap/bootstrap.js'

    var bootstrapCss = document.createElement('link')
    bootstrapCss.setAttribute('rel', 'stylesheet')
    bootstrapCss.setAttribute('type', 'text/css')
    bootstrapCss.setAttribute('media', 'screen')
    bootstrapCss.setAttribute('href', chrome.runtime.getURL('/src/vendors/bootstrap/bootstrap.css'))

    var messengerStyle = document.createElement('link')
    messengerStyle.setAttribute('rel', 'stylesheet')
    messengerStyle.setAttribute('type', 'text/css')
    messengerStyle.setAttribute('media', 'screen')
    messengerStyle.setAttribute('href', chrome.runtime.getURL('/src/vendors/alerty.css'))

    var messenger = document.createElement('script')
    messenger.type = 'text/javascript'
    messenger.src = "chrome-extension://" + chrome.runtime.id + '/src/vendors/alerty.js'

    var hlJs = document.createElement('script')
    hlJs.type = 'text/javascript'
    hlJs.src = "chrome-extension://" + chrome.runtime.id + '/src/vendors/highlight.js'

    //validate Modal //
    var modal = document.createElement('div')
    modal.setAttribute("id", "userModalPopup")
    modal.setAttribute("tabindex", "-1")
    modal.setAttribute("class", "modal")
    modal.innerHTML = '<div class="modal-content"><div class="modal-header"><span class="close" id="btnCloseTop">&times;</span><h5 id="myModalLabel">Scrape Result</h5></div><div class="modal-body"></div><div class="modal-footer"><!--button type="button" class="btn btn-default" >Save</button--><button type="button" id="btnClose" class="btn btn-default" >Close</button></div></div>'

    var highlighterDiv = document.createElement('div')
    highlighterDiv.setAttribute("class", "highlighter")
    highlighterDiv.innerHTML = '<div id="xpath"></div><div id="result"></div>'

    var labelsContainer = document.createElement('div')
    labelsContainer.setAttribute("style", "z-index:9999999")
    labelsContainer.setAttribute("id", "labelsContainer")

    var jqueryRef = document.createElement('script')
    jqueryRef.type = 'text/javascript'
    jqueryRef.src = "chrome-extension://" + chrome.runtime.id + '/src/vendors/jquery/jquery-3.1.1.min.js'

    var jqueryNoconflict = document.createElement('script')
    jqueryNoconflict.type = 'text/javascript'
    jqueryNoconflict.src = "chrome-extension://" + chrome.runtime.id + '/src/vendors/jquery/jqueryNoconflict.js'

    var ajaxRequests = document.createElement('script')
   ajaxRequests.type = 'text/javascript'
   ajaxRequests.src = "chrome-extension://" + chrome.runtime.id + '/src/chromeExtnResources/ajaxRequests.js'

    var uiHandler = document.createElement('script')
    uiHandler.type = 'text/javascript'
    uiHandler.src = "chrome-extension://" + chrome.runtime.id + '/src/chromeExtnResources/uiHandler.js'

    var uiFunctionHandler = document.createElement('script')
    uiFunctionHandler.type = 'text/javascript'
    uiFunctionHandler.src = "chrome-extension://" + chrome.runtime.id + '/src/chromeExtnResources/uiFunctionHandler.js'

    var uiLoginHandler = document.createElement('script')
    uiLoginHandler.type = 'text/javascript'
    uiLoginHandler.src = "chrome-extension://" + chrome.runtime.id + '/src/chromeExtnResources/uiLoginHandler.js'
    var viewVisitUrl = ''
    var getVisitUrl = ''
    var url = document.URL
    var action = ''

    chrome.storage.local.get("loadExtensionDetails", function (loadExtensionDetails) {
       loadExtensionDetails = loadExtensionDetails['loadExtensionDetails']
       if (loadExtensionDetails != null) {
       userSiteUrl  = extractDomain(loadExtensionDetails['loadedUrl'])
       currentSiteUrl = extractDomain(url)
       if (loadExtensionDetails['loadExtension'] && userSiteUrl === currentSiteUrl ) {
          action = "roviWebScraperActive"
       }
       else{
          action = ''
       }
     }
   })

    if (document.readyState == "complete") {
        setTimeout(function () {
            if (url.split("action=")[0].indexOf("#/visualCrawler") > -1) {
                addVcForm()
            }
        }, 500)
        setInterval(function () {
            try {
                document.getElementById('extn').style.display = "block"
                document.getElementById('noExtn').style.display = "none"
            }
            catch (e){
              //error block
            }
        }, 500)
        chrome.storage.local.get("rootObjectFromLS", function (result) {
            if (result !== null) {
              checkrootObjectFromLS(result)
            }
        })
    }

    // url on load
    var currentPage = window.location.href
    var intervalVCF = setInterval(function () {
        if (currentPage !== window.location.href) {
            // page has changed, set new page as 'current'
            currentPage = window.location.href
            if (window.location.hash === "#/visualCrawler") {
                addVcForm()
                clearInterval(intervalVCF)
            }
            try {
                document.getElementById('extn').style.display = "block"
                document.getElementById('noExtn').style.display = "none"
            }
            catch(e){
              //error block
            }
        }
    }, 500)

    // Visual append crawler form
    var vcFormSrc = chrome.extension.getURL("/src/views/vcForm.html")
    function addVcForm () {
        if (document.getElementById('vcFormDiv') === null) { // satya
            var vcFormContainer = document.createElement('div')
            vcFormContainer.setAttribute("id", "vcFormDiv")
            vcFormContainer.innerHTML = '<iframe id="vcForm" style="width: 100%;    height: 550px;    border: 0;" src="' + vcFormSrc + '"></iframe>'
            setTimeout(function () {
                document.getElementById('vcStartForm').appendChild(vcFormContainer)
            }, 100)
        }

        chrome.storage.local.set({
            "flagViewCMData": "false"
        }, function () {
            if (chrome.runtime.lastError) {
                return
            }
        })
    }
    if (document.readyState === "interactive" && document.location.hostname === window.location.hostname) {
        chrome.storage.local.get("rootObjectFromLS", function (result) {
            if (result !== null) {
                checkrootObjectFromLS(result)
            }
        })
    } else {
        chrome.storage.local.get("rootObjectFromLS", function (result) {
            if (result !== null) {
              checkrootObjectFromLS(result)
            }
        })
    }

    loadExtn()
//loading extension with all libraries//

    function loadExtn (jsonWithLogin = null) {
      setTimeout(function() {
        if (action === "roviWebScraperActive") {
            document.head.appendChild(appStyle)
            document.head.appendChild(messengerStyle)
            document.body.appendChild(jqueryRef)
            document.body.appendChild(messenger)
            var checkDocumentLoad = setInterval(function () {
                if (document.readyState === "complete") {
                    document.body.appendChild(iframeContainer)
                    document.body.appendChild(jqueryNoconflict)
                    document.body.appendChild(labelsContainer)
                    document.body.appendChild(modal)
                    document.body.appendChild(ajaxRequests)
                      document.body.appendChild(uiHandler)
                      document.body.appendChild(uiFunctionHandler)
                      document.body.appendChild(uiLoginHandler)
                      clearInterval(checkDocumentLoad)
                  }
              }, 1000)
          }
      }, 500)
    }

    //getting crawler management page view  data
    var sintr = setInterval(function () {
        var viewCMbutton = document.querySelectorAll('*[id^="view_"]')
        if (viewCMbutton.length !== 0) {
            for (var i = 0; i < viewCMbutton.length; i++) {
                viewCMbutton[i].addEventListener('click', function () {
                    var abc = unescape(this.getAttribute('data-json'))
                    chrome.storage.local.set({
                        "viewCMData": abc
                    }), function() {
                        return "ls storage set"
                    }

                    chrome.storage.local.get("viewCMData", function (result) {
                        if (result.viewCMData !== "null")
                        viewCMData = result.viewCMData
                    })

                    chrome.storage.local.set({
                        "flagViewCMData": "true"
                    }, function () {
                      //future implementation
                    })

                    var viewCMDataObj = JSON.parse(unescape(this.getAttribute('data-json')))
                    var viewVisitUrl = viewCMDataObj.config.matches[0].actualUrl
                    window.parent.location.replace(viewVisitUrl)
                })
            }
        }
    }, 500)
    function checkrootObjectFromLS (result) {
    if (result.rootObjectFromLS !== null && result.rootObjectFromLS.credential.userName.content !== "") {
        url = document.URL
        action = "roviWebScraperActive"
        loadExtn()
    }
  }

  var extractDomain = function (url) {
      var domain
      if (url.indexOf("://") > -1) {
          var domainParts = url.split('/')
          domain = domainParts[0] + "/" + domainParts[1] + "/" + domainParts[2]
      } else {
          domain = url.split('/')[0]
      }
      return domain
  }
}
