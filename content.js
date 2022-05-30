console.log("Clip to Search, Start");
var mouseDownX = 0;
var mouseDownY = 0;
var mouseUpX = 0;
var mouseUpY = 0;

$(document).ready(function(){
    
    $(document).on("mousedown", function(event){

        mouseDownX = event.pageX;
        mouseDownY = event.pageY;

        $(document).on("mouseup", function(event){
            mouseUpX = event.pageX;
            mouseUpY = event.pageY;

            console.log("downX: ", mouseDownX, ", downY: ", mouseDownY, ", upX: ", mouseUpX, ", upY: ", mouseUpY);        
            
            var objects = [];
            objects = rectangleSelect(mouseDownX, mouseDownY, mouseUpX, mouseUpY);
            
            console.log("length: ", objects.length)
            
            for(elt in objects){
                console.log(elt.html())
            }
        });
    });  
});
