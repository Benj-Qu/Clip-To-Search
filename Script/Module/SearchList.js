class SearchList {

    constructor() {
        this.searchMode = 0;
        this.modeNum = 1;

        this.searchArrays = [new SearchElementArray()];
    }


    switchSearchMode(mode) {
        console.log("switch to mode: " + mode);
        this.searchMode = mode;

        removeSearchStyle()

        this.updateSidebar()

        this.search();

        return;
    }


    addSearchMode() {
        this.modeNum++;

        let sea = new SearchElementArray();

        this.searchArrays.push(sea);

        return;
    }


    deleteSearchMode(mode) {
        this.searchArrays.splice(mode, 1);

        return;
    }


    clear() {
        this.searchArrays = [new SearchElementArray()];
        this.updateSidebar();
        removeSearchStyle();

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


    make_mode_btn(mode){
        let sl = this;
        let btn = $("<button >Mode " + mode + "</button>");
        btn.addClass("cs_sb_btn");
        btn.click(function() {
            sl.switchSearchMode(mode);
        });
        return btn
    }

    make_MMSconfirm_btn(){
        
    }


    make_strategy_btn() {
        return this.searchArrays[this.searchMode].make_strategy_btn();
    }


    update_mode_btn_group(){
        $('#mode_btn_group').remove();
        let mode_btn_group = $('<div id="mode_btn_group"><div>');
        mode_btn_group.insertAfter('#repo_header');

        for (let i = 0; i < this.searchArrays.length; i++) {
            let mode_btn = this.make_mode_btn(i);
            mode_btn_group.append(mode_btn);
        }

        mode_btn_group.addClass('cs_sb_mode_btn_group');

        return;
    }


    updateSidebar() {
        this.searchArrays[this.searchMode].updateSidebar();
        this.update_mode_btn_group();

        return;
    }
}