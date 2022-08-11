const Mode = {
	Rendered : 0,
    Original : 1
}

var counter = 0;

class SearchElement {

    constructor(ele) {
        this.id = counter++;
        this.element = ele.cloneNode(true);
        this.mode = Mode.Rendered;
        this.editMode = false;

        this.element_original = ele;
        this.enabled = true;

        this.spanned = false;
        this.hasspanned = false;
        
        this.parent = null;

        this.children = [];
            for (const child of ele.children) {
                let se = new SearchElement(child);
                se.parent = this;
                this.children.push(se);
            }
    }

    get isChild() {
        return (this.parent != null);
    }

    get spannable() {
        return (this.children.length != 0);
    }

    get spannedNum() {
        let count = 1;

        if (this.children.length == 0 || this.spanned == false) {
            return count;
        }

        for (const se of this.children) {
            count += se.spannedNum;
        }

        return count;
    }

    copyElement(se) {
        this.element.innerHTML = se.element.innerHTML;
        this.mode = se.mode;
        this.editMode = se.editMode;
        this.element_original = se.element_original;
    }

    originalHTML() {
        let oHTML = this.element.outerHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return oHTML;
    }

    renderedHTML() {
        let rHTML = this.element.outerHTML;
        return rHTML;
    }

    getHTML() {
        switch(this.mode) {
            case Mode.Rendered:
                return this.renderedHTML();
            case Mode.Original:
                return this.originalHTML();
        }
    }

    switchDisplayMode() {
        switch(this.mode) {
            case Mode.Rendered:
                this.mode = Mode.Original;
                break;
            case Mode.Original:
                this.mode = Mode.Rendered;
                break;
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    toggleSpanned() {
        this.spanned = !this.spanned;
    }

    toggleEnabled() {
        this.enabled = !this.enabled;
        this.toggleChildrenEnabled(this.enabled);
        this.toggleParentEnabled(this.enabled);
    }

    toggleChildrenEnabled(enabled) {
        for (let se of this.children) {
            se.enabled = enabled;
            se.toggleChildrenEnabled(enabled);
        }
    }

    toggleParentEnabled(enabled) {
        if (!this.isChild) {
            return;
        }

        if (enabled) {
            for (let sibling of this.parent.children) {
                if (!sibling.enabled) {
                    return;
                }
            }
        }

        this.parent.enabled = enabled;
        this.parent.toggleParentEnabled(enabled);
    }
}