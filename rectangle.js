var selectionRectangle; //
// test

if (!selectionRectangle) {

    class SelectionRectangle {
        
        constructor (canvasElementId, optionsElementId) {
            this.canvasElementId = canvasElementId;
            this.optionsElementId = optionsElementId;

            this.activeColor = null;
            this.canvas = null;
            this.startX = null, this.startY = null, this.isDraw = false;
            this.enabled = false;
            this.objectToSearch = [];
        }

        rectangleSelect(x1, y1, x2, y2) {
            let x_large = x1 > x2 ? x1 : x2,
                x_small = x1 < x2 ? x1 : x2,
                y_large = y1 > y2 ? y1 : y2,
                y_small = y1 < y2 ? y1 : y2;
        
            // console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);
            const allElements = document.getElementsByTagName('*');
        
            optionsHtml -= "</ul>"
            for (const element of allElements) {
                let pos = getPos(element);
                let x_l = pos[0],
                    x_r = pos[1],
                    y_t = pos[2],
                    y_d = pos[3];
                if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
                    if (x_l != x_r && y_t != y_d && !checkExisted(element, this.objectToSearch)) {
                       this.objectToSearch.push(element);
                       optionsHTML += `
                       `;
                    }
                }
            }

            optionsHtml
            
        }

        setColor (color) {
            switch (color) {
                case 'blue':
                    this.setRectRGBA(0, 50, 255, 0.2, 0.5);
                    break;
                case 'green':
                    this.setRectRGBA(0, 255, 0, 0.25, 0.6);
                    break;
                case 'red':
                    this.setRectRGBA(255, 0, 0, 0.2, 0.6);
                    break;
                case 'white':
                    this.setRectRGBA(255, 255, 255, 0.2, 0.6);
                    break;
                case 'black':
                    this.setRectRGBA(0, 0, 0, 0.2, 0.6);
                    break;
                default:
                    this.setRectRGBA(255, 255, 0, 0.2, 0.6);
                    color = 'yellow';
            }

            let elems = document.getElementsByClassName("srh_color_button");
            Array.from(elems).forEach(elem => {
                elem.className = elem.className.replace(" srh_active", "");
            });
            document.getElementById("srh_color_"+color).className += " srh_active"; 
            this.activeColor = color;
            this.updateMinimizedOptionsTitle();
        }

        setRectRGBA (r, g, b, bgTransparency, borderTransparency) {
            let base = "rgba("+r+","+g+","+b+",";
            this.rectangleBackgroundColor = base + bgTransparency + ")";
            this.rectangleBorderColor = base + borderTransparency + ")";
        }

        createCanvas () {
            let canvas = document.createElement('canvas');
            canvas.id = this.canvasElementId;
            canvas.className = 'srh_canvas';
            
            canvas.addEventListener('mousedown', e => this.mouseEvent('down', e) );
            canvas.addEventListener('mousemove', e => this.mouseEvent('move', e) );
            canvas.addEventListener('mouseup', e => this.mouseEvent('up', e) );
            canvas.addEventListener('mouseout', e => this.mouseEvent('out', e) );
            
            document.body.appendChild(canvas);
            this.canvas = canvas;
            this.canvasResize();
        }

        clearCanvas () {
            if (!this.canvas) return;

            let context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        drawBox (sX, sY, eX, eY, bgColor, borderColor) {
            if (!this.canvas) return;

            let context = this.canvas.getContext("2d");
            context.fillStyle = bgColor;
            context.fillRect(sX+0.5, sY+0.5, eX-sX, eY-sY);
            context.strokeStyle = borderColor;
            context.lineWidth = 1.0;
            context.strokeRect(sX+0.5, sY+0.5, eX-sX, eY-sY);
        }

        canvasResize () {
            if (!this.canvas) return;

            this.canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth 
                || screen.width);
            this.canvas.height = document.documentElement.clientHeight;

            this.clearCanvas();

            if (this.options) {     // move options window back to initial position
                this.options.style.top = "10px";
                this.options.style.left = "auto";
                this.options.style.right = "10px";
            }
        }

        mouseEvent (eventType, event) {
                let x = event.clientX;
                let y = event.clientY;
                if (eventType == 'down') {
                    this.startX = x;
                    this.startY = y;
                    this.isDraw = true;
                } else if (eventType == 'move') {
                    if (this.isDraw) {
                        this.clearCanvas();
                        this.drawBox(this.startX, this.startY, x, y, 
                            this.rectangleBackgroundColor, this.rectangleBorderColor);
                    }
                } else if (eventType == 'up' || eventType == 'out') {
                    if (eventType == 'up' && this.enabled) {
                        this.objectToSearch = this.rectangleSelect(this.startX, this.startY, x, y);
                        $("*").removeClass("mystyle");
                        searchelement(this.objectToSearch)
                    } 

                    //console.log(this.objectToSearch);

                    this.isDraw = false;
                    this.clearCanvas();
                }
        }

        clearResults(){
            this.objectToSearch = [];
            $("*").removeClass("mystyle");
        }

        static optionsHtml = `
        
        <div id="srh_maximized">
            <div id="srh_options_heading" class="srh_h1">Options</div>
            <div class="srh_colors">
                <div class="srh_color_button srh_yellow" id="srh_color_yellow"> </div><div class="srh_color_button srh_blue" id="srh_color_blue"></div><div class="srh_color_button srh_green" id="srh_color_green"></div><div class="srh_color_button srh_red" id="srh_color_red"></div><div class="srh_color_button srh_white" id="srh_color_white"></div><div class="srh_color_button srh_black" id="srh_color_black"></div>
            </div>
            <div class="cts_clr_btn" id="clr_btn">Clear</div>
            <div class="srh_flags">
                <input type="checkbox" id="srh_active" name="active"/>
                <label id="srh_active" for="srh_active">Active</label> 
            </div>
            <div class="srh_control_button srh_control_minmax" id="srh_minimize" title="Minimize">▲</div>
        </div>
        <div id="srh_minimized" style="display: none">
            <div id="srh_options_heading_minimized" class="srh_h1">Options</div>
            <div class="srh_control_button srh_control_minmax" id="srh_maximize" title="Maximize">▼</div>
        </div>
        <div class="srh_control_button srh_control_help" id="srh_help" title="Help">?</div>
        <div class="srh_control_button srh_control_close" id="srh_close" title="Close (or press ESC)">&times;</div>
        <div>Search items:</div>
        <ul>

        </ul>
        `;

        static helpHtml = `<div class="srh_modal_content"><span id="srh_modal_close" class="srh_modal_close">&times;</span><p id="srh_modal_text">...</p></div>`;

        createOptions () {
            let options = document.createElement('div');
            options.id = this.optionsElementId;
            options.setAttribute('class', 'srh_options');
            options.innerHTML = SelectionRectangle.optionsHtml;

            document.body.appendChild(options);
            this.options = options;

            let colors = ['yellow', 'blue', 'green', 'red', 'white', 'black'];
            for (let color of colors) {
                document.getElementById('srh_color_'+color).addEventListener('click', 
                    () => this.setColor(color));
            }

            document.getElementById("clr_btn").addEventListener("click", () => {
                // TODO: replace with a clear function
                selectionRectangle.clearResults();
            });

            document.getElementById('srh_active').addEventListener("click", () => {
                this.switchActiveMode(false);
            });


            document.getElementById('srh_close').addEventListener("click", () => {
                    this.remove();
                });

            document.getElementById('srh_maximize').addEventListener("click", () => {
                    document.getElementById("srh_minimized").setAttribute('style', 'display: none');
                    document.getElementById("srh_maximized").setAttribute('style', 'display: block');
                });
            document.getElementById('srh_minimize').addEventListener("click", () => {
                    document.getElementById("srh_maximized").setAttribute('style', 'display: none');
                    document.getElementById("srh_minimized").setAttribute('style', 'display: block');
                });

            document.getElementById('srh_help').addEventListener('click', () => {
                    let helpModal = document.createElement("div");
                    helpModal.id = "srh_modal";
                    helpModal.setAttribute('class', 'srh_modal');
                    helpModal.innerHTML = SelectionRectangle.helpHtml;
                    document.body.appendChild(helpModal);
                    document.getElementById('srh_modal_text').innerHTML = chrome.i18n.getMessage("help_text");
                    let removeModal = () => document.body.removeChild(document.getElementById('srh_modal'));
                    document.getElementById('srh_modal_close').addEventListener("click", removeModal);
                });

            this.options.addEventListener("mousedown", e => this.optionsDrag(e));
            document.addEventListener("mouseup", e => this.optionsDrop(e));
            document.addEventListener("mousemove", e => this.optionsMove(e));
            this.optionsDragData = { isDragged: false, sX: 0, sY: 0 };

            // i18n
            let translateInnerHtml = ["options_heading"];
            for (let t of translateInnerHtml) {
                document.getElementById('srh_'+t).innerHTML = chrome.i18n.getMessage(t);
            }

            let translateTitle = ["minimize", "maximize", "help", "color_yellow", "color_blue", "color_green", "color_red", "color_white", "color_black"];
            for (let t of translateTitle) {
                document.getElementById('srh_'+t).setAttribute("title", chrome.i18n.getMessage(t));
            }

        }

        optionsDrag (e) {
            this.optionsDragData.isDragged = true;
            this.optionsDragData.sX = e.clientX;
            this.optionsDragData.sY = e.clientY;
        }

        optionsMove (e) {
            if (!this.optionsDragData.isDragged) return;

            let nX = this.optionsDragData.sX - e.clientX;
            let nY = this.optionsDragData.sY - e.clientY;
            this.optionsDragData.sX = e.clientX;
            this.optionsDragData.sY = e.clientY;
            this.options.style.top = (this.options.offsetTop - nY) + "px";
            this.options.style.left = (this.options.offsetLeft - nX) + "px";
            this.options.style.right = "auto";
            e.preventDefault();     // prevents text being selected
        }

        optionsDrop () {
            this.optionsDragData.isDragged = false;
        }

        updateMinimizedOptionsTitle () {
            if (this.isEnabled() && this.activeColor) {
                let title =  chrome.i18n.getMessage("color_"+this.activeColor);
                document.getElementById("srh_options_heading_minimized").innerHTML = title;
            }
        }

        switchActiveMode (changeCheckedStatus) {
            if (changeCheckedStatus) {
                let checkbox = document.getElementById("srh_active");
                checkbox.checked = !checkbox.checked;
            }
            if (!this.isActiveMode()) {
                if (!this.canvas) return;      
                document.body.removeChild(this.canvas);
                this.canvas = null;
                this.enabled = false;
            } else {
                this.enable();
                
            }
            this.updateMinimizedOptionsTitle();
        }

        isActiveMode () {
            let checkBox = document.getElementById("srh_active");
            return checkBox && checkBox.checked;
        }

        enable () {
            if (!document.getElementById(this.canvasElementId)) {
                this.createCanvas();
            }
            if (!document.getElementById(this.optionsElementId)) {
                this.createOptions();
            }
            this.setColor("yellow");
            this.enabled = true;
        }

        init () {
            if (!document.getElementById(this.optionsElementId)) {
                this.createOptions();
            }
            this.setColor("yellow");
        }

        remove () {
            if (this.canvas) {
                document.body.removeChild(this.canvas);
                this.canvas = null;
            }
            if (this.options) {
                document.body.removeChild(this.options);
                this.options = null;
            }
            this.enabled = false;
            $("*").removeClass("mystyle");
        }

        isEnabled () {
            return this.options ? true : false;
        }

    }

    selectionRectangle = new SelectionRectangle('selectionRectangle_canvas','selectionRectangle_options');

    chrome.runtime.onMessage.addListener(function(request, sender, response){
        //console.log("onMessge");
        console.log("request received: ", request);
        switch(request){
            case "switch":
                console.log("Switch request received.");
                selectionRectangle.switchActiveMode(true);
                break;
            case "clear":
                selectionRectangle.clearResults();
                break;
            case "delete":
                //console.log("Delete request received.");
                selectionRectangle.objectToSearch.pop();
                //console.log(selectionRectangle.objectToSearch);
                break;
            default:
                console.log("No command received.");
                break;
        }

    });

    
    window.addEventListener("resize", () => selectionRectangle.canvasResize());

    selectionRectangle.init();

} else {

    if (selectionRectangle.isEnabled()) {
        selectionRectangle.remove();
    } else {
        selectionRectangle.init();
    }

}