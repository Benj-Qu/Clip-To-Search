// Enum for display mode
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
    }

    // return the HTML code of the element for sidebar in original mode 
    originalHTML() {
        let oHTML = this.element.outerHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return oHTML;
    }

    // return the HTML code of the element for sidebar in rendered mode 
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
        switch(this.editMode){
            case true:
                this.editMode = false;
                break;
            case false:
                this.editMode = true;
                break;
        }
    }
}