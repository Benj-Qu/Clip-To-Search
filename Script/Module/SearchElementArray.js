class SearchElementArray {
    
    constructor() {
        this.searchElements = [];
        this.MMSElements = [];

        this.dragToMMS = false;
        this.draggedElementIdx = -1;
        this.draggedToIdx = -1;
        this.dragFromMMS = false;

        this.searching = new Searching();
    }

    clear() {
        this.searchElements = [];
        this.searching.clear();

        return;
    }


    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.push(searchElement);

        return;
    }


    delete(pos, inMMS) {
        if (!inMMS) {
            this.searchElements.splice(pos, 1);
        }
        else {
            this.MMSElements.splice(pos, 1);
        }
        return;
    }


    insert(ele, pos) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.splice(pos, 0, searchElement);

        return;
    }


    move(from, to, withinMMS) {
        if (!withinMMS) {
            let moveElement = this.searchElements[from];

            if (from > to) {
                this.searchElements.splice(from, 1);
                this.searchElements.splice(to, 0, moveElement);
            }
            else if (from < to) {
                this.searchElements.splice(to, 0, moveElement);
                this.searchElements.splice(from, 1);
            } 
        }
        else {
            let moveElement = this.MMSElements[from];

            if (from > to) {
                this.MMSElements.splice(from, 1);
                this.MMSElements.splice(to, 0, moveElement);
            }
            else if (from < to) {
                this.MMSElements.splice(to, 0, moveElement);
                this.MMSElements.splice(from, 1);
            } 
        }
        

        return;
    }


    isDuplicate(ele) {
        for (const se of this.searchElements) {
            if (ele === se.element_original) {
                return true;
            }
        }

        return false;
    }


    isContained(ele) {
        for (const se of this.searchElements) {
            if (se.element_original.contains(ele)) {
                return true;
            }
        }
        
        return false;
    }


    removeChild(ele) {
        let len = this.searchElements.length;

        for (let i = 0; i < len; i++) {
            if (ele.contains(this.searchElements[len-i-1].element_original)) {
                this.delete(len-i-1);
            }
        }

        return;
    }


    getIdxFromID(id, inMMS) {
        // weird JS implementation: inMMS is a string here not bool
        //console.log("inMMS: ", inMMS);
        let idx = -1;
        if (!inMMS) {
            //console.log("!inMMS");
            this.searchElements.forEach(function(item, index) {
                //console.log("forEach: item.id, index: ", item.id, index);
                if (item.id == id) {
                    idx = index;
                }
            });
        }
        else {
            //console.log("inMMS");
            this.MMSElements.forEach(function(item, index) {
                if (item.id == id) {
                    idx = index;
                }
            });
        }
        return idx;
    }


    make_strategy_btn() {
        return this.searching.make_strategy_btn();
    }


    make_switch_btn(se){
        let sa = this;
        let btn_name;

        if (se.mode === Mode.Original) {
            btn_name = "Rendered";
        }
        else {
            btn_name = "Raw";
        }
        let btn = $("<button>" + btn_name + "</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_s_btn');
        btn.click(function() {
            se.switchDisplayMode();
            sa.updateSidebar();
        });
        
        return btn;
    }


    make_delete_btn(se, inMMS){
        let sa = this;
        let btn = $("<button>Delete</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_d_btn');

        btn.click(function() {
            //console.log("delete clicked!");
            //console.log("inMMS ",inMMS);
            removeSearchStyle();
            let pos;
            if (!inMMS) {
                pos = sa.searchElements.indexOf(se);
            }
            else {
                pos = sa.MMSElements.indexOf(se);
                //console.log("delete pos:", pos);
            }
            sa.delete(pos, inMMS);
            sa.search();
            sa.updateSidebar();
        });

        //console.log(sa.MMSElements);
        //console.log(sa.searchElements);
        
        return btn;
    }


    make_decompose_btn(se){
        let sa = this;
        let btn_name;

        if (se.spanned == false) {
            btn_name = "Decompose";
        }
        else {
            btn_name = "Compose";
        }
        let btn = $("<button>" + btn_name + "</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_dcp_btn');
        btn.click(function(){
            if (se.spannable) {
                se.toggleSpanned();
                se.hasspanned = true;
                sa.updateSidebar();
            }
        });
        return btn;
    }


    make_edit_btn(se, html_block){
        let sa = this;

        let btn_name;
        if (se.editMode == true){
            btn_name = "Done";
            
        }else{
            btn_name = "Edit";
        }
        let btn = $("<button>" + btn_name + "</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_edit_btn');
        
        btn.click(function() {
            if(se.editMode == true) {
                let firstElementChildHTML;
                if(se.mode == Mode.Original){
                    firstElementChildHTML = html_block[0].innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
                    let dummy = $(firstElementChildHTML);    
                    se.element.innerHTML = dummy[0].firstElementChild.outerHTML;
                }else{
                    firstElementChildHTML = html_block[0].firstElementChild.innerHTML;
                    se.element.innerHTML = firstElementChildHTML;
                }
                removeSearchStyle();
                sa.search();
            }
            se.toggleEditMode();
            sa.updateSidebar();
        });

        return btn;
    }


    make_enable_btn(se) {

        let btn_name,
            sea = this;
        if (se.enabled == true){
            btn_name = "Disable";
            
        }else{
            btn_name = "Enable";
        }
        let btn = $("<button>" + btn_name + "</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_enable_btn');

        btn.click(function () {
            se.toggleEnabled();
            removeSearchStyle();
            sea.search();
            sea.updateSidebar();
        });

        return btn;
    }


    make_btn_group(se, html_block, inMMS){
        let edit_btn = this.make_edit_btn(se, html_block),
            switch_btn = this.make_switch_btn(se),
            delete_btn = this.make_delete_btn(se, inMMS),
            decompose_btn = this.make_decompose_btn(se),
            disable_btn = this.make_enable_btn(se),
            btn_group = $('<div \ >');

        btn_group.append(edit_btn);    
        btn_group.append(switch_btn);
        btn_group.append(delete_btn);
        btn_group.append(decompose_btn);
        btn_group.append(disable_btn);
        btn_group.attr('id', se.id.toString() + '_btn_g');
        
        return btn_group;    
    }


    make_text_field(se){
        let sa = this,
            pos = sa.searchElements.indexOf(se) + 1,
            tf_id = se.id.toString() + '_tf',
            txt_field = $("<input type=\"text \" id=" + tf_id + " " + "value=" + pos + "><br>");

        txt_field.addClass("cs_sb_tf"); 
        txt_field.keypress(function(e) {
            if(e.keyCode == 13){
                let to_pos = txt_field.val();
                if (to_pos > sa.searchElements.length) {
                    to_pos = sa.searchElements.length + 1;
                }
                else if (to_pos < 1){
                    to_pos = 1;
                }
                sa.move(pos - 1, to_pos - 1);
                sa.updateSidebar();
            } 
        });
          
        return txt_field;
    }


    updateMMScontainer(){
        const MMScontainer = $('#MMScontainer');
        MMScontainer.empty();
        
        let existEditMode = false;
        let searchElements = [...this.MMSElements];
        let index = 0;
        for (const se of searchElements){
            index++;

            if (se.spanned) {
                searchElements.splice(index, 0, ...se.children);
            }

            if (se.editMode) {
                existEditMode = true;
            }

            let li = $('<div draggable="true"></div>'),
                txt_field = this.make_text_field(se),
                html_block;          
            if (se.mode == Mode.Original) {
                html_block = $('<p />'); 
            }
            else{
                html_block = $('<div />');
            }
            li.append(html_block);
            html_block.append(se.getHTML())
            html_block.addClass('cs_sb_html_block');

            if (se.editMode == true) {
                html_block.attr('contenteditable', 'true');
            }
            else {
                html_block.attr('contenteditable', 'false');
            }

            let btn_group = this.make_btn_group(se, html_block, true);
            li.append(btn_group);
            li.append(txt_field);
            MMScontainer.append(li);
            
            li.on('dragstart', this, this.dragStart);
            li.on('dragend', this, this.dragEnd);
            
            btn_group.addClass('cs_sb_btn_group');
            li.addClass('cs_sb_li');
            li.addClass('cs_draggable');
            li.attr('id', se.id);
            li.attr('inMMS', se.inMMS);
            if (!se.enabled){
                li.addClass('cs_sb_disabled');
            } 
        }

        if(existEditMode){
            let draggables = [...document.getElementsByClassName("cs_draggable")];
            draggables.forEach(function(draggable){
                draggable.setAttribute("draggable", "false");
                draggable.classList.remove("cs_draggable");
            });
        }

        return;
    }


    updateSidebar() {
        let repo = $('#repo'),
            MMScontainer = $('#MMScontainer'); 
        repo.empty();
        repo.css('min-height', '500px');

        let existEditMode = false;
        repo.on('dragover', this, this.dragOver);
        MMScontainer.on('dragover', this, this.dragOver);

        let searchElements = [...this.searchElements];

        let index = 0;
        for (const se of searchElements){
            index++;

            if (se.spanned) {
                searchElements.splice(index, 0, ...se.children);
            }

            if (se.editMode) {
                existEditMode = true;
            }

            let li = $('<div draggable="true"></div>'),
                txt_field = this.make_text_field(se),
                html_block;          
            if (se.mode == Mode.Original) {
                html_block = $('<p />'); 
            }
            else{
                html_block = $('<div />');
            }
            li.append(html_block);
            html_block.append(se.getHTML())
            html_block.addClass('cs_sb_html_block');

            if (se.editMode == true) {
                html_block.attr('contenteditable', 'true');
            }
            else {
                html_block.attr('contenteditable', 'false');
            }

            let btn_group = this.make_btn_group(se, html_block, false);
            li.append(btn_group);
            li.append(txt_field);
            repo.append(li);
            
            li.on('dragstart', this, this.dragStart);
            li.on('dragend', this, this.dragEnd);
            
            btn_group.addClass('cs_sb_btn_group');
            li.addClass('cs_sb_li');
            li.addClass('cs_draggable');
            li.attr('id', se.id);
            li.attr('inMMS', se.inMMS);
            if (!se.enabled){
                li.addClass('cs_sb_disabled');
            } 
        }

        if(existEditMode){
            let draggables = [...document.getElementsByClassName("cs_draggable")];
            draggables.forEach(function(draggable){
                draggable.setAttribute("draggable", "false");
                draggable.classList.remove("cs_draggable");
            });
        }

        this.updateMMScontainer();
        
        //console.log(this.searchElements);

        return;
    }


    dragStart(event){
        let sa = event.data;
        $(this).addClass("cs_dragging");
        let id = $(this).attr('id');
        //console.log("inMMS: !!", $(this).attr("inMMS"));
        if ($(this).attr("inMMS") == 'true') {
            //console.log("if inMMS=true");
            sa.dragFromMMS = true;
            sa.draggedElementIdx = sa.getIdxFromID(id, true);
        }
        else {
            //console.log("if inMMS=false");
            sa.dragFromMMS = false;
            sa.draggedElementIdx = sa.getIdxFromID(id, false);
        }       
    }


    dragOver(event){
        event.preventDefault();
        let sa = event.data;
        
        const container = $(this)[0];
        const afterElement = getDragAfterElement(container, event.clientY);
        
        if ($(this).attr('id') == 'MMScontainer') {
            //console.log('inside if: true');
            sa.dragToMMS = true;
        }
        else if ($(this).attr('id') == 'repo') {
            //console.log('inside if: false');
            sa.dragToMMS = false;
            if (afterElement == null) {
                sa.draggedToIdx = sa.searchElements.length;
            }
            else {
                sa.draggedToIdx = sa.getIdxFromID(afterElement.id);
            }
        }
        else {
            alert('error: dragover');
        }
        //console.log('over', sa.dragToMMS);
        // console.log(sa.draggedToIdx);
    }


    dragEnd(event){
        let sa = event.data;

        //console.log('dragEnd: ', sa.dragToMMS);

        if ((!sa.dragFromMMS) && (!sa.dragToMMS)){ //searchElements to searchElements
            //console.log("searchElements to searchElements");
            if (sa.draggedToIdx == -1) {
                //console.log("draggdedToIdx = -1, error!");
                return;
            }
            else {
                $(this).removeClass("cs_dragging");
                sa.move(sa.draggedElementIdx, sa.draggedToIdx, false);
            }
        }
        else if ((!sa.dragFromMMS) && (sa.dragToMMS)) { //searchElements to MMSElements
            //console.log('Drop to MMScontainer');
            //console.log("idx: ",sa.draggedElementIdx);
            let se = sa.searchElements[sa.draggedElementIdx];
            se.inMMS = true;
            sa.MMSElements.push(sa.searchElements[sa.draggedElementIdx]);
            sa.delete(sa.draggedElementIdx, false);
        }
        else if ((sa.dragFromMMS) && (sa.dragToMMS)) { //MMSElements to MMSElements
            if (sa.draggedToIdx == -1) {
                //console.log("draggdedToIdx = -1, error!");
                return;
            }
            else {
                $(this).removeClass("cs_dragging");
                sa.move(sa.draggedElementIdx, sa.draggedToIdx, true);
            }
        }
        else { // MMSElements to searchElements
            //console.log('Drop to searchElements');
            //console.log("idx: ", sa.draggedElementIdx);
            let se = sa.MMSElements[sa.draggedElementIdx];
            se.inMMS = false;
            sa.searchElements.push(sa.MMSElements[sa.draggedElementIdx]);
            sa.delete(sa.draggedElementIdx, true);
        }

        console.log("MMSElements", sa.MMSElements);
        console.log("searchElements", sa.searchElements);
        
        sa.updateSidebar();
    }


    search() {
        let sea = [...this.searchElements];
        this.searching.search(sea);
    }
}


// Parameters:
//     - container: the DOM element that contains all draggable items
//     - y: the y position of the mouse
// Returns:
//     - the index of the element in searchList that we sould drop before
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.cs_draggable:not(.cs_dragging)')]
  
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}