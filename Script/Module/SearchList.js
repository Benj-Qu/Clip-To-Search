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
    }


    clear() {
        this.searchArrays = [new SearchElementArray()];
        this.updateSidebar();

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


    make_choose_btn() {
        let sl = this;
        let btn = $("<button >Choose Strategy</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'choose_btn');
        btn.click(function() {
            let helpModal = $('<div></div>');
            helpModal.attr('id', 'cs_modal');
            helpModal.addClass('cs_modal');
            let choice_group = $(`<div class="cs_modal_content"><span id="cs_modal_close" class="cs_modal_close">&times;</span><p id="cs_modal_text">Choose Strategy</p></div>`);
            if (sl.searchArrays[sl.searchMode].zeroStrategy) {
                let choice = $('<div></div>');
                let strategy_btn = sl.make_same_strategy_btn();
                choice.append(strategy_btn);
                choice_group.append(choice);
            }
            for(let i=0; i < sl.searchArrays[sl.searchMode].foundStrategyNum; i++){
                let choice = $('<div></div>');
                let strategy_btn = sl.make_simailar_strategy_btn(i);
                choice.append(strategy_btn);
                choice_group.append(choice);
            }
            let choice = $('<div></div>');
            let strategy_btn = sl.make_deemphasize_btn();
            choice.append(strategy_btn);
            choice_group.append(choice);
            helpModal.append(choice_group);
            $('body').append(helpModal);
            let removeModal = () => $('#cs_modal').remove();;
            document.getElementById('cs_modal_close').addEventListener("click", removeModal);
        });
        return btn;
    }


    make_deemphasize_btn(){
        let btn = $("<button >Deemphasize</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'strategy_btn');
        btn.click(function(){
            deemphasizeStrategy();
        });
        return btn;
    }


    make_simailar_strategy_btn(id){
        let btn = $("<button >Enable strategy "+ id + "</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'strategy_btn');
        btn.click(function(){
            emphasizeSimilarStrategy(id);
        });
        return btn;
    }


    make_same_strategy_btn(){
        let btn = $("<button >Enable same strategy</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'strategy_btn');
        btn.click(function(){
            emphasizeSameStrategy();
        });
        return btn;
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

    }
    

    update_choose_btn(){
        $('#choose_btn').remove();
        let choose_btn = this.make_choose_btn();
        choose_btn.insertAfter('#repo_header');
        choose_btn.addClass('cs_sb_choose_btn');
    }


    updateSidebar() {
        this.searchArrays[this.searchMode].updateSidebar();
        this.update_choose_btn();
        this.update_mode_btn_group();
    }
}