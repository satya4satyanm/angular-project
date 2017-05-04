
//mouseover  and mouseout on pagelevel
function pageLevelMouseover () {

    _$("*").mouseover (function (e) {
        if ((_$(e.target).parents('.window').length > 0) || (_$(e.target).parents('#cntnr').length > 0) || (_$(e.target).parents('.alerty').length > 0) || (_$(e.target) == _$('.alerty') > 0) || (_$(e.target).parents('.label').length > 0) || (_$(e.target).attr('id') == "cntnr") || (_$(e.target).attr('class') == "label") || (_$(e.target).attr('id') == "collapse-right") || (_$(e.target).parents('#l1').length > 0) || _$(e.target).parents('.messenger').length > 0 || _$(e.target).attr('class') == "messenger" || (_$(e.target).parents('#collapse-right').length > 0)) {
          //ignore
        } else {
            _$(e.target).addClass("class-highlighter-red")
        }
    })    

    _$("*").mouseout(function(e) {
        _$(e.target).removeClass("class-highlighter-red")
    })
}
//ends mouseover  and mouseout on pagelevel

function enableLinks () {
    _$("a").each(function() {
        _$(this).attr("href", _$(this).attr("rel"))
        _$(this).removeAttr("rel")
    })
    return true
}

function disableLinks () {
    _$("a").each(function() {
        _$(this).attr("rel", _$(this).attr("href"))
        _$(this).attr("href", "javascript:;")
    })
    return true
}

//#############selector path and unique paths//
function CheckIdhasClass (element) {
  if((element.id !== '' && element.className.split(" ")[0]!="") || element.className.split(" ")[0]!=""){
      return '.' + element.className.split(" ")[0]
  }
  else{
    if(element.id ==""){
      return ""
    }else{
        return '#' + element.id
    }
  }
}

/* this should return the unique ID/class/path, if user is not satisfied with the selector he will enter regexp */
var getPathTo = function (element) {
    if (element.id !== '') {
        return '#' + element.id
    } else if (element.className.split(" ")[0] !== '' && element.className.split(" ")[0] !== 'class-highlighter' && element.className.split(" ")[0] !== 'class-highlighter-red') {
        if (element.parentNode.childNodes.length > 1) {
            nodeList = Array.prototype.slice.call(element.parentNode.childNodes)
            return CheckIdhasClass(element.parentNode) + ' ' + '.' + element.className.split(" ")[0]
        } else {
            return '.' + element.className.split(" ")[0] // use cases can be there for multiple class selector
        }
     }else {
        if (element.parentNode.childNodes.length > 1) {
            nodeList = Array.prototype.slice.call(element.parentNode.childNodes)
            var _index = nodeList.indexOf(element)
            return getPathTo(element.parentNode) + ' ' + element.tagName + ":nth-child(" + _index + ")"
        } else {
                return getPathTo(element.parentNode) + ' ' + element.tagName
        }
    }
}
/*getting unique path fro the selected element*/
var getUniquePath = function (node) {
    var parts = []
    var generatePath
    if (_$(node).parent().children().length > 1) {
        parts.push(node.tagName + ':nth-child(' + (_$(node).index() + 1) + ')')
    } else {
        parts.push(node.tagName)
    }
    _$(node).parents().each(function (index, element) {
        if (element.tagName == "BODY") {
            parts.push(element.tagName)
            generatePath = parts.join(' > ', parts.reverse())
            return generatePath
        } else {
            if (_$(element).parent().children().length > 1) {
                parts.push(element.tagName + ':nth-child(' + (_$(element).index() + 1) + ')')
            } else {
                parts.push(element.tagName)
            }
        }
    })
    return generatePath
}

// gets elements full path from the html body//
function getParentIdClassNameIfFoundMore (elem) {
  selectedElementPath = getPathTo(currentElement)
    if (_$(elem)[0].tagName == "BODY") {
        return ""
    } else {
        elem = _$(elem)
        if (elem.find(selectedElementPath).length > 1) {
            var getUPath = getUniquePath(_$(elem)[0])
            return getUPath
        } else {
            return getParentIdClassNameIfFoundMore(elem.parent())
        }
    }
}


// gets elements parent path from the html body//
function getParentIdClassNameIfFoundMore1 (elem) {
    selectedElementPath = ""
    selectedElementPath = getPathTo(currentElement)

    if (_$(elem)[0].tagName == "BODY") {
        return ""
    } else {
        elem = _$(elem)
		parent = elem.parent()
        if (parent.find(selectedElementPath).length > 1) {
            var getUPath = getUniquePath(_$(elem)[0])
            return getUPath
        } else {
            return getParentIdClassNameIfFoundMore(elem)
        }
    }

}

function highlightElements (type) {
    _$("#cntnr #resultOutput").html("")
    var urlValues = []
    try {
        _$(finalSelector.trim()).each(function() {
            _$(this).addClass(" class-highlighter")
            if (type == "link") {
                urlValues.push(_$(this).prop('href'))
            }
        })
        if (urlValues.length > 0) {
            urlPatterns.push(generateUrlPattern(urlValues, 3))
            localStorage.setItem("urlPatterns", JSON.stringify({
                p: urlPatterns
            }))
        }
    } catch (e) {
      //throw error
    }
}
