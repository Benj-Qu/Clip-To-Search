const Structure = {
    SameStructure : 0,
    NoneExist : 1,
    Different : 2
}

const SELF_STYLE = "cs_search_style_self",
      SAME_STYLE = "cs_search_style_same",
      SIMILAR_STYLE = "cs_search_style_similar";

const CS_SEARCH_PATTERN = new RegExp('cs_search_style');
      
const SIMILAR_STYLE_NUM = 20;

class SearchElementArray {
    
    constructor() {
        this.searchElements = [];

        this.zeroStrategy = true;
        this.searchStrategies = new Array(getDOMTreeHeight());
        this.searchStrategies.fill(true);

        this.idToLevel = new Array(getDOMTreeHeight());
        this.idToLevel.fill(-1);

        this.foundZeroStrategy = false;
        this.foundStrategyNum = 0;

        this.draggedElementIdx = -1;
        this.draggedToIdx = -1;

        this.lcaRecord = null;
        this.lcaUpdated = false;
        this.pathtreeRecord = null;
        this.pathtreeupdated = false;
        this.lcaheightRecord = null;
        this.lcaheightUpdated = false;
    }


    get lca() {
        let ancestor = null;

        if (this.lcaUpdated) {
            return this.lcaRecord;
        }

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
        this.lcaUpdated = true; 
        this.lcaRecord = ancestor;  

        return ancestor; 
    }


    get pathtree() {
        let pathtree = [];

        if (this.pathtreeupdated) {
            return this.pathtreeRecord;
        }

        for (const se of this.searchElements) {
            if (se.enabled) {
                pathtree.push(findPath(se.element_original, this.lca));
            }
            else {
                pathtree.push([]);
            }
        }

        this.pathtreeupdated = true;
        this.pathtreeRecord = pathtree;

        return pathtree;
    }


    get lcaHeight() {
        let height = Number.MAX_VALUE;

        if (this.lcaheightUpdated) {
            return this.lcaheightRecord;
        }

        for (let i = 0; i < this.searchElements.length; i++) {
            let path = this.pathtree[i];
            if (this.searchElements[i].enabled) {
                height = Math.min(height, path.length);
                height = path.length;
            }
        }

        this.lcaheightUpdated = true;
        this.lcaheightRecord = height;

        return height;
    }


    cleanRecord() {
        this.foundStrategyNum = 0;
        this.foundZeroStrategy = false;
        this.lcaUpdated = false;
        this.pathtreeupdated = false;
    }

    clear() {
        this.searchElements = [];
        this.searchStrategies.fill(true);

        this.cleanRecord();

        return;
    }


    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.push(searchElement);

        this.cleanRecord();

        return;
    }


    delete(pos) {
        this.searchElements.splice(pos, 1);

        this.cleanRecord();

        return;
    }


    insert(ele, pos) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements.splice(pos, 0, searchElement);

        this.cleanRecord();

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


    isSameStructure(ele, level, shift) {
        for (let i = 0; i < this.searchElements.length; i++) {
            if (this.searchElements[i].enabled) {
                let path = [...(this.pathtree[i])];

                if (level != -1) {
                    path[level] += shift;
                    if (path[level] < 0) {
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


    findSimilarStructure(similarList, level) {
        let shift,
            foundStrategy = false,
            strategyID = this.foundStrategyNum.toString();

        for (let ele of similarList) {
            shift = 1;
            while (true) {
                if (this.isSameStructure(ele,level,shift) === Structure.NoneExist) {
                    break;
                } 
                else if (this.isSameStructure(ele,level,shift) === Structure.SameStructure) {
                    this.mark([ele, level, shift], SIMILAR_STYLE + strategyID);
                    foundStrategy = true;
                    this.idToLevel[this.foundStrategyNum] = level + getDepth(this.lca);
                }
                shift++;
            }

            shift = -1;
            while (true) {
                if (this.isSameStructure(ele,level,shift) === Structure.NoneExist) {
                    break;
                } 
                else if (this.isSameStructure(ele,level,shift) === Structure.SameStructure) {
                    this.mark([ele, level, shift], SIMILAR_STYLE + strategyID);
                    foundStrategy = true;
                    this.idToLevel[this.foundStrategyNum] = level + getDepth(this.lca);
                }
                shift--;
            }
        }

        if (foundStrategy) {
            this.foundStrategyNum++;
        }

        return;
    }


    search() {
        let lcaDepth = getDepth(this.lca),
            lcaHeight = this.lcaHeight,
            similarList = similarElements(this.lca); 

        this.foundZeroStrategy = false;
        this.foundStrategyNum = 0;

        this.idToLevel.fill(-1);
        
        if (lcaDepth == -1) {
            return;
        }

        if (this.zeroStrategy) {
            for (let ancestor of similarList) {
                if (this.isSameStructure(ancestor, -1, 0) === Structure.SameStructure) {
                    this.mark([ancestor, -1, 0], SAME_STYLE);
                    this.foundZeroStrategy = true;
                }
            }
        }

        for (let i = 0; i < lcaHeight; i++) {
            if (this.searchStrategies[i+lcaDepth]) {
                this.findSimilarStructure(similarList, i);
            }
        }   
        
        for (let se of this.searchElements) {
            unmark_element(se.element_original);
            mark_element(se.element_original, SELF_STYLE);
        }

        return;
    }


    mark(result, style) {
        let node = result[0],
            level = result[1],
            shift = result[2];

        for (let i = 0; i < this.searchElements.length; i++) {
            let path = [...this.pathtree[i]]
            if (this.searchElements[i].enabled) {
                if (level != -1) {
                    path[level] += shift;
                }
                let target = findNode(node, path);
                mark_element(target, style);
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
            removeSearchStyle();
            let pos = sa.searchElements.indexOf(se);
            sa.delete(pos);
            sa.search();
            sa.updateSidebar();
        });
        
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
            se.toggleSpanned();
            sa.updateSidebar();
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

    make_enable_button(se) {
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
            sea.updateSidebar();
        });

        return btn;
    }


    make_btn_group(se, html_block){
        let edit_button = this.make_edit_button(se, html_block),
            switch_btn = this.make_switch_button(se),
            delete_btn = this.make_delete_button(se),
            decompose_btn = this.make_decompose_btn(se),
            disable_btn = this.make_enable_button(se),
            btn_group = $('<div \ >');

        btn_group.append(edit_button);    
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


    updateSidebar() {
        let repo = $('#repo');
        repo.empty();

        let existEditMode = false;
        repo.on('dragover', this, this.dragOver);

        let searchElements = [...this.searchElements];

        let index = 0;
        for (const se of searchElements){
            index++;

            if (se.spanned == true){
                searchElements.splice(index, 0, ...se.children);
            }

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
            html_block.append(se.getHTML())
            html_block.addClass('cs_sb_html_block');

            if (se.editMode == true) {
                html_block.attr('contenteditable', 'true');
            }
            else {
                html_block.attr('contenteditable', 'false');
            }

            let btn_group = this.make_btn_group(se, html_block);
            li.append(btn_group);
            li.append(txt_field);
            repo.append(li);
            
            li.on('dragstart', this, this.dragStart);
            li.on('dragend', this, this.dragEnd);
            
            btn_group.addClass('cs_sb_btn_group');
            li.addClass('cs_sb_li');
            li.addClass('cs_draggable');
            li.attr('id', se.id);
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


function unmark_element(element) {
    if (!element) {
        return;
    }

    for (let i = 0; i < element.children.length; i++) {
        unmark_element(element.children[i]);
    }

    removeSearchStyle(element);
    
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
    let classList1 = neglectCSClass(ele1.classList);
    let classList2 = neglectCSClass(ele2.classList);
    return isEqualList(classList1,classList2);
}


function neglectCSClass(classList) {
    let list = [];
    for (let value of classList.values()) {
        if (!CS_SEARCH_PATTERN.test(value)) {
            list.push(value);
        }
    }
    return list;
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
        if (!list2.includes(value)) {
            isEqual = false;
        }
    });

    return isEqual;
}


function getHeight(root) {
    // leaf height 1
    if (root == null) {
        return 0;
    }
    
    let maxHeight = 0;
    
    Array.from(root.children).forEach((child) => {
        maxHeight = Math.max(maxHeight,getHeight(child));
    });
    
    return (maxHeight + 1);
}


function getDOMTreeHeight() {
    return getHeight(document.documentElement);
}


function getDepth(ele) {
    // root depth 0
    let depth = 0;

    if (ele == null) {
        return -1;
    }

    while (ele.parentElement != null) {
        depth++;
        ele = ele.parentElement;
    }
    return depth;
}


function removeSearchStyle(element) {
    if (element == undefined) {
        $('.' + SELF_STYLE).removeClass(SELF_STYLE);
        $('.' + SAME_STYLE).removeClass(SAME_STYLE);
        for (let i = 0; i < SIMILAR_STYLE_NUM; i++) {
            let style = SIMILAR_STYLE + i.toString();
            $('.' + style).removeClass(style);
        }
    }
    else {
        element.classList.remove(SELF_STYLE, SAME_STYLE);
        for (let i = 0; i < SIMILAR_STYLE_NUM; i++) {
            element.classList.remove(SIMILAR_STYLE + i.toString());
        }
    }

    return;
}


function emphasizeSameStrategy() {
    $(".cs_search_style_same").addClass("cs_strategy_show_style");
}


function emphasizeSimilarStrategy(id) {
    $(".cs_search_style_similar" + id.toString()).addClass("cs_strategy_show_style");
}


function deemphasizeStrategy() {
    $(".cs_strategy_show_style").removeClass("cs_strategy_show_style");
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