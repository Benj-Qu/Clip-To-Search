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
        let moveElement = this.searchElements[from];

        this.searchElements.splice(from, 1);
        this.searchElements.splice(to, 0, moveElement);

        return;
    }


    removeChild(ele) {
        let len = this.searchElements.length;

        for (let i = 0; i < len; i++) {
            if (ele.contains(this.searchElements[len-i-1].element_original)) {
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


    setLCA() {
        this.lca = null;

        for (const se of this.searchElements) {
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

        for (const se of this.searchElements) {
            this.pathtree.push(findPath(se.element_original, this.lca));
        }

        return;
    }


    make_switch_button(ele){
        let sl = this;
        let btn_name;
        if (ele.mode === Mode.Original){
            btn_name = "Rendered";
        }else{
            btn_name = "Raw";
        }
        let btn = $("<button>" + btn_name + "</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', ele.id.toString() + '_s_btn');
        btn.click(function() {
            ele.switchDisplayMode();
            sl.updateSidebar();
        });
        
        return btn;
    }

    make_delete_button(ele){
        let sl = this;
        let btn = $("<button>Delete</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', ele.id.toString() + '_d_btn');
        btn.click(function() {
            $("*").removeClass("mystyle");
            sl.delete(sl.searchElements.indexOf(ele));
            // search the list again
            sl.search();
            sl.updateSidebar();
        });
        
        return btn;
    }

    make_btn_group(ele){
        let switch_btn = this.make_switch_button(ele),
            delete_btn = this.make_delete_button(ele),
            btn_group = $("<div />");
        btn_group.append(switch_btn);
        btn_group.append(delete_btn);
        btn_group.attr('id', ele.id.toString() + '_btn_g');
        return btn_group;    
    }

    make_text_field(ele){
        let sl = this,
            pos = sl.searchElements.indexOf(ele) + 1,
            tf_id = ele.id.toString() + '_tf',
            txt_field = $("<input type=\"text \" id=" + tf_id + " " + "value=" + pos + "><br>");
        txt_field.addClass("cs_sb_tf"); 
        txt_field.keypress(function(e){
            if(e.keyCode == 13){
                let to_pos = txt_field.val();
                if (to_pos > sl.searchElements.length){
                    to_pos = sl.searchElements.length + 1;
                }else if (to_pos < 1){
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

        for (const ele of this.searchElements){
            let li = $('<li></li>'),
                // switch_btn = this.make_switch_button(ele),
                // delete_btn = this.make_delete_button(ele);
                div_line = $('<hr class="solid">').addClass('cs_sb_div_line'),
                txt_field = this.make_text_field(ele),
                btn_group = this.make_btn_group(ele);
            btn_group.addClass('cs_sb_btn_group');
           
            if(ele.mode === Mode.Original){
                let html_block = $('<p />');
                li.append(html_block);
                html_block.append(ele.getHTML());
                html_block.addClass('cs_sb_html_block');
            }
            else{
                let html_block = $('<div />');
                li.append(html_block);
                html_block.append(ele.getHTML());
                html_block.addClass('cs_sb_html_block');
            }

            li.append(btn_group);
            li.append(txt_field);
            repo.append(li);

            repo.append(div_line);
        }

        return;
    }


    isSameStructure(ele) {
        let i = 0;

        for (let i = 0; i < this.searchElements.length; i++) {
            let node = findNode(ele, this.pathtree[i]);
            let element = this.searchElements[i].element;
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
    if ((list1 == null && list2 == null) || 
        (list1 == null && list2.length == 0) || (list1.length == 0 && list2 == null) ||
        (list1.length == 0 && list2.length == 0)) {
        return true;
    }
    else if (list1 == null || list2 == null) {
        return false;
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