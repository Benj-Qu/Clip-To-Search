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
