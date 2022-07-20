const Strategy = {
	All : 0,
    SameStructure : 1,
    SimilarStructure : 2
}

class SearchElementArray {
    
    constructor() {
        this.searchElements = [];
        this.bannedElements = [];
        this.searchStrategy = Strategy.All;
        this.lca = null;
        this.pathtree = [];
    }

    clear() {
        this.searchElements = [];
        this.bannedElements = [];
        this.searchStrategy = Strategy.All;
        this.lca = null;
        this.pathtree = [];
        return;
    }

    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.push(searchElement);

        if (this.searchElements[this.searchMode].length == 1) {
            this.setLCA();
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();

        return;
    }
}