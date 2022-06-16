// Disables text selection on the current page
function disableTextSelection(){
    document.querySelector('*').addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
}


// In: four coordinates corresponding to four vertices of the bounding box
// Out: an array of DOM elements in this bounding box
function rectangleSelect(x1, y1, x2, y2) {
    let x_large = x1 > x2 ? x1 : x2,
        x_small = x1 < x2 ? x1 : x2,
        y_large = y1 > y2 ? y1 : y2,
        y_small = y1 < y2 ? y1 : y2;

    // console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);
    const allElements = document.getElementsByTagName('*');
    var objects = [];

    var x_origin = 0, 
        y_origin = 0;

    for (const element of allElements) {
        let rect = element.getBoundingClientRect();
        let x_l = rect.left + parseInt(getComputedStyle(element).paddingLeft),
            x_r = rect.right + parseInt(getComputedStyle(element).paddingRight),
            y_t = rect.top + parseInt(getComputedStyle(element).paddingTop),
            y_d = rect.bottom + parseInt(getComputedStyle(element).paddingBottom);
        if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
            if (x_l != x_r && y_t != y_d) {
                console.log("find rect!")
                //console.log("rect: ", x_l, " ", x_r, " ", y_t, " ", y_d);
                if (objects.length == 0) {
                    objects.push([element.outerHTML, 0, 0]);
                    x_origin = x_l + Window.scrollX;
                    y_origin = y_t + Window.scrollY;
                } else {
                    objects.push([element.outerHTML, x_l + Window.scrollX - x_origin, y_t + Window.scrollY - y_origin]);
                }
                
                //console.log("html: ", element.outerHTML)

            }
        }
    }
    return objects;
}

// In: an array of DOM elements
// Out: Search the one which is of class "selected" 
function searchelement(elementhtml){
    console.log("html to search: ", elementhtml);
    [...document.querySelectorAll("*")].forEach((ele)=>{
        if(ele.outerHTML == elementhtml){
            found = true;
            console.log("searched!");
            //console.log(ele);
            //console.log("html searched: ", ele.outerHTML);
            ele.classList.add("mystyle");
        }
    });
}
   