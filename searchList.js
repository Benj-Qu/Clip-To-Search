// Enum for display mode
const Mode = {
	Rendered : 0,
    Original : 1
}

class SearchElement {

    constructor(ele) {
        this.element = ele;
        this.mode = Mode.Rendered;
        this.elementHTML = ele.outerHTML;
    }

    // return the HTML code of the element for sidebar in original mode 
    originalHTML() {
        let oHTML = this.elementHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return (elementHead + oHTML + oTail);
    }

    // return the HTML code of the element for sidebar in rendered mode 
    renderedHTML() {
        let rHTML = this.elementHTML;
        return (elementHead + rHTML + rTail);
    }

    getHTML() {
        switch(this.mode) {
            case Mode.Rendered:
                return this.originalHTML();
            case Mode.Original:
                return this.renderedHTML();
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
        this.elements = [];
    }

    // append element to search list
    append(ele) {
        let searchElement = new SearchElement(ele);
        this.elements.push(searchElement);
    }

    // delete element from a certain position in the search list
    delete(pos) {
        this.elements.splice(pos, 1);
    }

    // insert element into a certain position in the search list
    insert(ele, pos) {
        let searchElement = new SearchElement(ele);
        this.elements.splice(pos, 0, searchElement);
    }

    // clear up the search list
    clear() {
        this.elements = [];
    }

    // get the LCA DOM element of the elements in search list
    lowestCommonAncestor() {
        let root = getElementsByTagName('html');
        let currLCA = elements[0];

        this.elements.forEach(function(val, idx, arr) {
            // get the parent array of two elements
            let parentArr1 = getParentArr(val),
                parentArr2 = getParentArr(currLCA);
            
        });

        return currLCA;
    }

    // update the sidebar HTML codes
    // always update sidebar HTML when searchList is modified, or display mode is switched
    updateSidebar() {
        let sbHTML = ``;

        this.elements.forEach(function(val, idx, arr) {
            sbHTML += val.getHTML();
        });

        

        return sbHTML;
    }
}

function getParentArr(node) {
    let pArr = [node];
    let pNode = node;
    while (pNode != getElementsByTagName('html')) {
        pNode = pNode.parentNode;
        pArr.push(pNode);
    }
}