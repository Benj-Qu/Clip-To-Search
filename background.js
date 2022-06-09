
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
        tab.id, 
        { file: "rectangle.js" }, 
    );
    chrome.tabs.insertCSS(
        tab.id, 
        { file: "rectangle.css" }, 
    );
});