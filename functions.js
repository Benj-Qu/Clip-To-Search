$(document).ready(function(){
    function inBox(selector, x1, y1, x2, y2){
        var elements = [];
        $(selector).each(function(){
            var offSet = $(this).offset;
            var x = offSet.left;
            var y = offSet.top;
            var w = $(this).width;
            var h = $(this).height;
            if (x >= x1 
                && y >= y1 
                && x + w <= x2 
                && y + h <= y2) {
                elements.push($this.get(0));
            }
        });
        return elements;
    }
});