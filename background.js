console.log("background running")
chrome.commands.onCommand.addListener((cmd) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, cmd, function(response) {
      console.log(cmd, " request sent.");
    });
  });
        
});