// Disables text selection on the current page
function disableTextSelection(){
    document.querySelector('*').addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
}
// Get the coordinates of "element"

   
function getView(view) {
    let html;
    $.ajax({
      url: view,
      async: false,
      success: function(data) {
        html = $.parseHTML(data.response);
      }
    });
    return html;
}

function rectangleSelect(x1, y1, x2, y2) {
    let list = [];

    let x_large = x1 > x2 ? x1 : x2,
        x_small = x1 < x2 ? x1 : x2,
        y_large = y1 > y2 ? y1 : y2,
        y_small = y1 < y2 ? y1 : y2;

    const allElements = document.getElementsByTagName('*');
    
    for (const element of allElements) {
        let pos = getPos(element);
        let x_l = pos[0],
            x_r = pos[1],
            y_t = pos[2],
            y_d = pos[3];
        if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
            list.append(element);
        }
    }

    return list;
}