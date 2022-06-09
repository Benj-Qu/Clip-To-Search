document.getElementById("clr_btn").addEventListener("click", popup);

let sendMessage = function (message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
    window.close();
}

function popup() {
    sendMessage({"message": "clear"})
}

let enableSelectionRectangle = function () {
    let rectangleColor = { r: 0, g: 50, b: 255, bgTransparency: 0.2, borderTransparency: 0.5 };
    sendMessage({ state: 'enable', rectangleColor: rectangleColor });
}

let disableSelectionRectangle = function () {
    sendMessage({ state: 'disable' });
}

document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, 
            { file: "selectionRectangle.js" },);
    });

    enableSelectionRectangle(color)
});
