
console.log("Clip to Search, Start");

$(document).ready(function(){
    var mouseDownX, mouseDownY, mouseUpX, mouseUpY;

    $(document).on("mousedown", function(event){
        mouseDownX = event.pageX;
        mouseDownY = event.pageY;
        
    });
    
    $(document).on("mouseup", function(event){
        mouseUpX = event.pageX;
        mouseUpY = event.pageY;
    
    });
    
    console.log(mouseDownX);
    
    var objects = [];
    objects = rectangleSelect(mouseDownX, mouseDownY, mouseUpX, mouseUpY);
    
    
    // for(elt in objects){
    //     console.log(elt.html())
    // }
});
