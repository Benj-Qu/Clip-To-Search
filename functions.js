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

function checkExisted(element, elementList) {
    for (const ele of elementList) {
        if (ele == element) {
            return true;
        }
    }
    return false;
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

    for (const element of allElements) {
        let pos = getPos(element);
        let x_l = pos[0],
            x_r = pos[1],
            y_t = pos[2],
            y_d = pos[3];
        if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
            if (x_l != x_r && y_t != y_d && !checkExisted(element,objects)) {
                objects.push(element);
            }
        }
    }
    return objects;
}

// In: an array of DOM elements
// Out: Search the one which is of class "selected" 
function searchelement(searchList){
    // Result of seasrching by each element
    // 2D array
    let singleSearchResult = [];

    // Initialization of SSR
    for(var i = 0; i < searchList.length; i++) {
        let emptyList = [];
        singleSearchResult.push(emptyList);
    }

    // Fill in the 2D array, each element with ele([0]) and parent([1])
    [...document.querySelectorAll("*")].forEach((ele)=>{
        for (var i = 0; i < searchList.length; i++) {
            if (ele.outerHTML == searchList[i][0].outerHTML) {
                // parent init as -1
                singleSearchResult[i].push([ele,-1]);
            }
        }
    });

    // top-down
    for (var i = 0; i < singleSearchResult.length - 1; i++) {
        for (var j = 0; j < singleSearchResult[i].length; j++) {
            if ((i == 0) || (singleSearchResult[i][j][1] != -1)) {
                let pos = getPos(singleSearchResult[i][j][0]);
                let x_l = pos[0],
                    y_t = pos[2];
                let searchPos = getPos(searchList[i]);
                let x_l_s = searchPos[0],
                    y_t_s = searchPos[2];
                let _searchPos = getPos(searchList[i+1]);
                let _x_l_s = searchPos[0],
                    _y_t_s = searchPos[2];
                for (var k = 0; k < singleSearchResult[i+1].length; k++) {
                    let _pos = getPos(singleSearchResult[i+1][k][0]);
                    let _x_l = _pos[0],
                        _y_t = _pos[2];
                    if ((_x_l - x_l == _x_l_s - x_l_s) && 
                        (_y_t - y_t == _y_t_s - y_t_s)) {
                            singleSearchResult[i+1][k][1] = j;
                        }
                }
            }
        }
    }

    // bottom-up
    for (var i = 0; i < singleSearchResult[singleSearchResult.length - 1].length; i++) {
        if (singleSearchResult[singleSearchResult.length - 1][i][1] != -1) {
            var idx = i;
            for (var j = singleSearchResult.length - 1; j >= 0; j--) {
                singleSearchResult[j][idx][0].classList.add("mystyle");
                idx = singleSearchResult[j][idx][1];
            }
        }
    }

    if (singleSearchResult.length == 1) {
        for (var j = 0; j < singleSearchResult[0].length; j++) {
            singleSearchResult[1][j][0].classList.add("mystyle");
        }
    }
}
   