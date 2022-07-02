// Enum for display mode
const Mode = {
	Rendered : 0,
    Original : 1
}

var counter = 0;

class SearchElement {

    constructor(ele) {
        this.id = counter++;
        this.element = ele;
        this.mode = Mode.Rendered;
        this.elementHTML = ele.outerHTML;
    }

    // return the HTML code of the element for sidebar in original mode 
    originalHTML() {
        let oHTML = this.elementHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return oHTML;
    }

    // return the HTML code of the element for sidebar in rendered mode 
    renderedHTML() {
        let rHTML = this.elementHTML;
        return rHTML;
    }

    getHTML() {
        switch(this.mode) {
            case Mode.Rendered:
                return this.renderedHTML();
            case Mode.Original:
                return this.originalHTML();
        }
    }

    switchMode() {
        switch(this.mode) {
            case Mode.Rendered:
                this.mode = Mode.Original;
                break;
            case Mode.Original:
                this.mode = Mode.Rendered;
                break;
        }
    }
}

class SearchList {

    constructor() {
        this.lca = null;
        this.searchElements = [];
        this.pathtree = [];
    }

    // append element to search list
    append(ele) {
        let searchElement = new SearchElement(ele);
        this.searchElements.push(searchElement);

        if (this.searchElements.length == 1) {
            this.lca = ele;
        }
        else {
            this.updateLCA();
        }

        this.setPathTree();
    }

    // delete element from a certain position in the search list
    delete(pos) {
        this.searchElements.splice(pos, 1);

        this.setLCA();

        this.setPathTree();
    }

    // insert element into a certain position in the search list
    insert(ele, pos) {
        let searchElement = new SearchElement(ele);
        this.searchElements.splice(pos, 0, searchElement);

        if (this.searchElements.length == 1) {
            this.lca = ele;
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();
    }

    // move an element
    move(from, to) {
        let moveElement = searchElements[from];

        if (from > to) {
            this.searchElements.splice(from, 1);
            this.searchElements.splice(to, 0, moveElement);
        }
        else if (from < to) {
            this.searchElements.splice(to, 0, moveElement);
            this.searchElements.splice(from, 1);
        } 
    }

    // clear up the search list
    clear() {
        this.lca = null;
        this.searchElements = [];
        this.pathtree = [];
    }

    isDuplicate(ele) {
        let isDup = false;
        this.searchElements.forEach(function(val, idx, arr) {
            if (ele == val.element) {
                isDup = true;
            }
        })
        return isDup;
    }

    // set the LCA node of the searchElements in search list (after some element is deleted)
    setLCA() {
        this.lca = searchElements[0].element;
        let sl = this;

        this.searchElements.forEach(function(val, idx, arr) {
            // get the parent array of two searchElements
            if (this.lca != null) {
                this.lca = findlca(val.element, sl.lca);
            }
        });

        return this.lca;
    }

    // update the LCA node after an element is appended (after some node is appended or inserted)
    updateLCA(ele) {
        if (this.lca != null) {
            this.lca = findlca(ele, this.lca);
        }
    }

    setPathTree() {
        let pathArr = [];
        let sl = this;

        this.searchElements.forEach(function(val, idx, arr) {
            pathArr.push(findPath(val.element, sl.lca));
        });

        return pathArr;
    }

    make_button(ele){
        let sl = this;

        let btn = document.createElement("button");
        btn.innerHTML = "Switch Raw/Rendered HTML";
        btn.classList.add("cs_sb_btn");
        btn.id = ele.id.toString() + '_btn';

        btn.addEventListener("click", function(){
            ele.switchMode();
            console.log('Switch Raw/Rendered');
            sl.updateSidebar();
        });
        
        return btn;
    }

    // update the sidebar HTML codes
    // always update sidebar HTML when searchList is modified, or display mode is switched
    updateSidebar() {
        console.log('update sidebar');

        let repo = $('#repo');
        repo.empty();

        for (let ele of this.searchElements.element){
            let li = $('<li></li>');
            let btn = this.make_button(ele);
           
            if(ele.mode == Mode.Original){
                let p_node = $('<p />');
                li.append(p_node);
                p_node.append(ele.getHTML());
            }
            else{
                let div_node = $('<div />');
                li.append(div_node);
                console.log(ele.getHTML());
                div_node.append(ele.getHTML());
            }

            li.append(btn);
            repo.append(li);
        }
    }

    isSameStructure(ele) {
        let isSame = true;

        this.pathtree.forEach(function(val, idx, arr) {
            let node = findNode(ele, val);
            if ((node == null) || (node.outerHTML != searchElements[idx].element.outerHTML)) {
                isSame = false;
            }
        });

        return isSame;
    }


    search() {
        let similarList = similarElements(this.lca);
        let sl = this;

        if (similarList.length == 0 || similarList == null) {
            return;
        }
        
        similarList.forEach(function(ele, idx, arr) {
            if (sl.isSameStructure(ele)) {
                sl.pathtree.forEach(function(val, idx, arr) {
                    let node = findNode(ele, val);
                    node.classList.add("mystyle");
                });
            }
        });
    }
}



function parents(node, root) {
    let pArr = [];
    let pNode = node;

    while (pNode != root) {
        pArr.unshift(pNode);
        pNode = pNode.parentNode;
    }
    pArr.unshift(pNode);
    
    return pArr;
}


function findPath(element, ancestor) {
    let pNode = ancestor;
    let pArr = parents(element, ancestor);
    let path = [];

    if (ancestor == null) {
        return null;
    }

    if (element == ancestor) {
        return [];
    }

    pArr.forEach(function(val, idx, arr) {
        let child = pNode.firstChild;
        let j = 0;
        while (child != val) {
            child = child.nextSibling;
            j++;
        }
        pNode = val;
        path.push(j);
    });
    return path;
}


function findNode(root, path) {
    let node = root;
    path.forEach(function(val, idx, arr) {
        if (node != null) {
            node = node.firstChild;
            for (let i = 0; i < val; i++) {
                if (node == null) {
                    break;
                }
                node = node.nextSibling;
            }
        }
    });
    return node;
}


function findlca(ele1, ele2) {
    let pArr1 = parents(ele1, Node.DOCUMENT_FRAGMENT_NODE),
        pArr2 = parents(ele2, Node.DOCUMENT_FRAGMENT_NODE);
    if (pArr1[0] != pArr2[0]) {
        return null;
    }
    else {
        let i = 0;
        while (i < pArr1.length && i < pArr2.length && pArr[i] == pArr[2]) {
            i++;
        }
        return pArr1[i-1];
    }
}


// The standard for similar Elements
function similarElements(ele) {
    if (ele == null) {
        return null;
    }
    return document.getElementsByTagName(ele.tagName);
}