console.log("Clip to Search, Start");
disableTextSelection()

var mouseDownX = 0;
var mouseDownY = 0;
var mouseUpX = 0;
var mouseUpY = 0;

var enabled = true;

chrome.runtime.onMessage.addListener(
    function(request) {
        if( request.message === "clear" ) {
            clr_class();
        }
        if (request.message === "disable search") {
            enabled = false;
        }
        if (request.message === "enable search") {
            enabled = true;
        }
});

function clr_class(){
    $("*").removeClass("mystyle")
}

$(document).ready(function(){
    
    $(document).on("mousedown", function(event){
        if (enabled) {

            mouseDownX = event.clientX;
            mouseDownY = event.clientY;

            $(document).on("mouseup", function(event){
                mouseUpX = event.clientX;
                mouseUpY = event.clientY;

                console.log("downX: ", mouseDownX, ", downY: ", mouseDownY, ", upX: ", mouseUpX, ", upY: ", mouseUpY);        
            
                var objectsHTML = [];
                objectsHTML = rectangleSelect(mouseDownX, mouseDownY, mouseUpX, mouseUpY);
            
                console.log("length: ", objectsHTML.length);
                console.log(objectsHTML); // the objects array works fine 
                
                for (let elementHTML of objectsHTML){
                    //console.log("begin searching");
                    console.log("elementHTML is: ", elementHTML);
                    searchelement(elementHTML);
                }
            });
        }
    });  
});
