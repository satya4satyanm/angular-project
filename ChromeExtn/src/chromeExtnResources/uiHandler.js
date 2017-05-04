'use strict'
var mode = "dev"
if (mode === "prod") {
    _$("#devMode").hide()
}
var assetTypeObject = []
var pageObj = {}
var subsessionObj = {}
var editClicked = false
var stateManager = {}
var definitionType
var labelIndex = 0
var finalSelector = ""
var hrefAttributes = []
var localStorePreActions
var modal = document.getElementById('userModalPopup')
var validateModal = document.getElementById('userModalPopup1')
var btnClose = document.getElementById("btnClose")
var btnCloseTop = document.getElementById("btnCloseTop")
var selectedAssetType = ""
var selectedAssetSubType = ""
var urlPatterns = (localStorage.getItem("urlPatterns") != null) ? JSON.parse(localStorage.getItem("urlPatterns")).p : []
var typeOfElement = "link"
var assetTypeId = ""
var assetType=""
var selectedFn=""
var traceLoginUrl = ""
var loginElms = ""
var localStorePostActions = ""
var firstUrl = ""
var preActionCount = 0
var selectedElementPath = ""
var currentElement = null
var schemaName = ""
var reachedWithFewItems = false
var nodeList
var i, data, htmlValue
var content
var startPagination=false
var subSessions = {
  attributes : [],
  pagination : {},
}
var actionObject = {
    "action": "",
    "type": "css selector",
    "value": ""
}
var assetsObject={
  "assetType": "",
  "assetTypeID":"",
  "attributes": [],
  "preProcessor":{},
  "postProcessor":{}
}
var paginationPreProcessorObject={
  "paginationType":"",
  "value": "",
  "type": ""
}
var paginationPostProcessorObject={
  "attribute": "href",
  "value": "",
  "type": ""
}
var signinObject = {
    "preProcessor": [],
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
    "postActions": []
}
var attributeObj = {
  "name": "",
  "value": "",
  "type": "css selector",
  "attribute": "",
  "multiple": false,
  "id":"",
  "labelIndex": labelIndex,
  "preProcessor": [],
  "postProcessor": {
    "name": "",
    "multiOut": "",
    "parameters": {
    "param1": "",
    "param2": ""
      },
    "output": []
  }
}
var subSessionStorage = {}
var endQuestionIndex = ''
var subSessionFlowObj = {}
_$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined
}

function noscript (strCode) {
    var html = _$(strCode.bold())
    html.find('script').remove()
    return html.html()
}

var iframe = _$('#roviTiVoApp').find('iframe')[0]
if (!iframe) {
    iframe = _$('#roviTiVoApp')[0]
}
/* listining messages from extension*/
var boundIframeListener = function (e) {
    if (e.data[0] === 'definitionType' && e.data[1] === 'login') {
        definitionType = e.data[1]
        localStorage.setItem('definitionType', definitionType)
        roviCurrentQ = 0
        throwMessage()
    } else if (e.data[0] === 'stateManager') {
        definitionType = localStorage.getItem('definitionType')
        localStorePreActions = localStorage.getItem('localStorePreActions')
        if (definitionType === 'login') {
            checkLoginStatus(localStorePreActions)
        } else if (localStorage.getItem('localStorePreActions') != null) {
            alerty.alert('Please validate or save the definition.', {title: 'Info', time: 2222, okLabel: 'Ok'}, function () {})
            changeTab(3)
        } else {
            roviCurrentQ = 1
            stateManager = e.data[1]
            pageObj = stateManager.pages
            pageObj.push({
                "actualUrl": "",
                "mappingPaused": false,
                "assets": []
            })
            throwMessage()
        }
        localStorage.setItem('definitionType', '')
    }

    if (e.data[0] === "loginJSON") {
        var result = e.data[1]
        getUserLoginDetails(result)
    }

    if (e.data[0] === 'saveSuccess') {
        localStorage.clear()
        alerty.alert('Definition saved successfully.', {title: 'Info', time: 2222, okLabel: 'Ok'}, function () {})
    }

    if (e.data[0] === 'saveError') {
        alerty.alert('Definition save error.', {title: 'Info', time:  2222, okLabel: 'Ok'}, function () {})
    }

    if (e.data[0] === 'goBack') {
        localStorage.clear()
        alerty.confirm(
          'Data mapped till now will be lost. Would you like to proceed?',
          {title: 'Notes', cancelLabel: 'Cancel', okLabel: 'Confirm'},
          function (){
            //alerty.toasts('this is ok callback', {place: 'top'})
            iframe.contentWindow.postMessage([
                'goBackResponse'
            ], '*')
          },
          function () {
            //alerty.toasts('Please continue.')
          }
        )
    }

    if (e.data[0] === 'mouseOver') {
        _$("#span" + e.data[1]).addClass("class-highlighter")
    }
    if (e.data[0] === 'mouseOut') {
        _$("#span" + e.data[1]).removeClass("class-highlighter")
    }

    if (e.data[0] === 'editAttribute') {
        _$("#selectorVal").val(e.data[1].value)
        //_$("#assetType").val(e.data[1].assetType)
        //_$("#assetType").trigger("change")
          populateAsset()
        _$("#assetSubType").val(e.data[1].name)
    }

    if (e.data[0] === 'createLabels') {
        createlabels(e.data[1], e.data[2])
    }

    if (e.data[0] === 'clearValidateResult') {
        _$(".modal-body").empty()
        _$(".modal-body").text('Waiting for validation result..!')
    }
    // validate results binding //
    if (e.data[0] === 'validate') {
        _$(".modal-body").empty()
        var json = e.data[1]
        validateModal.style.display = "block"
        var kk = 0
        var array = []
        for (var k in json)
        {
            array.push(k)
            if (json[k].links != null) {
                if (json[k].links.length > 0) {
                    _$(".modal-body").append("<h5 class='validateHeader1'>" + k + "</h5>")
                }
                _$(".modal-body").append("<th class='validateHeader2'>" + "Links" + "</th>")
                _$(".modal-body").append('<table id="example_' + kk + '" class="display rowclass" cellspacing="0" width="100%"><thead><tr></tr></thead></table></br>')
                _$('#example_' + kk)
                    .removeClass('display')
                    .addClass('table table-striped')
                var tr
                tr = _$('<tr/>')
                _$('#example_' + kk).append(tr)
                _$('#example_' + kk + ' tr').addClass('rowborder')
                for (var i = 0; i < json[k].links.length; ++i) {
                    tr = _$('<tr/>')
                    tr.append('<td><span class="vlinks" style="font-size:15px">' + json[k].links[i] + '</span></td>')
                    _$('#example_' + kk)
                        .removeClass('display')
                        .addClass('table table-striped')
                    _$('#example_' + kk).append(tr)
                }
            }
            var splitedUrl
            _$(".vlinks").bind("mouseover", function (e) {
                var mouseoverUrl = _$(e.target).text()
                var windowUrl = (window.location.href).split('?')[0]
                var mouseOverUrlSplitArray = mouseoverUrl.split('/')
                var windowUrlSplitArray = windowUrl.split('/')
                mouseOverUrlSplitArray = _$(mouseOverUrlSplitArray).not(windowUrlSplitArray).get()
                splitedUrl = "/" + mouseOverUrlSplitArray.join('/')
                _$("[href*='" + splitedUrl + "']").css("outline", "3px solid #cdd827")
            })
            _$(".vlinks").bind("mouseout", function () {
                _$("[href*='" + splitedUrl + "']").css("outline", "none")
            })
            if (json[k].fields != null && json[k].fields[0] != null) {
                if (json[k].fields.length > 0) {
                    _$(".modal-body").append("<h5 class='validateHeader1'>" + k + "</h5>")
                }
                _$(".modal-body").append("<th class='validateHeader2'>" + "Fields" + "</th>")
                _$(".modal-body").append('<table id="example1_' + kk + '" class="display rowclass" cellspacing="0" width="100%"><thead><tr></tr></thead></table></br>')
                _$('#example1_' + kk)
                    .removeClass('display')
                    .addClass('table table-striped')
                var tr1
                tr1 = _$('<tr/>')
                _$('#example1_' + kk).append(tr1)
                _$('#example1_' + kk + ' tr').addClass('rowborder')
                for (var l in json[k].fields[0]) {

                    tr1.append("<th>" + l + "</th>")
                    _$('#example1_' + kk).append(tr1)
                }
                tr1 = _$('<tr/>')
                for (var data in json[k].fields[0]) {
                    tr1.append('<td><span class="vfields" style="font-size:15px">' + json[k].fields[0][data] + "</span></td>")
                    _$('#example1_' + kk)
                        .removeClass('display')
                        .addClass('table table-striped')
                    _$('#example1_' + kk).append(tr1)
                }
            }
            var mouseoverText
            var fieldMouseOver = []
            _$(".vfields").bind("mouseover", function (e) {
                mouseoverText = _$(e.target).text()
                _$('*').each(function () {
                    if (_$(this).text() === mouseoverText) {
                        fieldMouseOver.push(_$(this))
                    }
                })

                for (var i = 0; i < a.length; i++) {
                    if (fieldMouseOver[i].parents('#userModalPopup1').length < 1) {
                        _$(fieldMouseOver[i]).css("outline", "3px solid #cdd827")
                    }
                }
            }).bind("mouseout", function () {
                for (var i = 0; i < a.length; i++) {
                    _$((fieldMouseOver[i])).css("outline", "none")
                }
            })
            kk++
        }
    }
}
//ends validate results binding//

window.addEventListener('message', boundIframeListener, true)
var rightClickedElement = ""
var refreshedit = ""
var currentMatchIndexInUIHandler = null
var fullpath
var multipleSelector = []
var elementTreeHasA = false
var elementTreeHasImage = false
var editIndex, id, assetToAdd
//#################  sub session flow start
var currentSubsession = 'listing'
var roviCurrentQ = 0
var mandatoryFieldMapingState = false
var assetIdMappingInProgress = false
var assetTitleMappingInProgress = false
var paginationInActive = false
var scrollPaginationInActive = false
var prevStepId = 1
var currentAssetIndex = -1

//start Mapping //
_$("#start").click(function () {
    _$(this).hide()
    roviCurrentQ++
    throwMessage()
    _$("#div_Scheme").show()
})

// mandatatorty subsession flow //
  function createMandatoryAttributeSubSession () {
    _$("#subSessionContainer").show()
    _$("#subSessionControls").show()
    _$("#subSessionDone").show()
    mandatoryFieldMapingState = true
    if (roviCurrentQ === 3) {
        assetIdMappingInProgress = true
    } else if (roviCurrentQ === 4) {
        assetIdMappingInProgress = false
        assetTitleMappingInProgress = true
    }

    pageLevelMouseover()
    _$(document).bind("contextmenu", rightClick)
    pageObj[0].assets[currentAssetIndex].subSessions.mandatoryAttributes = {
        "active": true,
        "noOfAttributesMapped": 1
    }
    if (_$("#subsessionbtn").text().indexOf("Attributes") > -1) {
      //future implementation
    } else {
        var btn = _$('<button/>', {
            text: "Attributes",
            class: 'subSessionLabels active',
            click: function () {
              //click function
            }
        })
        _$("#subsessionbtn").append(btn)
        _$("#subSessionContent").empty()
    }

    _$("#subSessionDone").off('click').on("click", function () {

        roviCurrentQ++
        throwMessage()
        _$("#subSessionDone").off("click")

        if (stateManager.allQs[roviCurrentQ].callback != undefined) {
            var callback = stateManager.allQs[roviCurrentQ].callback
            window[callback]()
        }
    })
}
/*ends mandatory subsession */

/* Attribute creation  subsession*/
function createAttributeSubSession () {
    mandatoryFieldMapingState = false
    assetTitleMappingInProgress = false
    _$("#subSessionContainer").show()
    _$("#subSessionControls").show()
    _$("#subSessionDone").show()

    pageObj[0].assets[currentAssetIndex].subSessions.allAttributes = {
        "active": true,
        "noOfAttributesMapped": 1
    }

    if (stateManager.allQs[roviCurrentQ].yesMessage != "") {
        throwMessage(stateManager.allQs[roviCurrentQ].yesMessage, true)
    }

    $("#subSessionContainer .subSessionLabels.active").removeClass("active")
    if (_$("#subsessionbtn").text().indexOf("Attributes") > -1) {
      //future implementation
    } else {
        var btn = _$('<button/>', {
            text: "Attributes",
            class: 'subSessionLabels active',
            click: function () {
              //click function
            }
        })
        _$("#subsessionbtn").append(btn)
        _$("#subSessionContent").empty()
    }
    _$("#subSessionDone").off('click').on("click", function () {
        roviCurrentQ++
        throwMessage()
        _$("#subSessionDone").off("click")
    })
    _$("#subSessionDone").text("Done")
}
// ends Attribute creation //

/*detail subsesion */
function createDetailSubSession () {
    roviCurrentQ = 10
    throwMessage()
    if (_$("#subsessionbtn").text().indexOf("Attributes") > -1) {
      //future implementation
    } else {
        var btn = _$('<button/>', {
            text: "Attributes",
            class: 'subSessionLabels active',
            click: function () {
              //click function
            }
        })
        _$("#subsessionbtn").append(btn)
        _$("#subSessionContent").empty()
    }
    _$("#subSessionDone").bind("click", function () {
        roviCurrentQ++
        throwMessage()
        _$("#subSessionDone").unbind("click")
    })
}
//ends detail subsesion //

/*pagination subsession*/
function createPaginationSubSession () {
    startPagination = true
    _$("#subSessionContainer").show()
    _$("#subSessionControls").show()
    _$("#subSessionDone").show()
    pageObj[0].assets[currentAssetIndex].subSessions.pagination = {
        "active": true,
        "noOfAttributesMapped": 1
    }
    _$("#subSessionContainer .subSessionLabels.active").removeClass("active")
    if (_$("#subsessionbtn").text().indexOf("Pagination") > -1) {
      //future implementation
    } else {
        var btn = _$('<button/>', {
            text: "Pagination",
            class: 'subSessionLabels active',
            click: function () {
              //click function
            }
        })
        _$("#subsessionbtn").append(btn)
        _$("#subSessionContent").empty()
    }
    createdAttributesLabel = false
    createdPaginationLabel = false
    _$('.subSessionLabels').on('click', function (e) {


      if (_$(e.target).text() === 'Attributes') {

          //labelIndex = 1
          if (!createdAttributesLabel) {
            _$("#subSessionContent").empty()
            _$.each(subSessions.attributes, function (key, value) {
              paginationInActive = false
              createSubLabels (value.assetType, value.attributeVal, labelIndex, editClicked)
            })
           createdAttributesLabel = true
         }

      } else if (_$(e.target).text() === 'Pagination') {

        if (!createdPaginationLabel) {
          _$("#subSessionContent").empty()
          createSubLabels (subSessions.pagination.assetType, subSessions.pagination.attributeVal, labelIndex, editClicked)
          createdPaginationLabel = true
        }
      }
      createdAttributesLabel = false
      createdPaginationLabel = false
      changeSubAssetTab()
    })

    if (stateManager.allQs[roviCurrentQ].paginationType === "click") {
        throwMessage(stateManager.allQs[roviCurrentQ].yesMessage, true)
        _$("#subSessionDone").bind("click", function () {
            paginationInActive = false
            roviCurrentQ += 2
            throwMessage()
            _$("#subSessionDone").unbind("click")
            if (stateManager.allQs[roviCurrentQ].callback !== undefined) {
                var callback = stateManager.allQs[roviCurrentQ].callback
                window[callback]()
            }
        })
    } else if (stateManager.allQs[roviCurrentQ].paginationType === "scroll") {
        scrollPaginationInActive = true
        _$("#subSessionDone").bind("click", function () {
            scrollPaginationInActive = false
            roviCurrentQ++
            throwMessage()
            _$("#subSessionDone").unbind("click")

            if (stateManager.allQs[roviCurrentQ].callback !== undefined) {
                var callback = stateManager.allQs[roviCurrentQ].callback
                window[callback]()
            }
        })
    }
}
//ends pagination subsession //

function next () {
    roviCurrentQ++
    throwMessage()
    if (stateManager.allQs[roviCurrentQ].callback != undefined) {
        var callback = stateManager.allQs[roviCurrentQ].callback
        window[callback]()
    }
}

function nextEnd() {
    alerty.alert("Please validate or save the definition.", {title: 'Info', time: 2222, okLabel: 'Ok'}, function () {})
    changeTab(3)
}
/* new Asset creation*/
function createNewAsset () {
    _$("#div_Scheme").show()
    roviCurrentQ = 1
    throwMessage()
}
//ends//

/* throw messages based on question type */
function throwMessage (roviMsgtxt = "", nestedroviMsg = false) {
    var msg = (roviMsgtxt === "") ? stateManager.allQs[roviCurrentQ].q : roviMsgtxt

    if (nestedroviMsg) {
        alerty.alert(msg, {title: 'Info', time:2222, okLabel: 'Ok', backLabel: 'Back'}, function () {}) // implement back btn
    } else if(stateManager.allQs[roviCurrentQ].type == "Informative") {
      alerty.alert(msg, {title: 'Info', time:2222, okLabel: 'Ok', backLabel: 'Back'}, function () {})

      if (stateManager.allQs[roviCurrentQ].callback != undefined) {
          var callback = stateManager.allQs[roviCurrentQ].callback
          window[callback]()
      }

    } else if(stateManager.allQs[roviCurrentQ].type === "YesOrNo") {
      var ycb = stateManager.allQs[roviCurrentQ].yesCallback
      var ncb = stateManager.allQs[roviCurrentQ].noCallback
      alerty.confirm(
        msg,
        {title: 'Action Required', cancelLabel: 'No', okLabel: 'Yes'},
        function () {
          window[ycb]()
        },
        function () {
          window[ncb]()
        }
      )
    }
}
//###################  sub session flow end

iframe.contentWindow.postMessage([
    'visitUrl', window.location.href
], '*')

_$("a").each(function () {
    if (_$(this).parents('#cntnr').length < 1) {
        if (_$(this).attr("href") != undefined) {
            if (!(_$(this).attr("href").indexOf('javascript:') > -1)) {
                _$(this).attr("href", _$(this).attr("href"))
            }
        }
    }
})

//checks if it is  href element //
function checkElementHasA (elem) {
    if (_$(elem)[0].tagName === "A") {
        return true
    } else {
        if (_$(elem)[0].tagName === "BODY") {
            return false
        } else {
            return checkElementHasA(_$(elem).parent())
        }
    }
}

//checks if it is  src element //
function checkElementHasImage (elem) {
    if (_$(elem)[0].tagName === "IMG") {
        return true
    }
        return false
}

//##########ends selector path and unique paths//

/*page level label creation  */
function createLabelsStep2 (obj, currentMatchIndex, type) {
    if (type === "links") {
        _$('#labelsContainer').append('<span class="label" id="span' + obj.labelIndex + '" data-obj=""><span class="txt">' + assetToAdd + "  " + "Detail Url" + '</span><span class="edit">E</span><span class="delete">x</span></span>')

    } else {
        _$('#labelsContainer').append('<span class="label" id="span' + obj.labelIndex + '" data-obj=""><span class="txt">' + obj.name + '</span><span class="edit">E</span><span class="delete">x</span></span>')
    }

    _$("#span" + obj.labelIndex).css("position", "absolute")
    _$("#span" + obj.labelIndex).css("left", _$(obj.trainingElement).offset().left)
    _$("#span" + obj.labelIndex).css("top", _$(obj.trainingElement).offset().top)
    _$("#span" + obj.labelIndex + " .delete").attr("data-index", obj.labelIndex)
    _$("#span" + obj.labelIndex + " .edit").attr("data-index", obj.labelIndex)
    selectedAssetType = _$("#assetType").val()
    selectedAssetSubType = _$("#cntnr #assetSubType").val()
    _$("#span" + obj.labelIndex + " .delete").attr("data-fieldType", selectedAssetType + "---" + selectedAssetSubType)
    currentMatchIndexInUIHandler = currentMatchIndex
    _$("#span" + obj.labelIndex + " .edit").bind("click", function(e) {
        editIndex = _$(e.target).attr("data-index")
        id = _$(e.target).parent().attr("id")
        editClicked = true
        changeTab(1)
        iframe.contentWindow.postMessage([
            'Edit', editIndex, currentMatchIndexInUIHandler
        ], '*')
    })
    _$("#span" + obj.labelIndex + " .delete").bind("click", function (e) {
        var confirmFromUser = confirm("Are you sure to delete the mapped item?")
        if (confirmFromUser) {

            var assetType = _$(e.target).attr("data-fieldType").split("---")
            _$(e.target).parent().remove()
            var len_ = assetTypeObject.length
            for (var i = 0; i < len_; i++) {
                if ((assetTypeObject[i][0] === assetType[0]) && (assetTypeObject[i][1] === assetType[1])) {
                    assetTypeObject.splice(i, 1)
                    break
                }
            }
            var index = _$(e.target).attr("data-index")
            iframe.contentWindow.postMessage([
                'Remove', index, currentMatchIndex
            ], '*')
        }
    })
}
//##############   ends page level label creation  //

function createlabels (data, currentMatchIndex) {
    refreshedit = true
        if (data.actualUrl === window.location.href.split("?action=")[0]) {
        for (i = 0; i < data.fields.length; i++) {
            createLabelsStep2(data.fields[i], currentMatchIndex, "fields")
        }
        for (i = 0; i < data.links.length; i++) {
            createLabelsStep2(data.links[i], currentMatchIndex, "links")
        }
        labelIndex = data.links.length + data.fields.length
    }
}

function updateSelectorVal (target) {
    var path = getPathTo(target)
    var parentPath = getParentIdClassNameIfFoundMore(target)
    var _path = parentPath + " " + path
    _path = _path.trim()
    var index = multipleSelector.indexOf(_path)
    if (index < 0 || multipleSelector.length === 0) {
        multipleSelector.push(_path)
    } else {
      _$(_path).removeClass(" class-highlighter")
        multipleSelector.splice(index, 1)
    }
    if (multipleSelector.length > 1) {
        finalSelector = multipleSelector.join(",").trim()
    } else if(multipleSelector.length == 1) {
        finalSelector = multipleSelector[0]
    } else {
        finalSelector = ""
    }
}

/* right Click for an element*/
function rightClick (e) {
    e.preventDefault()
    e.stopPropagation()
    editClicked = false
    _$("#div_assetId").hide()
    var selectedElements
    currentElement = e.target

  	selectedElements =getParentIdClassNameIfFoundMore1(currentElement)
    fullpath = getUniquePath(currentElement)
  	var actualPath = compareFullpathSelectedElements(fullpath,selectedElements)
  	if(selectedElements != "") {
  		htmlValue = document.querySelector(actualPath)
  	}else{
  	    htmlValue=currentElement.parentElement
  	}

    if (_$(e.target).parents('.window').length > 0) {
      //ignore
    } else if (_$(e.target).parents('#cntnr').length > 0) {
      //ignore
    } else if (_$(e.target).parents('.label').length > 0) {
      //ignore
    } else if (_$(e.target).attr('id') === "cntnr") {
      //ignore
    } else if (_$(e.target).attr('class') === "label") {
      //ignore
    } else if (_$(e.target).attr('id') === "collapse-right") {
      //ignore
    } else if (_$(e.target).parents('#l1').length > 0) {
      //ignore
    } else if (_$(e.target).parents('.messenger').length > 0) {
      //ignore
    } else if (_$(e.target).attr('class') === "messenger") {
      //ignore
    } else if (_$(e.target).parents('#collapse-right').length > 0) {
      //ignore
    } else {
        _$("#devMode").show()
        if (startPagination) {
            fullpath = getUniquePath(currentElement)
            _$("#selectorVal").val(fullpath)
            _$("#div_Scheme1").hide()
            _$("#ok").text("Track Pagination")
            return
        }
        content = _$(e.target).text()
        elementTreeHasImage = checkElementHasImage(currentElement)
        if (!elementTreeHasImage) {
            elementTreeHasA = checkElementHasA(currentElement)
        }
        _$("#cntnrMap").empty()
        _$('#attributeTxt').empty()
        _$("#resultOutput").empty()
        _$("#actionElem").val("")
        var checkAssetType = _$('#assetType').val()
        if (checkAssetType !== 'select') {
            _$("#assetSubType").focus()
        }
        checkElementType()
        if (assetTitleMappingInProgress) {
            _$("#linksOrFieldsDropdown").val("fields")
            _$("#assetSubType").val("title")
        }
        if (assetIdMappingInProgress) {
          _$("#linksOrFieldsDropdown").val("fields")
          _$("#assetSubType").val("asset Id")
        }
        updateSelectorVal(e.target)
        highlightElements(typeOfElement)
        _$("#selectorVal").val(finalSelector.trim())
        if(_$("#assetSubType").val() == "asset Id" ){
                _$("#div_assetId").show()
      }
    }
}

function compareFullpathSelectedElements (Fpath, Selements) {
	var FpathArray = Fpath.split(" > ")
	var SelementsArray = Selements.split(" > ")
	var SelementsLength = SelementsArray.length
	var elementpath = Selements + " > " + FpathArray[SelementsLength]
	return elementpath
}

function checkElementType () {
    if (elementTreeHasImage) {
        typeOfElement = "image"
        _$("#linksOrFieldsDropdown").val("images")
        _$("#assetSubType").val("image")
        _$("#functionWraper").hide()
        _$(".splitWraper").hide()
        _$("#div_Scheme").hide()
        if (!paginationInActive) {
            _$("#div_Scheme1").show()
        }
    } else if (elementTreeHasA) {
        typeOfElement = "link"
        _$("#linksOrFieldsDropdown").val("links")
        _$("#assetSubType").val("url")
        _$("#functionWraper").hide()
        _$(".splitWraper").hide()
        _$("#div_Scheme").hide()
        if (!paginationInActive) {
            _$("#div_Scheme1").show()
        }
    } else {
        typeOfElement = "text"
        _$("#linksOrFieldsDropdown").val("fields")
        _$("#functionWraper").show()
        //_$("#div_Scheme").show()
        if (!paginationInActive) {
            _$("#div_Scheme1").show()
        }
    }
}


if (typeof(Storage) !== "undefined" || typeof(Storage) !== null) {
    localStorage.setItem("trainingUrlTracked", "false") // Verify the use of this var
}

function createSubLabels (assetToAdd, assetSubValue, labelIndex, editClicked) {

  if (paginationInActive) {
      _$("#subSessionContent").append('<div id="ssLabels_' + labelIndex + '">' + assetToAdd + " " + "pagination " + '</div>')

  } else {
    if (_$("#linksOrFieldsDropdown").val() === "links") {
        if (editClicked === false) {
            _$("#subSessionContent").append('<div id="ssLabels_' + labelIndex + '">' + assetToAdd + " " + assetSubValue + '</div>')
        }
        else {
            _$("#ssLabels_" + editIndex).text(assetToAdd + " " + assetSubValue)
        }
    } else {
        if (editClicked === false) {
            _$("#subSessionContent").append('<div id="ssLabels_' + labelIndex + '">' + assetToAdd + " " + assetSubValue + '</div>')
        } else {
            _$("#ssLabels_" + editIndex).text(assetToAdd + " " + assetSubValue)
        }
    }
  }
}
/* Adding links and fields attributes and updates Json object */
_$("#ok").click(function () {
    var assetSubValue = _$("#cntnr #assetSubType").val()
    var dropdownValue = _$("#linksOrFieldsDropdown").val()
    if (assetSubValue !== 'select' || paginationInActive || scrollPaginationInActive || startPagination==true) {
        _$("#div_Scheme1").show()
        _$("#ok").text("Add Attribute")
        _$(".class-highlighter-yellow").removeClass("class-highlighter-yellow")
        assetToAdd = pageObj[0].assets[currentAssetIndex].assetTitle

        createSubLabels (assetToAdd, assetSubValue, labelIndex, editClicked)
        if (paginationInActive) {
          subSessionStorageData (roviCurrentQ, assetToAdd, 'pagination', 'pagination')
        } else {
          subSessionStorageData (roviCurrentQ, assetToAdd, assetSubValue, 'attributes')
        }
        if (editClicked === false) {
            checkEditClicked(false,dropdownValue)
        }

        _$("#devMode").hide()
        // iframe.contentWindow.postMessage([
        //     'updatePageObj', pageObj
        // ], '*')
        assetType = _$("#assetType").val()
        assetTypeId = _$('#assetType option:selected').attr('data-assettypeid')
        checklinkOrField(dropdownValue)
        /*  edit functionality  for matches*/
        if (editClicked === true) {
          checkEditClicked(true,dropdownValue)
        } else if (_$("#selectorVal").val() != "") {
            if (localStorage.getItem("trainingUrlTracked") === "false") {
                localStorage.setItem("trainingUrlTracked", "true") // set this to false when that item label is deleted, remove trainingUrl
            }
            assetsObject.assetType = assetType
            assetsObject.assetTypeID = assetTypeId
            iframe.contentWindow.postMessage([
                'addMatch', window.location.href, JSON.parse(localStorage.getItem("urlPatterns")), assetsObject
            ], '*')
            schemaName = _$("#cntnr .schemaName").val()

            /* label creation in configuration tab*/
            _$('#labelsContainer').append('<span class="label" id="span' + labelIndex + '" data-obj=""><span class="txt">' + assetToAdd + "  " + _$("#cntnr #assetSubType").val() + '</span><span class="edit">E</span><span class="delete">x</span></span>')

            _$("#span" + labelIndex).css("background-color", "rgba(0, 0, 0, 0.65);")
            _$("#span" + labelIndex).css("left", _$(currentElement).offset().left)
            _$("#span" + labelIndex).css("top", _$(currentElement).offset().top)
            _$("#span" + labelIndex + " .delete").attr("data-index", labelIndex)
            _$("#span" + labelIndex + " .edit").attr("data-index", labelIndex)

            selectedAssetType = _$("#assetType").val()
            selectedAssetSubType = _$("#assetSubType").val()

            _$("#span" + labelIndex + " .delete").attr("data-fieldType", selectedAssetType + "---" + selectedAssetSubType)

            _$(".class-highlighter").removeClass("class-highlighter")

            _$("#span" + labelIndex + " .edit").bind("click", function (e) {
                _$("#devMode").show()
                editIndex = _$(e.target).attr("data-index")
                id = _$(e.target).parent().attr("id")
                editClicked = true
                changeTab(1)
                iframe.contentWindow.postMessage([
                    'Edit', editIndex, null
                ], '*')
            })

            //ends edit //
            /* deletes created labels from page level,configuration tab and from json object*/
            _$("#span" + labelIndex + " .delete").bind("click", function (e) {
                var confirmFromUser = confirm("Are you sure to delete the mapped item?")
                if (confirmFromUser) {
                    var assetType = _$(e.target).attr("data-fieldType").split("---")
                    _$(e.target).parent().remove()
                    editIndex = _$(e.target).attr("data-index")
                    _$("#ssLabels_" + editIndex).remove()
                    var len_ = assetTypeObject.length
                    for (var i = 0; i < len_; i++) {
                        if ((assetTypeObject[i][0] === assetType[0]) && (assetTypeObject[i][1] === assetType[1])) {
                            assetTypeObject.splice(i, 1)
                            break
                        }
                    }
                    iframe.contentWindow.postMessage([
                        'Remove', _$(e.target).attr("data-index"), null
                    ], '*')


                }
            })
            if((paginationInActive || scrollPaginationInActive) && _$("#actionType").val() !== "select" && startPagination === true) {
            iframe.contentWindow.postMessage([
                'addPagination', paginationPreProcessorObject, 'preObj'
            ], '*')
            }
            else if ((!paginationInActive || !scrollPaginationInActive) && _$("#actionType").val() === "select" && startPagination === true) {
              iframe.contentWindow.postMessage([
                  'addPagination', paginationPostProcessorObject, 'postObj'
              ], '*')
            }
            //ends delete//
            assetTypePush()
            bindLinkOrField()
            _$('#assetSubType').val('select')
            _$('#linksOrFieldsDropdown').val('links')
            _$(".splitWraper").hide()
            _$("#SplitError").hide()
            _$('#selectorVal').val('')
            _$('#actionType').val('select')
            _$('a').unbind("click.myDisable")
            _$('#loginActionType').val('select')
            _$('#loginActionElem').val('')
            labelIndex++
        }
        localStorage.setItem("pageObj", JSON.stringify(pageObj))
        multipleSelector = []
    } else {
        alerty.alert("Please select attribute name before adding", {title: 'Info', time:2222, okLabel: 'Ok'}, function () { })
    }
})

// checks edit click is true or false//
function checkEditClicked (editClicked, dropdownValue) {
  if (editClicked === false) {
      _$("DIV[id^='ssLabels_']").bind("mouseover", function (e) {
          var index = _$(e.target).attr("id").split("ssLabels_")[1]
          _$("#span" + index).addClass("class-highlighter")
      })
      _$("DIV[id^='ssLabels_']").bind("mouseout", function (e) {
          var index = _$(e.target).attr("id").split("ssLabels_")[1]
          _$("#span" + index).removeClass("class-highlighter")
      })
  }
  else if (editClicked === true) {
    assetType = _$("#assetType").val()
    var value = _$("#selectorVal").val()
    if (dropdownValue === "fields") {
        name = _$("#cntnr #assetSubType").val()
        var ii = _$('#' + id).find(".txt")
        _$(ii).text(name)
    } else {
        name = _$("#cntnr #assetSubType").val()
    }
    //Update matches
      iframe.contentWindow.postMessage([
          'updateMatch', window.location.href, assetType, name, value, dropdownValue, editIndex, currentMatchIndexInUIHandler
      ], '*')
  }
}

//map links and fields to respective objects//
function checklinkOrField (dropdownValue) {

      attributeObj.name = _$("#assetSubType").val()
      attributeObj.type = "css selector"
      attributeObj.value = _$("#selectorVal").val()
      attributeObj.labelIndex = labelIndex
      if (_$('#assetSubType').val() === "image") {
          attributeObj.attribute = "src"
      } else if (_$('#assetSubType').val() === "url") {
          attributeObj.attribute = "href"
      } else {
          attributeObj.attribute = ""
      }

      //action click start
      actionObject.action = _$("#actionType").val()
      actionObject.value = _$("#actionElem").val()
      if (_$("#linksOrFieldsDropdown").val() === "fields" && _$("#actionElem").val() !== "" && _$("#actionType").val() === "click") {
          attributeObj.preProcessor.push(actionObject)
      }
      //action click end
      if (_$("#linksOrFieldsDropdown").val() === "fields" && _$("#actionType").val() === "scroll") {
          actionObject.action = "Scrolldown"
          attributeObj.preProcessor.push(actionObject)
      }
   else {
      attributeObj.value = _$("#selectorVal").val()
      attributeObj.name = _$("#assetSubType").val()
      if (_$("#linksOrFieldsDropdown").val() === "links" && _$("#actionElem").val() !== "" && _$("#actionType").val() === "click") {
          attributeObj.preProcessor.push(actionObject)
      }
      if (_$("#linksOrFieldsDropdown").val() === "links" && _$("#actionType").val() === "scroll") {
          actionObject.action = "Scrolldown"
          attributeObj.preProcessor.push(actionObject)

      }

      if (_$('#assetSubType').val() === "image") {
          attributeObj.attribute = "src"
      } else if (_$('#assetSubType').val() === "url") {
          attributeObj.attribute = "href"
      } else {
          attributeObj.attribute = ""
      }

      if (paginationInActive && _$("#actionType").val() != "select") {
          attributeObj.paginate = true
          paginationPreProcessorObject.paginationType = "click"
          paginationPreProcessorObject.value = _$("#selectorVal").val()
          paginationPreProcessorObject.type = "css selector"
      } else if (scrollPaginationInActive && _$("#actionType").val() != "select") {
          // add scroll pagination code here
          attributeObj.paginate = true
          paginationPreProcessorObject.paginationType = "scroll"
          paginationPreProcessorObject.value = ""
          paginationPreProcessorObject.type = ""
      }
      else if (_$("#actionType").val() === "select") {
        attributeObj.paginate = true
        paginationPostProcessorObject.attribute = "href"
        paginationPostProcessorObject.value = _$("#selectorVal").val()
        paginationPostProcessorObject.type = "css selector"
      }
  }

}

/* based on linksOrFieldsDropdown value adding links or fields or images:posting message to extn*/
        function bindLinkOrField (){
          if (_$("#linksOrFieldsDropdown").val() === "images") {
                attributeObj.attribute = "src"
              }
              else if(_$("#linksOrFieldsDropdown").val() === "links"){
                attributeObj.attribute = "href"
              }
              else{
                attributeObj.attribute = ""
              }
              if(!paginationInActive && !scrollPaginationInActive && startPagination === false) {
                  iframe.contentWindow.postMessage([
                      'addAttribute', attributeObj
                  ], '*')
                }

            }

//binding assetTypeId and attributeId
_$("#assetType").change(function () {
    assetTypeId = _$('#assetType option:selected').attr('data-assettypeid')
    assetType = _$('#assetType').val()
})

var attributeId = ""
_$(".assetSubType").change(function () {
    var attributeId = _$('.assetSubType option:selected').attr('data-attributeId')
    attributeObj.name=_$("#cntnr #assetSubType").val()
	if(attributeId === "102"){
		_$("#div_assetId").show()
	}else{
		_$("#div_assetId").hide()
	}
})
var btnViewElementSource = document.getElementById("viewElementSource")
var attributeName
var attributeNameValue
btnViewElementSource.onclick = function() {
    _$(document).unbind("contextmenu", rightClick)
    modal.style.display = "block"
    document.getElementById("myModalLabel").innerHTML = 'Element Source'
    var source = htmlValue.outerHTML


    // This is for comparing two html tree elements
    var htm1 = _$.parseHTML(source)
    _$(htm1).find("*").each(function() {
    	console.log(this.nodeName)
    })


    source = source.replace(/</g, "&lt").replace(/>/g, "&gt")
    //now we add <pre> tags to preserve whitespace
    source = "<pre class='htmlValueSource'>" + source + "</pre><div id='attributeDetails'></div>"
    _$(".modal-body").empty()
    _$(".modal-body").append(source)
    _$(".htmlValueSource").hover(function() {
        _$(this).css({
            "outline": "0px solid red",
            "outline-offset": "0px"
        })
    })
    _$(".htmlValueSource").click(function(e) {
        _$(".modal-body #attributeDetails").empty()
        var s = window.getSelection()
        var range = s.getRangeAt(0)
        var node = s.anchorNode
        while (range.toString().indexOf('<') != 0) {
            range.setStart(node, (range.startOffset - 1))
        }
        range.setStart(node, range.startOffset)
        do {
            range.setEnd(node, range.endOffset + 1)
        } while (range.toString().indexOf(">") < 0)
        var str = range.toString().trim()
        if (str.indexOf('<') > -1 || str.indexOf('>') > -1 && str !== "") {

          var htm = _$.parseHTML( str )
          var nodeName = htm[0].nodeName
          var nodeAttrs = htm[0].attributes
          var elementSelector = finalSelector + " " + nodeName + "[" + nodeAttrs + "]"
          console.log(nodeName + "  " + nodeAttrs + " " + elementSelector)
          _$(".modal-body #attributeDetails").append("<p style='margin-bottom:0px !important;'>Displayed Data:")

          _$(".modal-body #attributeDetails").append("<p style='margin-bottom:0px !important;'><input type='checkbox' value='text'/> " + _$(htm[0]).text() + "</P>")

          _$(".modal-body #attributeDetails").append("<p style='margin-bottom:0px !important;'>Attributes:")

          _$.each(nodeAttrs, function() {
              _$(".modal-body #attributeDetails").append("<p style='margin-bottom:0px !important;'><input type='checkbox' value='"+ this.name + ":" + this.value + "'/> " + this.name + ": " + this.value + "</P>")
          });

          //_$(".modal-body #attributeDetails").append("<div><p style='color:red;'>Wrong selection!</p></div>")
        } else {
          console.log("Node selector error");
            // var strSplit = str.split("=")
            // attributeName = strSplit[0]
            // attributeNameValue = strSplit[1].replace(/\"/g, "")
            // if (strSplit.length > 2) {
            //     for (var i = 2; i < strSplit.length; i++) {
            //         attributeNameValue = attributeNameValue + strSplit[i].replace(/\"/g, "")
            //     }
            // }
            // //alert("Attribute Name : "+ attributeName+ " && Attribute Value : " + attributeNameValue)
            // if (attributeNameValue != '') {
            //     _$(".modal-body #attributeDetails").append("<div><p>Attribute Name: " + attributeName + "<p/><p> Value : " + attributeNameValue + "</p></div><button type='button' class='btn-blue' id='attributeMappingConfirmation' >Ok</button>")
            // } else {
            //     _$(".modal-body #attributeDetails").append("<div><p style='color:red'>Wrong selection!</p></div>")
            // }
            // _$(".modal-body").on("click", "#attributeMappingConfirmation", function() {
            //     _$("#attributeName").val(attributeName)
            //     _$("#attributeValue").val(attributeNameValue)
            //     modal.style.display = "none"
            //     _$(document).bind("contextmenu", rightClick)
            // })
        }
    })
}

var loginFlowComplete = false
_$("#close,#iconClose").click(function () {
    _$('#validateModal').modal('hide')
})

/*Mapping functions  starts*/
_$('.fnDropdown').bind('change', function () {
    selectedFn = _$(".fnDropdown").find("option:selected").text()
    if (selectedFn === "Select a function") {
        _$("#delimiterWrapper").hide()
        _$(".splitWraper").hide()
        _$("#subSrtingWraper").hide()
        _$("#SplitError").hide()
    }
    fnDropdown()
})

function fnDropdown () {
    selectedFn = _$(".fnDropdown").find("option:selected").text()
    if (selectedFn === "Select a function") {
        attributeObj.postProcessor.name = ""
    }
    //code for split function
    if (selectedFn === "split") {
        _$('<br/><div id="delimiterWrapper"><span class="formLabel">Delimiter:</span><input id="delimiter" name="input[]"  type="text"></input></div>').insertAfter(".fnDropdown")
        var string, delimiter
        _$('#delimiter').change(function (e) {
            delimiter = _$("#delimiter").val()
            _$("#SplitError").hide()
            var  stringContent = content.trim() // remove multiple spaces in between

            attributeObj.postProcessor.parameters.param1 = stringContent
              attributeObj.postProcessor.parameters.param2 = delimiter
            if (delimiter.length !== 0 && delimiter !== "undefined" && delimiter !== null) {
                var postData = {
                    string: stringContent,
                    delimeter: delimiter
                }
                 attributeObj.postProcessor.name = selectedFn
                 response = splitApi(splitFunction, postData, selectedFn)

            }
        })

    }
}

function splitFunction (response, selectedFn) {
response = eval(response)
var length = response['output'].length
if (length > 1)
  attributeObj.postProcessor.multiOut = selectedFn
if (response['output'] === "split function can't be applied") {
    _$(".ok").css('opacity', '0.6')
    _$(".ok").prop("disabled", true)
    _$('<div id="SplitError" style=color:red;>Split function can not be applied on this element.</div>').insertAfter("#delimiterWrapper")
} else {
    _$(".ok").css('opacity', '1.0')
    for (var i = 0; i < length; i++) {
        _$('<div id="' + i + '" class="splitWraper" style="margin-top:3px;"><select class="test" id="splituserval' + i + '" name="input[]"  type="text" style="width:100px; margin-right:5px;"></select><input id="splitdata' + i + '" class="splitDisabled" style="width:100px" value="' + response['output'][i] + '"></input></div>').insertAfter("#functionBlock")
        _$(".splitDisabled").prop('disabled', true)
        attributeObj.postProcessor.output.push({
            "name": "",
            "index": i
        })
    }
}

_$(".assetSubType option").clone(true).appendTo("select.test")
_$("select.test").bind('change', function () {
    attributeObj.postProcessor.output[_$(this).parent().attr("id")].name = _$(this).val()
})

_$(".assetType").bind('change', function () {
    _$('select.test option').remove()
    _$(".assetSubType option").clone(true).appendTo("select.test")
})
}
// ends mapping functions

_$(document).ready(function () {
    populateAsset()
    setTimeout(function () {
        _$('body').append(_$('.messenger'))
    }, 1000)
    // post a roviMsg with window url
})

_$(window).ready(function () {
    setTimeout(function () {
        iframe.contentWindow.postMessage([
            'currentPageUrl', window.location.href
        ], '*')
    }, 500)
})
//populate the assets
function populateAsset(){
  data = getFieldApi(populateAssetApiResult)
}

//called from the ajax file
function populateAssetApiResult(data) {
  for (var i = 0; i < data.assets.length; i++) {
      var div_data = "<option value=" + data.assets[i].name + " data-assettypeid=" + data.assets[i].assetTypeID + ">" + data.assets[i].name + "</option>"
      _$(div_data).appendTo('.assetType')
  }
  _$('#assetType').bind('change', function () {
      selectedAssetType = _$('.assetType').val()
      _$('.assetSubType option').not(':first').remove()
      for (var i = 0; i < data.assets.length; i++) {
          if (data.assets[i].name === selectedAssetType) {
              for (var j = 0; j < data.assets[i].fields.length; j++) {
                  var div_data1 = "<option value='" + data.assets[i].fields[j][0] + "' data-attributeId='" + data.assets[i].fields[j][1] + "'>" + data.assets[i].fields[j][0] + "</option>"
                  _$(div_data1).appendTo('.assetSubType')
              }
          }
      }
  })
}
//ends binding values to Asset type dropdown

//hide and show for function wrapper on dropdown select.
_$("#linksOrFieldsDropdown").bind('change', function () {
    if (_$("#linksOrFieldsDropdown").val() === "fields") {
      //ignore
    } else {
        _$(".splitWraper").hide()
    }
})


// modal window //

btnClose.onclick = function () {
    modal.style.display = "none"
    _$(document).bind("contextmenu", rightClick)
}
btnCloseTop.onclick = function () {
    modal.style.display = "none"
    _$(document).bind("contextmenu", rightClick)
}

function assetTypePush () {
    selectedAssetType = _$("#assetType").val()
    selectedAssetSubType = _$("#assetSubType").val()

    if (selectedAssetType !== "select" && selectedAssetType !== "") {
        assetTypeObject.push([selectedAssetType, selectedAssetSubType])
    }
}
/* if asset Type changes*/
_$("#div_Scheme").bind('change', function  () {
    selectedAssetType = _$("#assetType").val()
    if (_$.inArray(selectedAssetType, assetTypeObject[selectedAssetType]) < 0) {
        _$("#assetType").removeClass(".error")
        _$(".ok").prop("disabled", false)
        _$(".ok").css('opacity', '1.0')
    } else {
        _$("#assetType").addClass(".error")
        _$(".ok").prop("disabled", true)
        _$(".ok").css('opacity', '0.6')
        alerty.alert("Selected combination is already defined in schema.", {title: 'Info', time:2222, okLabel: 'Ok'}, function () {})
    }
})

_$("#div_Scheme1").bind('change', function () {
    selectedAssetType = _$("#assetType").val()
    selectedAssetSubType = _$("#assetSubType").val()
    var fieldAlreadyMaped = false
    var len = assetTypeObject.length
    for (var i = 0; i < len; i++) {
        if ((assetTypeObject[i][0] === selectedAssetType) && (assetTypeObject[i][1] === selectedAssetSubType)) {
            fieldAlreadyMaped = true
            break
        }
    }
    if (fieldAlreadyMaped === false) {
        _$("#assetSubType").removeClass(".error")
        _$(".ok").prop("disabled", false)
        _$(".ok").css('opacity', '1.0')
    } else {
        _$("#assetSubType").addClass(".error")
        _$(".ok").prop("disabled", true)
        _$(".ok").css('opacity', '0.6')
        alerty.alert("Selected combination is already defined in schema.", {title: 'Info', time:2222, okLabel: 'Ok'}, function () {})
    }
})
//assetType check logic End

//Action logic start
_$("#actionType").bind('change', function () {
     var selectedFAction= _$("#actionType").find("option:selected").val()
    if (selectedFAction === "click") {
      paginationInActive=true
        _$("*").click(function(e) {
            if (!_$(e.target).parents().is('#cntnr') && !_$(e.target).is('.stepNumber')) {
                var elms = getPathTo(e.target)
                var elms1 = elms.startsWith(".")
                _$('#actionElem').val("")
                if (elms.startsWith(".")) {
                    elms1 = "[class^='" + elms.substring(1) + "']"
                    _$('#actionElem').val(elms1)
                } else if (elms.startsWith("#")) {
                    elms1 = "[id*='" + elms.substring(1) + "']"
                    _$('#actionElem').val(elms1)

                }
            }
            _$('#actionElem').show()
            _$('#elementwrapper').show()
        })
    }
    else if (selectedFAction === "scroll") {
      scrollPaginationInActive=true
        _$('#actionElem').val('')
        _$('#elementwrapper').hide()
    }
    else{
      selectedFAction="select"
      scrollPaginationInActive=false
      paginationInActive=false
    }
})


var windows = document.querySelectorAll('.window');
[].forEach.call(windows, function (win) {
    var title = win.querySelector('.titlebar')
    title.addEventListener('mousedown', function (evt) {
        // Record where the window started
        var real = window.getComputedStyle(win),
            winX = parseFloat(real.left),
            winY = parseFloat(real.top)
        // Record where the mouse started
        var mX = evt.clientX,
            mY = evt.clientY
        // When moving anywhere on the page, drag the window
        // …until the mouse button comes up
        document.body.addEventListener('mousemove', drag, false)
        document.body.addEventListener('mouseup', function () {
            document.body.removeEventListener('mousemove', drag, false)
        }, false)
        // Every time the mouse moves, we do the following
        function drag (evt) {
            // Add difference between where the mouse is now
            // versus where it was last to the original positions
            win.style.left = winX + evt.clientX - mX + 'px'
            win.style.top = winY + evt.clientY - mY + 'px'
        }
    }, false)
})


//assetType check logic End

//Chrome extension tab//

function changeTab (n) {
    _$("#step-" + prevStepId + "-c").css("display", "none")
    _$("#th" + prevStepId).removeClass("selected")
    _$("#step-" + n + "-c").css("display", "block")
    _$("#th" + n).addClass("selected")
    prevStepId = n
}
_$('.subsessionWidget .header').click(function () {
    _$(this).next().toggle()
})


_$("#addAsset").click(function () {
    _$("#devMode").hide()
    _$("#AssetIdSelectorVal").val('')
    _$("#AssetTitleSelectorVal").val('')
    _$("#subsessionbtn").empty()
    _$("#subSessionContent").empty()
    _$("#subSessionDone").hide()
    currentAssetIndex++
    pageObj[0].assets.push({
        "assetTitle": _$("#assetType").val(),
        "activeAsset": true,
        "currentSubSession": "listing",
        "roviCurrentQ": 1,
        "subSessions": {}
    })

    var assetsMapped = _$("#assetTypeContainer").text()
    assetToAdd = _$("#assetType").val()
    if (assetsMapped.indexOf(assetToAdd) < 0 && _$("#assetType").val() != "select") {
        _$("#assetTypeContainer").show()
        _$("#div_Scheme").hide()
        _$(".assetSSContainer").show()
        _$("#assettypebtn .assetTypeLabels.active").removeClass("active")
        _$("#subSessionContainer").hide()

        // change the current asset code
        var assetTypeBtn = _$('<button/>', {
            text: _$("#assetType").val(),
            class: 'assetTypeLabels active',
            click: function () {
                loadAssetDetails(_$(this).text())
                changeAssetTab()
            }
        })
        _$("#assettypebtn").append(assetTypeBtn)

        roviCurrentQ++
        throwMessage()

    } else {
        alerty.alert("Asset is already added or you have not selected any asset.", {title: 'Info', time: 2222, okLabel: 'Ok'}, function () {})
    }
})

function changeAssetTab () {
    _$('.assetTypeLabels').add('active')
        .toggleClass("assetTypeLabels").toggleClass("assetTypeLabels active")
}

function changeSubAssetTab () {
    _$('.subSessionLabels').toggleClass("subSessionLabels").toggleClass("subSessionLabels active")
}

function loadAssetDetails (str) {
    _$("#assetDetails").find("legend").text(str)
}

function subSessionStorageData (roviCurrentQ, assetToAdd, assetSubValue, attributeType) {
    if (subSessions.attributes.length > 0) {
      endQuestionIndex = subSessions.attributes[subSessions.attributes.length - 1]['startQuestionIndex']
    } else {
      endQuestionIndex = roviCurrentQ
    }
    subSessionFlowObj = {
     'assetType' : assetToAdd,
     'attributeVal' : assetSubValue,
     'startQuestionIndex' : roviCurrentQ,
     'endQuestionIndex' : ''
    }
    if (attributeType === 'attributes') {
      subSessionFlowObj.endQuestionIndex = endQuestionIndex
      subSessions.attributes.push(subSessionFlowObj)
    } else {
      subSessions.pagination = subSessionFlowObj
    }

    localStorage.setItem('subSessions', subSessions)
}
