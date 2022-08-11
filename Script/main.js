var clipSearch;

if (!clipSearch) {
    
    clipSearch = new ClipSearch('clipSearch_canvas');

    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        switch(request) {
            case "switch":
                clipSearch.switchActiveMode();
                break;
            case "clear":
                clipSearch.clearResults();
                break;
            case "delete":
                clipSearch.searchList.elements.pop();
                this.addElements(this.startX, this.startY, x, y);
                removeSearchStyle()
                searchelement(clipSearch.searchList.elements)
                break;
            default:
                break;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key == "Shift") {
            clipSearch.enable();
            document.getElementsByTagName("body")[0].style.cursor = "crosshair";
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key == "Shift") {
            clipSearch.switchActiveMode();
            document.getElementsByTagName("body")[0].style.cursor = "default";
        }
    });

    window.addEventListener("resize", () => clipSearch.canvasResize());

    clipSearch.init();
} 
else {
    if (clipSearch.isEnabled()) {
        clipSearch.remove();
    } 
    else {
        clipSearch.init();
    }
}