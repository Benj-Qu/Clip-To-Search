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

