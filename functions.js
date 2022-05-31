function rectangleSelect(x1, y1, x2, y2) {

    console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);

    const allElements = document.getElementsByTagName('*');
    var objects = [];

    for (const element of allElements) {
        let rect = element.getBoundingClientRect();
        let x_l = rect.left + parseInt(getComputedStyle(element).paddingLeft),
            x_r = rect.right + parseInt(getComputedStyle(element).paddingRight),
            y_t = rect.top + parseInt(getComputedStyle(element).paddingTop),
            y_d = rect.bottom + parseInt(getComputedStyle(element).paddingBottom);
        if (x_l >= x1 && x_r <= x2 && y_t >= y1 && y_d <= y2) {
            if (x_l != x_r && y_t != y_d) {
                console.log("find rect!")
                console.log("rect: ", x_l, " ", x_r, " ", y_t, " ", y_d);
                objects.push(element);
            }
        }
    }

    return objects;
}
