function rectangleSelect(x1, y1, x2, y2) {
    console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);
    const allElements = document.getElementsByTagName('*');
    var objects = [];

    for (const element of allElements) {
        let rect = element.getBoundingClientRect();
        
        if (rect.left >= x1 && rect.right <= x2 && rect.height >= y1 && rect.bottom <= y2) {
            console.log("find rect!")

            objects.push(element);
        }
    }

    return objects;
}
<<<<<<< HEAD

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
=======
>>>>>>> 8e9024218ad28674f12a8c85fcad4c8210028f60
