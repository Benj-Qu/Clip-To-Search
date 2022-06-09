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
            { file: "selectionRectangle.js" }, 
            function() {
                if (chrome.runtime.lastError) {
                    window.close();
                    alert("Sorry, this extension cannot be used on chrome:// URLs or on the Chrome Web Store. Please try again on a different page.");
                }
            });
    });

    let colors = ['yellow', 'blue', 'green', 'red', 'white', 'black'];

    for (let color of colors) {
        document.getElementById('color_'+color).addEventListener('click', () => enableSelectionRectangle(color));
    }

    document.getElementById('disable').addEventListener('click', disableSelectionRectangle);

});
