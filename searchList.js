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


    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.push(searchElement);

        if (this.searchElements.length == 1) {
            this.setLCA();
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();

        this.printDetail();

        return;
    }


    delete(pos) {
        this.searchElements.splice(pos, 1);

        this.setLCA();

        this.setPathTree();

        return;
    }


    insert(ele, pos) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.splice(pos, 0, searchElement);

        if (this.searchElements.length == 1) {
            this.setLCA();
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();

        return;
    }


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

        return;
    }


    removeChild(ele) {
        let len = this.searchElements.length;

        for (let i = 0; i < len; i++) {
            if (isAncestor(ele, this.searchElements[len-i-1].element)) {
                this.delete(len-i-1);
            }
        }
    }


    clear() {
        this.lca = null;
        this.searchElements = [];
        this.pathtree = [];

        return;
    }


    isDuplicate(ele) {
        for (const se of this.searchElements) {
            if (ele == se.element) {
                return true;
            }
        }

        return false;
    }


    isContained(ele) {
        for (const se of this.searchElements) {
            if (isAncestor(se.element, ele)) {
                return true;
            }
        }
        
        return false;
    }


    setLCA() {
        this.lca = null;

        for (const se of this.searchElements) {
            if (this.lca == null) {
                this.lca = se.element;
            }
            else {
                this.lca = findlca(se.element, this.lca);
            }
        }

        return;
    }


    updateLCA(ele) {
        if (this.lca != null) {
            this.lca = findlca(ele, this.lca);
        }

        return;
    }


    setPathTree() {
        this.pathtree = [];

        for (const se of this.searchElements) {
            this.pathtree.push(findPath(se.element, this.lca));
        }

        return;
    }


    make_button(ele){
        let sl = this;
        let btn = $("<button>Switch Raw/Rendered HTML</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', ele.id.toString() + '_btn');
        btn.click(function() {
            ele.switchMode();
            sl.updateSidebar();
        });
        
        return btn;
    }


    updateSidebar() {
        let repo = $('#repo');
        repo.empty();

        for (const ele of this.searchElements){
            let li = $('<li></li>'),
                btn = this.make_button(ele);
           
            if(ele.mode == Mode.Original){
                let p_node = $('<p />');
                li.append(p_node);
                p_node.append(ele.getHTML());
            }
            else{
                let div_node = $('<div />');
                li.append(div_node);
                div_node.append(ele.getHTML());
            }

            li.append(btn);
            repo.append(li);
            repo.append($('<hr class="solid">'));
        }

        return;
    }


    isSameStructure(ele) {
        let i = 0;

        for (const path of this.pathtree) {
            let node = findNode(ele, path);
            if ((node == null) || (node.outerHTML != this.searchElements[i++].element.outerHTML)) {
                return false;
            }
        }
        return true;
    }


    search() {
        let similarList = similarElements(this.lca);

        if (similarList == null || similarList.length == 0) {
            return;
        }

        let results = [];
        
        for (const node of similarList) {
            if (this.isSameStructure(node)) {
                results.push(node);
            }
        }

        for (const node of results) {
            for (const path of this.pathtree) {
                findNode(node, path).classList.add("mystyle");
            }
        }

        return;
    }

    
    printDetail() {
        console.log("search elements: ", this.searchElements);
        console.log("lowest common ancestor: ", this.lca);
        console.log("path tree: ", this.pathtree);

        return;
    }
}



function nodePath(node, root) {
    let nodes = [];
    let pNode = node;

    while (pNode != root) {
        nodes.unshift(pNode);
        pNode = pNode.parentNode;
    }
    
    return nodes;
}


function findPath(element, ancestor) {
    let pNode = ancestor;
    let nodes = nodePath(element, ancestor);
    let path = [];

    if (ancestor == null) {
        return null;
    }

    if (element == ancestor) {
        return [];
    }

    for (const node of nodes) {
        let child = pNode.firstChild;
        let j = 0;
        while (child != node) {
            child = child.nextSibling;
            j++;
        }

        pNode = node;
        path.push(j);
    }

    return path;
}


function findNode(root, path) {
    let node = root;

    for (const rank of path) {
        if (node != null) {
            node = node.firstChild;
            for (let i = 0; i < rank; i++) {
                if (node == null) {
                    break;
                }
                node = node.nextSibling;
            }
        }
    }

    return node;
}


function findlca(ele1, ele2) {

    let lca = ele1;

    while (lca != null) {
        if (isAncestor(lca, ele2)) {
            break;
        }
        lca = lca.parentNode;
    }
    
    return lca;
}


function similarElements(ele) {
    if (ele == null) {
        return null;
    }

    return document.getElementsByTagName(ele.tagName);
}


function isAncestor(ancestor, element) {
    if (ancestor == element) {
        return true;
    }
    while (element != null) {
        return isAncestor(ancestor, element.parentNode);
    }
    return false;
}