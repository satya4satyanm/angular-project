
function getAttrName (str) {
    var firstIndex = str.lastIndexOf("[")
    var lastIndex = str.lastIndexOf("]")
    return str.substring(firstIndex + 1, lastIndex).split("=")[0]
}

function disableAllEventsOnThePage () {
    _$("a").click(function(e) {
        e.preventDefault()
    })
}

// check if element has href and return//
function fetchHrefAttr (elem) {
    hrefAttributes = []
    if (_$(elem).hasAttr("href")) {
        hrefAttributes.push({
            "name": "href",
            "value": _$(elem).attr("href")
        })
        return true
    } else {
        for (i = 0; i < elem.attributes.length; i++) { // check if element has href similar and return
            if (elem.attributes[i].name.indexOf("href") > -1) {
                hrefAttributes.push({
                    "name": elem.attributes[i].name,
                    "value": elem.attributes[i].value
                })
            }
        }
        if (hrefAttributes.length > 0) {
            return true
        } else {
            var allChildElements = _$(elem).find('*')
            for (i = 0; i < allChildElements.length; i++) {
                var attrs = allChildElements[i].attributes
                // check if it has href
                if (_$.inArray("href", attrs)) {
                    hrefAttributes.push({
                        "name": "href",
                        "value": _$(allChildElements[i]).attr("href")
                    })
                } else {
                    for (var j = 0; j < attrs.length; j++) {
                        if (attrs[j].name.indexOf("href") > -1) {
                            hrefAttributes.push({
                                "name": attrs[j].name,
                                "value": attrs[j].value
                            })
                        }
                    }
                }
            }
            if (hrefAttributes.length > 0) {
                return true
            } else {
                fetchHrefAttr(_$(elem).parent()[0])
            }
        }
    }
}

/* url pattern generation*/
function generateUrlPattern (urlValues, index, urlPatternString = "") {
    if (typeof urlValues[0] === "string") {
        for (i = 0; i < urlValues.length; i++) {
            urlValues[i] = urlValues[i].split('/')
        }
    }
    var array = []
    var urlPattern = (urlPatternString != "") ? urlPatternString : urlValues[0][0] + "/" + urlValues[0][1] + "/" + urlValues[0][2] + "/"
    var elementVal = urlValues[0][index] // shows
    var urlPatternFinalized = false
    for (i = 1; i < urlValues.length; i++) {
        if (urlValues[i][index] != elementVal) {
            urlPattern += ".*"
            array = urlPattern
            urlPatternFinalized = true
            break
        }
    }
    if (!urlPatternFinalized) {
        urlPattern += elementVal + "/"
        generateUrlPattern(urlValues, index + 1, urlPattern)
    }
    return urlPattern
}
//### ends url generation
