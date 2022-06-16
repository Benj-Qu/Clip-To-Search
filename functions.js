// Disables text selection on the current page
function disableTextSelection(){
    document.querySelector('*').addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
}

function getPos(element) {
    let rect = element.getBoundingClientRect();
    let x_l = rect.left + parseInt(getComputedStyle(element).paddingLeft),
        x_r = rect.right + parseInt(getComputedStyle(element).paddingRight),
        y_t = rect.top + parseInt(getComputedStyle(element).paddingTop),
        y_d = rect.bottom + parseInt(getComputedStyle(element).paddingBottom);
    let pos = [x_l, x_r, y_t, y_d];
    return pos;
}



// In: four coordinates corresponding to four vertices of the bounding box
// Out: an array of DOM elements in this bounding box
function rectangleSelect(x1, y1, x2, y2, objects) {
    let x_large = x1 > x2 ? x1 : x2,
        x_small = x1 < x2 ? x1 : x2,
        y_large = y1 > y2 ? y1 : y2,
        y_small = y1 < y2 ? y1 : y2;

    // console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);
    const allElements = document.getElementsByTagName('*');

    let x_origin = 0, 
        y_origin = 0;

    for (const element of allElements) {
        let pos = getPos(element);
        let x_l = pos[0],
            x_r = pos[1],
            y_t = pos[2],
            y_d = pos[3];
        if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
            if (x_l != x_r && y_t != y_d) {
                x_origin = x_l + Window.scrollX;
                y_origin = y_t + Window.scrollY;
                objects.push([element, x_origin, y_origin]);
            }
        }
    }
    return objects;
}

// In: an array of DOM elements
// Out: Search the one which is of class "selected" 
function searchelement(searchList){
    let singleSearchResult = [];

    for(var i = 0; i < searchList.length; i++) {
        let emptyList = [];
        singleSearchResult.push(emptyList);
    }

    [...document.querySelectorAll("*")].forEach((ele)=>{
        for (var i = 0; i < searchList.length; i++) {
            if (ele.outerHTML == searchList[i][0].outerHTML) {
                singleSearchResult[i].push([ele,-1]);
            }
        }
    });

    for (var i = 0; i < singleSearchResult.length - 1; i++) {
        for (var j = 0; j < singleSearchResult[i].length; j++) {
            if ((i == 0) || (singleSearchResult[i][j][1] != -1)) {
                let pos = getPos(singleSearchResult[i][j][0]);
                let x_l = pos[0],
                    y_t = pos[2];
                for (var k = 0; k < singleSearchResult[i+1].length; k++) {
                    let _pos = getPos(singleSearchResult[i+1][k][0]);
                    let _x_l = _pos[0],
                        _y_t = _pos[2];
                    if ((_x_l - x_l == searchList[i+1][1] - searchList[i][1]) && 
                        (_y_t - y_t == searchList[i+1][2] - searchList[i][2])) {
                            singleSearchResult[i+1][k][1] = j;
                        }
                }
            }
        }
    }

    for (var i = 0; i < singleSearchResult[singleSearchResult.length - 1].length; i++) {
        if (singleSearchResult[singleSearchResult.length - 1][i][1] != -1) {
            var idx = i;
            for (var j = singleSearchResult.length - 1; j >= 0; j--) {
                singleSearchResult[j][idx][0].classList.add("mystyle");
                idx = singleSearchResult[j][idx][1];
            }
        }
    }
}
   