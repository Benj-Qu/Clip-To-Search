console.log("background running")
chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case "activate":
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "activate extension", function(response) {
                  console.log("sent");
                });
              });
    }
});