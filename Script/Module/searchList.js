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
        this.modeNum = 1;

        this.searchElements = [[]];
        this.bannedElements = [[]];
        this.searchStrategy = [Strategy.All];

        this.lca = null;
        this.pathtree = [];

        this.draggedElementIdx = -1;
        this.draggedToIdx = -1;
    }


    copyList(mode) {
        let cpList = [];
        this.searchElements[mode].forEach(function(se) {
            let searchElement = new SearchElement(se.element_original);
            searchElement.copyElement(se);
            cpList.push(searchElement);
        });
        return cpList;
    }


    switchSearchMode(mode) {
        this.searchMode = mode;

        $("*").removeClass("mystyle");
        this.setLCA();
        this.setPathTree();
        this.search();

        return;
    }


    addSearchMode(mode) {
        this.modeNum++;
        this.searchStrategy.push(Strategy.All);
        this.bannedElements.push([]);

        if (mode != -1) {
            let copyList = this.copyList(mode);
            this.searchElements.push(copyList);
        }
        else {
            this.searchElements.push([]);
        }

        return;
    }


    deleteSearchMode(mode) {
        this.searchElements.splice(mode, 1);
        this.bannedElements.splice(mode, 1);
        this.searchStrategy.splice(mode, 1);
    }


    clear() {
        this.lca = null;
        this.searchElements = [[]];
        this.bannedElements = [[]];
        this.pathtree = [];
        this.searchStrategy = [Strategy.All];

        return;
    }


    append(ele) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements[this.searchMode].push(searchElement);

        if (this.searchElements[this.searchMode].length == 1) {
            this.setLCA();
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();

        return;
    }


    delete(pos) {
        this.searchElements[this.searchMode].splice(pos, 1);

        this.setLCA();

        this.setPathTree();

        return;
    }


    insert(ele, pos) {
        let searchElement = new SearchElement(ele);

        this.removeChild(ele);
        this.searchElements[this.searchMode].splice(pos, 0, searchElement);

        if (this.searchElements[this.searchMode].length == 1) {
            this.setLCA();
        }
        else {
            this.updateLCA(ele);
        }

        this.setPathTree();

        return;
    }


    move(from, to) {
        let moveElement = this.searchElements[this.searchMode][from];

        if (from > to) {
            this.searchElements[this.searchMode].splice(from, 1);
            this.searchElements[this.searchMode].splice(to, 0, moveElement);
        }
        else if (from < to) {
            this.searchElements[this.searchMode].splice(to, 0, moveElement);
            this.searchElements[this.searchMode].splice(from, 1);
        } 

        return;
    }


    removeChild(ele) {
        let len = this.searchElements[this.searchMode].length;

        for (let i = 0; i < len; i++) {
            if (ele.contains(this.searchElements[this.searchMode][len-i-1].element_original)) {
                this.delete(len-i-1);
            }
        }
    }


    clearMode() {
        this.lca = null;
        this.searchElements[this.searchMode] = [];
        this.bannedElements[this.searchMode] = [];
        this.searchStrategy[this.searchMode] = Strategy.All;
        this.pathtree = [];

        return;
    }


    isDuplicate(ele) {
        for (const se of this.searchElements[this.searchMode]) {
            if (ele === se.element_original) {
                return true;
            }
        }

        return false;
    }


    isContained(ele) {
        for (const se of this.searchElements[this.searchMode]) {
            if (se.element_original.contains(ele)) {
                return true;
            }
        }
        
        return false;
    }


    setLCA() {
        this.lca = null;

        for (const se of this.searchElements[this.searchMode]) {
            if (this.lca == null) {
                this.lca = se.element_original;
            }
            else {
                this.lca = findlca(se.element_original, this.lca);
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

        for (const se of this.searchElements[this.searchMode]) {
            this.pathtree.push(findPath(se.element_original, this.lca));
        }

        return;
    }


    getIdxFromID(id){
        let idx = -1;

        this.searchElements[this.searchMode].forEach(function(item, index) {
            if (item.id == id) {
                idx = index;
            }
        });

        return idx;
    }


    make_switch_button(se){
        let sl = this;
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
            sl.updateSidebar();
        });
        
        return btn;
    }


    make_delete_button(se){
        let sl = this;
        let btn = $("<button>Delete</button>");

        btn.addClass("cs_sb_btn");
        btn.attr('id', se.id.toString() + '_d_btn');
        btn.click(function() {
            $("*").removeClass("mystyle");
            sl.delete(sl.searchElements[sl.searchMode].indexOf(se));
            sl.search();
            sl.updateSidebar();
        });
        
        return btn;
    }


    make_edit_button(se, html_block){
        let sl = this;

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
                }else{
                    firstElementChildHTML = html_block[0].firstElementChild.innerHTML;
                }
                se.element.innerHTML = firstElementChildHTML
                $("*").removeClass("mystyle");
                sl.setLCA();
                sl.setPathTree();
                sl.search();
            }
            se.toggleEditMode();
            sl.updateSidebar();
        });

        return btn;
    }


    make_btn_group(se, html_block){
        let edit_button = this.make_edit_button(se, html_block),
            switch_btn = this.make_switch_button(se),
            delete_btn = this.make_delete_button(se),
            btn_group = $("<div />");

        btn_group.append(edit_button);    
        btn_group.append(switch_btn);
        btn_group.append(delete_btn);
        btn_group.attr('id', se.id.toString() + '_btn_g');

        return btn_group;    
    }


    make_text_field(se){
        let sl = this,
            pos = sl.searchElements[sl.searchMode].indexOf(se) + 1,
            tf_id = se.id.toString() + '_tf',
            txt_field = $("<input type=\"text \" id=" + tf_id + " " + "value=" + pos + "><br>");

        txt_field.addClass("cs_sb_tf"); 
        txt_field.keypress(function(e) {
            if(e.keyCode == 13){
                let to_pos = txt_field.val();
                if (to_pos > sl.searchElements[sl.searchMode].length) {
                    to_pos = sl.searchElements[sl.searchMode].length + 1;
                }
                else if (to_pos < 1){
                    to_pos = 1;
                }
                sl.move(pos - 1, to_pos - 1);
                sl.updateSidebar();
            } 
        });
          
        return txt_field;
    }


    updateSidebar() {
        let repo = $('#repo');
        repo.empty();

        for (const se of this.searchElements[this.searchMode]){

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
            html_block.append(se.getHTML());
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
            li.addClass('draggable');
            li.attr('id', se.id);
        }

        return;
    }


    dragStart(event){
        let sl = event.data;
        $(this).addClass("dragging");
        let id = $(this).attr('id');
        sl.draggedElementIdx = sl.getIdxFromID(id);
    }


    dragOver(event){
        event.preventDefault();

        let sl = event.data;
        
        const container = document.querySelector('.container');
        const afterElement = getDragAfterElement(container, event.clientY);
        
        if (afterElement == null) {
            sl.draggedToIdx = sl.searchElements[sl.searchMode].length;
        }
        else {
            sl.draggedToIdx = sl.getIdxFromID(afterElement.id);
        }
    }


    dragEnd(event){
        let sl = event.data;

        if (sl.draggedToIdx == -1) {
            alert("draggdedToIdx = -1, error!");
        }
        else {
            $(this).removeClass("dragging");
            sl.move(sl.draggedElementIdx, sl.draggedToIdx)
        }
        sl.updateSidebar();
    }


    isSameStructure(ele, shift = 0) {
        for (let i = 0; i < this.searchElements[this.searchMode].length; i++) {
            let node = findNode(ele, this.pathtree[i]);
            for (let j = 0; j < shift; j++) {
                if (node == null) {
                    return Structure.NoneExist;
                }
                node = node.nextSibling;
            }
            for (let j = 0; j > shift; j--) {
                if (node == null) {
                    return Structure.NoneExist;
                }
                node = node.previousSibling;
            }

            let element = this.searchElements[this.searchMode][i].element;
            if (!isEqualNode(element, node)) {
                return Structure.Different;
            }
        }
        return Structure.SameStructure;
    }


    getSimilarStructure(ele) {
        let shift;
        shift = 0;
        while (true) {
            if (true) {
                break;
            }
            shift++;
        }

        shift = 0;
        while (true) {
            if (true) {
                break;
            }
            shift--;
        }

        for (let i = 0; i < this.searchElements[this.searchMode].length; i++) {
            let path = this.pathtree[i];
            let node = findNode(ele, path);

            let shift = 0;
            let element = this.searchElements[this.searchMode][i].element;
            if (!isEqualNode(element, node)) {
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

        if (this.searchStrategy === Strategy.All || this.searchStrategy === Strategy.SameStructure) {
            for (const node of similarList) {
                if (this.isSameStructure(node) === Structure.SameStructure) {
                    results.push([node, 0]);
                }
            }
        }

        if (this.searchStrategy === Strategy.All || this.searchStrategy === Strategy.SimilarStructure) {

        }
        
        

        for (const result of results) {
            let node = result[0];
            for (const path of this.pathtree) {
                let target = findNode(node, path);
                mark(target);
            }
        }

        return;
    }
}



function mark(element) {
    if (element.childNodes.length > 0) {
        element.childNodes.forEach(function(ele) {
            mark(ele);
        });
    }
    if (element.classList != null) {
        element.classList.add("cs_same_style");
    }
    
    return;
}


// Parameters:
//     - container: the DOM element that contains all draggable items
//     - y: the y position of the mouse
// Returns:
//     - the index of the element in searchList that we sould drop before
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
  
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

    return isEqualHTML(ele1,ele2) && isEqualClass(ele1,ele2);
}


function isEqualHTML(ele1, ele2) {
    return (ele1.innerHTML == ele2.innerHTML);
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