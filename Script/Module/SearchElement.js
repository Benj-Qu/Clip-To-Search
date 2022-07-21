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
        this.children = [];
            for (const child of ele.children) {
                this.children.push(new SearchElement(child));
            }
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
}