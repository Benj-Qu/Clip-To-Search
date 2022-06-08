document.getElementById("clr_btn").addEventListener("click", popup);

function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clear"});
   });
}
