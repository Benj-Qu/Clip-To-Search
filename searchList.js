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
        this.elements = [];
        this.pathtree = [];
    }

    // append element to search list
    append(ele) {
        let searchElement = new SearchElement(ele);
        this.elements.push(searchElement);
        if (this.elements.length == 1) {
            this.LCA = ele;
        }
        else {
            this.updateLCA();
        }
        this.setPathTree();
    }

    // delete element from a certain position in the search list
    delete(pos) {
        this.elements.splice(pos, 1);
        this.setLCA();
        this.setPathTree();
    }

    // insert element into a certain position in the search list
    insert(ele, pos) {
        let searchElement = new SearchElement(ele);
        this.elements.splice(pos, 0, searchElement);
        if (this.elements.length == 1) {
            this.LCA = ele;
        }
        else {
            this.updateLCA();
        }
        this.setPathTree();
    }

    // move an element
    move(from, to) {
        let moveElement = elements[from];
        if (from > to) {
            this.elements.splice(from, 1);
            this.elements.splice(to, 0, moveElement);
        }
        else if (from < to) {
            this.elements.splice(to, 0, moveElement);
            this.elements.splice(from, 1);
        } 
    }

    // clear up the search list
    clear() {
        this.lca = null;
        this.elements = [];
        this.pathtree = [];
    }

    // set the LCA node of the elements in search list (after some element is deleted)
    setLCA() {
        this.lca = elements[0];

        this.elements.forEach(function(val, idx, arr) {
            // get the parent array of two elements
            if (this.lca != null) {
                this.lca = findlca(val, this.lca);
            }
        });

        return this.lca;
    }

    // update the LCA node after an element is appended (after some node is appended or inserted)
    updateLCA() {
        if (this.lca != null) {
            this.lca = findlca(val, this.lca);
        }
    }

    setPathTree() {
        let lca = this.lowestCommonAncestor();
        let pathArr = [];
        this.elements.forEach(function(val, idx, arr) {
            pathArr.push(findPath(val, lca));
        });
        return pathArr;
    }

    make_button(ele){
        let sl = this;
        let id = ele.id;
        let id_str = id.toString();
        let btn_id = id + '_btn';
        let btn = document.createElement("button");
        btn.innerHTML = "Switch Raw/Rendered HTML";
        btn.classList.add("cs_sb_btn");
        btn.id = btn_id;
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
        for (let ele of this.elements){
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
            if ((node == null) || (node.outerHTML != elements[idx].outerHTML)) {
                isSame = false;
            }
        });
        return isSame;
    }

    search() {
        let similarList = similarElements(this.lca);
        similarList.forEach(function(val, idx, arr) {
            if (this.isSameStructure(val)) {
                this.pathtree.forEach(function(val, idx, arr) {
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
}

function findPath(element, ancestor) {
    let pNode = ancestor;
    let pArr = parents(element, ancestor);
    let path = [];

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
    let pArr1 = parents(ele1, null),
        pArr2 = parents(ele2, null);
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

// TODO
// The standard for similar Elements
function similarElements(ele) {
    return document.getElementsByTagName(ele.tagName);
}