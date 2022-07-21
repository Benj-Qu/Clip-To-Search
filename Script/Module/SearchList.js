const Strategy = {
	All : 0,
    SameStructure : 1,
    SimilarStructure : 2
}

const Structure = {
    SameStructure : 0,
    NoneExist : 1,
    Different : 2
}

class SearchList {

    constructor() {
        this.searchMode = 0;
        this.modeNum = 0;

        this.searchArrays = [];
    }


    switchSearchMode(mode) {
        this.searchMode = mode;

        $(".cs_same_style").removeClass("cs_same_style");
        $(".cs_similar_style").removeClass("cs_similar_style");

        this.search();

        return;
    }


    addSearchMode() {
        this.modeNum++;

        let sea = new SearchElementArray();

        this.searchList.push(sea);

        return;
    }


    deleteSearchMode(mode) {
        this.searchArrays.splice(mode, 1);
    }


    clear() {
        this.searchList = [];

        return;
    }


    getIdxFromID(id){
        return this.searchArrays[this.searchMode].getIdxFromID(id);
    }


    append(ele) {
        this.searchArrays[this.searchMode].append(ele);

        return;
    }


    delete(pos) {
        this.searchArrays[this.searchMode].delete(pos);

        return;
    }


    insert(ele, pos) {
        this.searchArrays[this.searchMode].insert(ele,pos);

        return;
    }


    move(from, to) {
        this.searchArrays[this.searchMode].move(from, to);

        return;
    }


    isDuplicate(ele) {
        return this.searchArrays[this.searchMode].isDuplicate(ele);
    }


    isContained(ele) {
        return this.searchArrays[this.searchMode].isContained(ele);
    }


    removeChild(ele) {
        this.searchArrays[this.searchMode].removeChild(ele);

        return;
    }


    isSameStructure(ele, shift = 0) {
        return this.searchArrays[this.searchMode].isSameStructure(ele, shift);
    }


    getSimilarStructure(ele) {
        return this.searchArrays[this.searchMode].getSimilarStructure(ele);
    }


    search() {
        this.searchArrays[this.searchMode].search();

        return;
    }


    mark(results, style) {
        this.searchArrays[this.searchMode].mark(results, style);
        
        return;
    }


    updateSidebar() {
        this.searchArrays[this.searchMode].updateSidebar();
    }
}



