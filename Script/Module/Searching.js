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

class Searching {

    constructor() {
        this.searchElements = [];
        this.lca = null;
        this.pathtree = [];
        this.lcaHeight = Number.MAX_VALUE;

        this.zeroStrategy = true;

        this.searchStrategies = new Array(getDOMTreeHeight());
        this.searchStrategies.fill(true);
        
        this.foundZeroStrategy = false;
        this.foundStrategyNum = 0;
        this.idToLevel = new Array(getDOMTreeHeight());
    }


    clear() {
        this.zeroStrategy = true;
        this.searchStrategies.fill(true);
    }


    setPara(sea) {

        this.searchElements = [];

        for (const se of sea) {
            if (se.enabled) {
                this.searchElements.push(se);
            }
            else if (se.hasspanned) {
                for (const child of se.children) {
                    sea.push(child);
                }
            }
        }

        if (this.searchElements.length == 0) {
            return;
        }

        this.lca = this.searchElements[0].element_original;

        for (const se of this.searchElements) {
            this.lca = findlca(se.element_original, this.lca);
        }  

        this.pathtree = [];

        for (const se of this.searchElements) {
            this.pathtree.push(findPath(se.element_original, this.lca));
        }

        this.lcaHeight = Number.MAX_VALUE;

        for (const path of this.pathtree) {
            this.lcaHeight = Math.min(this.lcaHeight, path.length);
        }

        this.foundZeroStrategy = false;
        this.foundStrategyNum = 0;
        this.idToLevel.fill(-1);
    }


    search(sea) {
        if (sea != null) {
            this.setPara(sea);
        }

        let lcaDepth = getDepth(this.lca),
            similarList = similarElements(this.lca); 
        
        if (lcaDepth == -1) {
            return;
        }

        if (this.zeroStrategy) {
            for (let ancestor of similarList) {
                if (ancestor != this.lca) {
                    if (this.isSameStructure(ancestor, -1, 0) === Structure.SameStructure) {
                        this.mark([ancestor, -1, 0], SAME_STYLE);
                        this.foundZeroStrategy = true;
                    }
                }
            }
        }

        for (let i = 0; i < this.lcaHeight; i++) {
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


    mark(result, style) {
        let ancestor = result[0],
            level = result[1],
            shift = result[2];

        for (let i = 0; i < this.searchElements.length; i++) {
            let path = [...this.pathtree[i]]
            if (this.searchElements[i].enabled) {
                if (level != -1) {
                    path[level] += shift;
                }
                let target = findNode(ancestor, path);
                mark_element(target, style);
            }
        }

        return;
    }

    disable_strategy(id){
        console.log("disable" + id + " strategy");
        if (id == -1){
            this.foundZeroStrategy = false;
        }
        else {
            this.foundStrategyNum--;
            this.searchStrategies[id] = false;
        }
    }

    make_choice_grp(id){
        let choice_grp = $('<div id = "choice_grp"></div>'),
            checkbox = $('<input type="checkbox" id=' + id +'>'),
            btn;
        if (id == -1) {
            btn = this.make_same_strategy_btn();
        }
        else {
            btn = this.make_similar_strategy_btn(id);
        }    
        
        choice_grp.append(checkbox);
        choice_grp.append(btn);
        choice_grp.addClass('cs_popup_choice_grp');
        return choice_grp;   
    }

    make_confirm_btn(){
        let s = this,
            btn = $("<button>Confirm</button>");
        btn.addClass("cs_sb_btn");
        // btn.addClass("cs_popup_confirm_btn");
        
        btn.attr('id', 'confirm_btn');  
        btn.click(function(){
            // Look at all checked checkboxes
            console.log("Confirm!");
            removeSearchStyle();
            
            $("input:checkbox:not(:checked)").map(function(){
                console.log(this.id);
                s.disable_strategy(this.id);  
            });
            
            s.search();
        }); 

        return btn;
    }


    // sanitize later
    make_strategy_btn() {
        let s = this,
            btn = $("<button >Choose Strategy</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'choose_btn');
        btn.click(function(){
            let popup_page = $('<div id = "cs_modal" class = "cs_modal"></div>');
            let popup_content = $(`<div class="cs_modal_content"><span id="cs_modal_close" class="cs_modal_close">&times;</span><p id="cs_modal_text">Choose Strategy</p></div>`);
            
            if (s.foundZeroStrategy) {
                popup_content.append(s.make_choice_grp(-1));
            }
            for(let i = 0; i < s.foundStrategyNum; i++){
                popup_content.append(s.make_choice_grp(i));
            }
            
            $('body').append(popup_page);
            popup_page.append(popup_content);
            popup_content.append(s.make_confirm_btn());
            
            let removeModal = () => $('#cs_modal').remove();;
            document.getElementById('cs_modal_close').addEventListener("click", removeModal);
        });
        return btn;
    }

    make_similar_strategy_btn(id){
        let btn = $("<button >Display Strategy "+ id + "</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'strategy_btn');
        btn.click(function(){
            deemphasizeStrategy();
            emphasizeSimilarStrategy(id);
        });
        return btn;
    }


    make_same_strategy_btn(){
        let btn = $("<button >Display Same Strategy</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'strategy_btn');
        btn.click(function(){
            deemphasizeStrategy();
            emphasizeSameStrategy();
        });
        return btn;
    }


    // make_disable_btn(id){
    //     let s = this,
    //         btn = $("<button> Disable Strategy</button>");
    //     btn.addClass("cs_sb_btn");
    //     btn.attr('id', 'strategy_btn' + toString(id));
        
    //     if (id == -1) {
    //         btn.click(function(){
    //             s.zeroStrategy = false;
    //             removeSearchStyle();
    //             deemphasizeStrategy();
    //             s.search();
    //         });
    //     } 
    //     else {
    //         console.log(s.foundStrategyNum);
    //         console.log(s.searchStrategies);
    //         btn.click(function(){
    //             s.toggle_strat(id);
    //             console.log(s.searchStrategies);
    //             removeSearchStyle();
    //             deemphasizeStrategy();
    //             s.search();
    //         });
    //     }
    //     return btn;
    // }


    toggle_strat(id){
        let level = this.idToLevel[id];
        if (level == -1) {
            alert("Invalid level!");
        }
        this.searchStrategies[level] = !this.searchStrategies[level];
    }
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


function nodePath(node, root) {
    let nodes = [];
    let pNode = node;

    while (pNode != root) {
        nodes.unshift(pNode);
        pNode = pNode.parentNode;
    }
    
    return nodes;
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


function similarElements(ele) {
    if (ele == null) {
        return [];
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
    if (list1.length == 0 && list2.length == 0) {
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


function emphasizeSameStrategy() {
    $(".cs_search_style_same").addClass("cs_strategy_show_style");
}


function emphasizeSimilarStrategy(id) {
    $(".cs_search_style_similar" + id.toString()).addClass("cs_strategy_show_style");
}


function deemphasizeStrategy() {
    $(".cs_strategy_show_style").removeClass("cs_strategy_show_style");
}