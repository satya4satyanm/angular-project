//checking userLogin details//
function getUserLoginDetails (result) {
    var checkLoginRoute = 0
    var elementPresent = ''
    result = JSON.parse(result)[0]
    if (result !== null  && result.credential.userName.content !== "") {
        postActionObj = result.credential.postActions[0]
        preActionObj = result.credential.preActions[0]
        var postClickValue = postActionObj.value.slice(1)
        postClickValue = postClickValue.split(" ")[0]
        var preClickValue = preActionObj.value

        if (postActionObj.value.startsWith(".")) {
            elementPresent = document.getElementByClass(preClickValue)
        } else {
            elementPresent = document.getElementById(preClickValue)
        }
        if (elementPresent !== null || elementPresent !== undefined) {
        if (!window.location.hash && window.location.href != preActionObj.url &&  localStorage.getItem("loggedIn") === null ) {
          localStorage.setItem("loggedIn", true)
          window.location.href = preActionObj.url + "#loaded"

        }
        var userNameValue = result.credential.userName.value.split("=").pop().slice(0, -1)
        var passwordValue = result.credential.password.value.split("=").pop().slice(0, -1)

        userNameValue = userNameValue.replace(/'/g, '')
        passwordValue = passwordValue.replace(/'/g, '')
        if (result.credential.userName.value.startsWith("[class^=")) {
            document.getElementByClass(userNameValue).value = result.credential.userName.content
        } else {
            document.getElementById(userNameValue).value = result.credential.userName.content
        }
        if (result.credential.password.value.startsWith("[class^=")) {
            document.getElementByClass(passwordValue).value = result.credential.password.content
        } else {
            document.getElementById(passwordValue).value = result.credential.password.content
        }
        if (postActionObj.value.startsWith(".")) {
            document.getElementByClass(postClickValue).click()
        } else {

            document.getElementById(postClickValue).click()
        }
      }
    }
}

//checking login defination  status//
function checkLoginStatus (localStorePreActions) {
  if (localStorePreActions !== "null" && signinObject.password.content === "" && signinObject.userName.content === "") {
      changeTab(4)
      createLoginSubSession()
  } else {
      alerty.alert("Please validate or save the definition.", {title: 'Info', time:2222, okLabel: 'Ok'}, function(){})
      changeTab(3)
  }
}


//change for login start
function createLoginSubSession () {
    changeTab(4)
    _$("#loginTrackBtn").bind('click', function () {
        loginFlowComplete = false
        var selectedFAction = "click"
        var lastClicked
        var clickCount = 0
        if (selectedFAction == "click") {
            _$("*").click(function (e) {
                if (!_$(e.target).parents().is('#cntnr') && !_$(e.target).is('.tabs') && !_$(e.target).is('#loginTrackBtn')) {
                    loginElms = getPathTo(e.target)

                    _$(loginElms).bind('change', function (e) {
                      if (_$(loginElms).attr('type') === "text" || _$(loginElms).attr('type') === "email") {
                         preActionCount++
                         var capturText = _$(loginElms).val()
                         signinObject.userName.content = capturText
                         captureLoginUnP(loginElms, "#loginActionElemU")
                       }
                        if (_$(loginElms).attr('type') === "password") {
                            preActionCount++
                            var capturPassword = _$(loginElms).val()
                            signinObject.password.content = capturPassword
                            captureLoginUnP(loginElms, "#loginActionElemP")
                        }
                        localStorage.setItem('localStorePreActionsUrl', window.location.href)
                      })

                    var preActionFound = JSON.parse(localStorage.getItem('localStorePreActions'))
                    if (preActionCount === 0 && preActionFound === null) {
                       captureLoginUnP(loginElms, "#loginActionElemPre")
                       preActionCount++
                       _$("#toggle1").trigger("click")
                    }

                    lastClicked = loginElms
                    if (signinObject.password.content !== '' && signinObject.userName.content !== '' && clickCount === 0) {
                        clickCount++
                        localStorePostActions = {
                            "url": window.location.href,
                            "action": "click",
                            "value": lastClicked,
                            "type": "css selector"
                        }
                        signinObject.postActions.push(localStorePostActions)
                        preActionUrl = localStorage.getItem('localStorePreActionsUrl')
                        preActionsObjLocal = JSON.parse(localStorage.getItem('localStorePreActions'))
                        preActionsObjLocal["url"] = preActionUrl
                        signinObject.preActions.push(preActionsObjLocal)
                        localStorage.setItem('localStorePreActions', null)
                        iframe.contentWindow.postMessage([
                            'updaterootObject', signinObject
                        ], '*')

                        alerty.alert("Login details tracked successfully..! Please login to continue.", {title: 'Info', time:2222, okLabel: 'Ok'}, function () {})
                        changeTab(3)
                        _$('#loginBlock').hide()
                    }
                }
                _$('#elementwrapper').show()
            })
        }
    })
}

function captureLoginUnP (content, input) {
  var elms1
    if (content.startsWith(".")) {
        elms1 = "[class^='" + content.substring(1) + "']"
    } else if (content.startsWith("#")) {
        elms1 = "[id*='" + content.substring(1) + "']"
    }
    _$(input).val(elms1)
    if (input == "#loginActionElemU") {
        signinObject.userName.value = elms1
        signinObject.userName.content = _$(content).val()
    } else if (input == "#loginActionElemP") {
        signinObject.password.value = elms1
        signinObject.password.content  = _$(content).val()
    } else if (input == "#loginActionElemPre") {
        localStorePreActions = {
            "action": "click",
            "value": content.substring(1),
            "type": "css selector"
        }
        localStorage.setItem('localStorePreActions', JSON.stringify(localStorePreActions))
    }
}
//change for login end
