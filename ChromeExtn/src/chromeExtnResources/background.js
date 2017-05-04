chrome.browserAction.onClicked.addListener (function (tab) {
  chrome.tabs.executeScript(tab.id, { file: chrome.extension.getURL("src/chromeExtnResources/uijs.js") })
  alert(chrome.extension.getURL("src/chromeExtnResources/uijs.js"))
})
