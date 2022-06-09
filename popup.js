document.getElementById("clr_btn").addEventListener("click", clear);

let sendMessage = function (message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
    window.close();
}

function clear() {
    sendMessage({"message": "clear"})
}

let enableSelectionRectangle = function (color) {

    let rectangleColor;

    switch (color) {
        case 'blue':
            rectangleColor = { r: 0, g: 50, b: 255, bgTransparency: 0.2, borderTransparency: 0.5 };
            break;
        case 'green':
            rectangleColor = { r: 0, g: 255, b: 0, bgTransparency: 0.25, borderTransparency: 0.6 };
            break;
        case 'red':
            rectangleColor = { r: 255, g: 0, b: 0, bgTransparency: 0.2, borderTransparency: 0.6 };
            break;
        case 'white':
            rectangleColor = { r: 255, g: 255, b: 255, bgTransparency: 0.2, borderTransparency: 0.6 };
            break;
        case 'black':
            rectangleColor = { r: 0, g: 0, b: 0, bgTransparency: 0.2, borderTransparency: 0.6 };
            break;
        default:
            rectangleColor = { r: 255, g: 255, b: 0, bgTransparency: 0.2, borderTransparency: 0.6 };
    }

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

