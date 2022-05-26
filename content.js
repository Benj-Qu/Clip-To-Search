$( document ).on( "mousedown", function( event ) {
    var mouseDownX = event.pageX;
    var mouseDownY = event.pageY;
});

$( document ).on( "mouseup", function( event ) {
    var mouseUpX = event.pageX;
    var mouseUpY = event.pageY;
});

var objects = [];
objects = inBox("li", mouseDownX, mouseDownY, mouseUpX, mouseUpY);