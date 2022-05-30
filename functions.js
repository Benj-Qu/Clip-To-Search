function rectangleSelect(x1, y1, x2, y2) {
    const allElements = document.getElementsByTagName('*');

    var objects = [];

    for (const element of allElements) {
        let rect = element.getBoundingClientRect();
        if (rect.left >= x1 && rect.right <= x2 && rect.height >= y1 && rect.bottom <= y2) {
            objects.push(element);
        }
    }

    return objects;
}

//TODO: if wrong position appears, consider changing clientX to pageX
function mouseDown(event){
    let x = event.pageX,
        y = event.pageY;
    return {x, y};
}

function mouseUp(event){
    let x = event.pageX,
        y = event.pageY;
    return {x, y};
}

window.addEventListener('mousemove', mouseDown);
window.addEventListener('mousemove', mouseUp);
