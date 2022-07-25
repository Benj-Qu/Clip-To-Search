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

class SearchElementArray {
    
    constructor() {
        this.searchElements = [];
        this.bannedElements = [];
        this.searchStrategy = Strategy.All;

        this.draggedElementIdx = -1;
        this.draggedToIdx = -1;
    }


    get lca() {
        let ancestor = null;

        for (const se of this.searchElements) {
            if (se.enabled) {
                if (ancestor == null) {
                    ancestor = se.element_original;
                }
                else {
                    ancestor = findlca(se.element_original, ancestor);
                }
            }
        }

        return ancestor;
    }


    get pathtree() {
        let pathTree = [];

        let lca = this.lca

        for (const se of this.searchElements) {
            if (se.enabled) {
                pathTree.push(findPath(se.element_original, lca));
            }
            else {
                pathTree.push([]);
            }
        }

        return pathTree;
    }


    get lcaHeight() {
        let height = -1;
        let pathtree = this.pathtree;

        for (let i = 0; i < this.searchElements.length; i++) {
            let path = pathtree[i];
            if (this.searchElements[i].enabled) {
                if (height == -1) {
                    height = path.length;
                }
                else if (height > path.length) {
                    height = path.length;
                }
            }
        }

        return height;
    }


    clear() {
        this.searchElements = [];
        this.bannedElements = [];
        this.searchStrategy = Strategy.All;
        return;
    }


    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.push(searchElement);

        return;
    }


    delete(pos) {
        this.searchElements.splice(pos, 1);

        return;
    }


    insert(ele, pos) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.splice(pos, 0, searchElement);

        return;
    }


    move(from, to) {
        let moveElement = this.searchElements[from];

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


    isSameStructure(ele, shift) {
        let pathtree = this.pathtree;
        for (let i = 0; i < this.searchElements.length; i++) {
            if (this.searchElements[i].enabled) {
                let path = [...(pathtree[i])];

                if (this.lcaHeight > 1) {
                    path[1] += shift;
                    if (path[1] < 0) {
                        return Structure.NoneExist;
                    }
                }
            
                let node = findNode(ele, path);

                if (node == null) {
                    return Structure.NoneExist;
                }

                let element = this.searchElements[i].element;
                if (!isEqualNode(element, node)) {
                    return Structure.Different;
                }
            }
        }
        return Structure.SameStructure;
    }


    getSimilarStructure(ele) {
        let results = [];
        let shift;

        if (this.lcaHeight < 2) {
            return results;
        }

        shift = 1;
        while (true) {
            if (this.isSameStructure(ele,shift) === Structure.NoneExist) {
                break;
            } 
            else if (this.isSameStructure(ele,shift) === Structure.SameStructure) {
                results.push([ele, shift]);
            }
            shift++;
        }

        shift = -1;
        while (true) {
            if (this.isSameStructure(ele,shift) === Structure.NoneExist) {
                break;
            } 
            else if (this.isSameStructure(ele,shift) === Structure.SameStructure) {
                results.push([ele, shift]);
            }
            shift--;
        }

        return results;
    }


    search() {
        let lca = this.lca;
        let similarList = similarElements(lca);

        if (similarList == null || similarList.length == 0) {
            return;
        }

        let sameResults = [];

        if (this.searchStrategy === Strategy.All || 
            this.searchStrategy === Strategy.SameStructure) {
            for (const node of similarList) {
                if (this.isSameStructure(node, 0) === Structure.SameStructure) {
                    sameResults.push([node, 0]);
                }
            }
        }

        let similarResults = [];

        if (this.searchStrategy === Strategy.All || 
            this.searchStrategy === Strategy.SimilarStructure) {
            for (const node of similarList) {
                let result = this.getSimilarStructure(node);
                similarResults = similarResults.concat(result);
            }
        }

        console.log("Search Array", this.searchElements);
        console.log("Same results", sameResults);
        console.log("Similar results", similarResults);

        this.mark(sameResults, "cs_same_style");

        this.mark(similarResults, "cs_similar_style");

        return;
    }


    mark(results, style) {
        for (const result of results) {
            let node = result[0],
                shift = result[1];
            let flag = (this.lcaHeight > 1);
            let pathtree = this.pathtree;
            for (let i = 0; i < this.searchElements.length; i++) {
                let copyPath = [...pathtree[i]]
                if (this.searchElements[i].enabled) {
                    if (flag) {
                        copyPath[1] += shift;
                    }
                    let target = findNode(node, copyPath);
                    mark_element(target, style);
                }
            }
        }

        return;
    }


    getIdxFromID(id) {
        let idx = -1;

        this.searchElements.forEach(function(item, index) {
            if (item.id == id) {
                idx = index;
            }
        });

        return idx;
    }


    make_switch_button(se){
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


    make_delete_button(se){
        let sa = this;
        let btn = $("<button>Delete</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_d_btn');
        btn.click(function() {
            $(".cs_same_style").removeClass("cs_same_style");
            $(".cs_similar_style").removeClass("cs_similar_style");
            sa.delete(sa.searchElements.indexOf(se));
            sa.search();
            sa.updateSidebar();
        });
        
        return btn;
    }

    make_decompose_btn(se){
        let sl = this;
        let btn = $("<button>Decompose</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_dcp_btn');
        btn.click(function(){
            if (se.elehavechild()){
                se.decompose();
            }
            sl.updateSidebar();
        });
        return btn;
    }

    make_edit_button(se, html_block){
        let sa = this;

        let btn_name;
        if (se.editMode == true){
            btn_name = "Done";
            
        }else{
            btn_name = "Edit";
        }
        let btn = $("<button>" + btn_name + "</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_e_btn');
        
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
                $(".cs_same_style").removeClass("cs_same_style");
                $(".cs_similar_style").removeClass("cs_similar_style");
                sa.search();
            }
            se.toggleEditMode();
            sa.updateSidebar();
        });

        return btn;
    }


    make_btn_group(se, html_block){
        let edit_button = this.make_edit_button(se, html_block),
            switch_btn = this.make_switch_button(se),
            delete_btn = this.make_delete_button(se),
            decompose_btn = this.make_decompose_btn(se),
            btn_group = $('<div class="btn-toolbar btn-toolbar-primary"><i class="fa fa-cog"></i></div>'),
            toolbar = $('<div id="toolbar-options" class="hidden"></div>');

        // btn_group.append(edit_button);    
        // btn_group.append(switch_btn);
        // btn_group.append(delete_btn);
        // btn_group.append(decompose_btn);
        // btn_group.attr('id', se.id.toString() + '_btn_g');
        toolbar.append($('<a href="#"><i class="fa fa-plane"></i></a>'));
        btn_group.append(toolbar);
        
        btn_group.toolbar({
            content: '#toolbar-options',
            position: 'bottom',
            style: 'primary',
            event: 'click'
        });

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


    updateSidebar() {
        let repo = $('#repo');
        repo.empty();

        let existEditMode = false;
        repo.on('dragover', this, this.dragOver);

        for (const se of this.searchElements){
            if (se.child.length != 0) {
                for (let i=0; i < se.child.length; i++){
                    if (se.editMode){
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
                    if (se.mode == Mode.Rendered){
                        html_block.append(se.child[i].outerHTML);
                    }
                    else {
                        html_block.append(se.child[i].outerHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
                    }
                    html_block.addClass('cs_sb_html_block');

                    if (se.editMode == true) {
                        html_block.attr('contenteditable', 'true');
                    }
                    else {
                        html_block.attr('contenteditable', 'false');
                    }

                    // try toolbar
                    let bg = $('<div class="btn-toolbar btn-toolbar-info-o" id="element">Set</div>');
                    repo.append(bg);
                    let tb = $('<div id="toolbar-options", class="hidden" ><a href="#">Add</i></a><a href="#"><i class="fa fa-car"></i></a><a href="#"><i class="fa fa-bicycle"></i></a></div>');
                    repo.append(tb);
                    $('#element').toolbar({
                        content: '#toolbar-options',
                        position: 'bottom',
                        style: 'primary',
                        animation: 'flip'
                    });
                    
                    
                    
                    bg.addClass('cs_sb_btn_group');
                    //try toolbar
                    // let btn_group = this.make_btn_group(se, html_block);
                    //li.append(btn_group);
                    li.append(txt_field);
                    repo.append(li);
                    
                    li.on('dragstart', this, this.dragStart);
                    li.on('dragend', this, this.dragEnd);
                    
                    //btn_group.addClass('cs_sb_btn_group');
                    li.addClass('cs_sb_li');
                    li.addClass('cs_draggable');
                    li.attr('id', se.id);
                }
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


    dragStart(event){
        let sa = event.data;
        $(this).addClass("cs_dragging");
        let id = $(this).attr('id');
        sa.draggedElementIdx = sa.getIdxFromID(id);
    }


    dragOver(event){
        event.preventDefault();

        let sa = event.data;
        
        const container = document.querySelector('.container');
        const afterElement = getDragAfterElement(container, event.clientY);
        
        if (afterElement == null) {
            sa.draggedToIdx = sa.searchElements.length;
        }
        else {
            sa.draggedToIdx = sa.getIdxFromID(afterElement.id);
        }
    }


    dragEnd(event){
        let sa = event.data;

        if (sa.draggedToIdx == -1) {
            alert("draggdedToIdx = -1, error!");
        }
        else {
            $(this).removeClass("cs_dragging");
            sa.move(sa.draggedElementIdx, sa.draggedToIdx)
        }
        sa.updateSidebar();
    }
}


function mark_element(element, style) {
    if (!element) {
        return;
    }

    for (let i = 0; i < element.children.length; i++) {
        mark_element(element.children[i], style);
    }
    element.classList.add(style);
    
    return;
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

    if (element === ancestor) {
        return [];
    }

    for (const node of nodes) {
        let child = pNode.firstElementChild;
        let j = 0;
        while (child != node) {
            child = child.nextElementSibling;
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
            node = node.firstElementChild;
            for (let i = 0; i < rank; i++) {
                if (node == null) {
                    break;
                }
                node = node.nextElementSibling;
            }
        }
    }

    return node;
}


function findlca(ele1, ele2) {
    let lca = ele1;

    while (lca != null) {
        if (lca.contains(ele2)) {
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


function isEqualNode(ele1, ele2) {
    if (ele1 == null || ele2 == null) {
        return false;
    }

    if (!isEqualText(ele1, ele2) || !isEqualClass(ele1, ele2)) {
        return false;
    }

    let children1 = ele1.children,
        children2 = ele2.children;

    if (children1.length != children2.length) {
        return false;
    }

    for (let i = 0; i < children1.length; i++) {
        if (!isEqualNode(children1[i], children2[i])) {
            return false;
        }
    }

    return true;
}


function isEqualText(ele1, ele2) {
    let list1 = getText(ele1),
        list2 = getText(ele2);

    if (list1.length != list2.length) {
        return false;
    }
    
    for (let i = 0; i < list1.length; i++) {
        if (list1[i].data != list2[i].data) {
            return false;
        }
    }
    
    return true;
}


function getText(ele) {
    let texts = [];
    ele.childNodes.forEach(function(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            texts.push(node);
        }
    });
    return texts;
}


function isEqualClass(ele1, ele2) {
    let classList1 = ele1.classList;
    let classList2 = ele2.classList;
    return isEqualList(classList1,classList2);
}


function isEqualList(list1, list2) {
    if (list1 == null || list2 == null) {
        return false;
    }
    else if (list1.length == 0 && list2.length == 0) {
        return true;
    }
    else if (list1.length != list2.length) {
        return false;
    }

    let isEqual = true;
    
    list1.forEach(function(value) {
        if (!list2.contains(value)) {
            isEqual = false;
        }
    });

    return isEqual;
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