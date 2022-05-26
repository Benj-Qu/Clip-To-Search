$(document).ready(function(){
    function inBox(x1, y1, x2, y2){
        var objects = [];
        $(selector).each(function(){
            var offSet = $(this).offset;
            var x = offSet.left;
            var y = offSet.top;
            var w = $(this).width;
            var h = $(this).height;
            if (x >= x1 && y >= y1 && x + w <= x2 && y + h <= y2) {
                objects.push($this.get(0));
            }
        });
        return objects;
    }
});


function rectangleSelect(x1, y1, x2, y2) {
    const allElements = document.getElementsByTagName('*');

    var objects = [];

    for (const element of allElements) {
        let rect = element.getBoundingClientRect();
        if (rect.left >= x1 && rect.right <= x2 && rect.height >= y1 && rect.bottom <= y2) {
            objects.push(element);
        }
    }

    return ElementInternals;
}