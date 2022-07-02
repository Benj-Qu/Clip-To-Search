var clipSearch;

if (!clipSearch) {

    class ClipSearch {
        
        constructor (canvasElementId, optionsElementId) {
            this.canvasElementId = canvasElementId;
            this.optionsElementId = optionsElementId;

            this.activeColor = null;
            this.canvas = null;
            this.startX = null, this.startY = null, this.isDraw = false;
            this.enabled = false;
            this.searchList = new SearchList();
            this.optionsHtml = `
                <div id="cs_maximized">
                    <div id="cs_options_heading" class="cs_h1">Options</div>
                    <div class="cs_colors">
                        <div class="cs_color_button cs_yellow" id="cs_color_yellow"> </div><div class="cs_color_button cs_blue" id="cs_color_blue"></div><div class="cs_color_button cs_green" id="cs_color_green"></div><div class="cs_color_button cs_red" id="cs_color_red"></div><div class="cs_color_button cs_white" id="cs_color_white"></div><div class="cs_color_button cs_black" id="cs_color_black"></div>
                    </div>
                    <div class="cts_clr_btn" id="clr_btn">Clear</div>
                    <div class="cs_flags">
                        <input type="checkbox" id="cs_active" name="active"/>
                        <label id="cs_active" for="cs_active">Active</label> 
                    </div>
                    <div class="cs_control_button cs_control_minmax" id="cs_minimize" title="Minimize">▲</div>
                </div>
                <div id="cs_minimized" style="display: none">
                    <div id="cs_options_heading_minimized" class="cs_h1">Options</div>
                    <div class="cs_control_button cs_control_minmax" id="cs_maximize" title="Maximize">▼</div>
                </div>
                <div class="cs_control_button cs_control_help" id="cs_help" title="Help">?</div>
                <div class="cs_control_button cs_control_close" id="cs_close" title="Close (or press ESC)">&times;</div>
                `;
            this.sidebar = $("<div id='sidebar'></div>");
            

        }

        sidebar_init() {
            console.log("Sidebar initialization");
            $('body').append(this.sidebar);
            
            let title = $('<h1>Sidebar</h1>');
            let repo_head = $('<h1 id="repo_head">Repository</h1>');
            let repo = $('<ul id="repo"></ul>');
            

            this.sidebar.append(title);
            this.sidebar.append($('<hr class="solid">'));
            this.sidebar.append(repo_head);
            this.sidebar.append($('<hr class="solid">'));
            this.sidebar.append(repo);
            
            $('body').addClass('cs_bd');
            title.addClass('cs_sb_title');
            repo_head.addClass('cs_sb_repo_head');
            this.sidebar.addClass("cs_sb");
        }
        
        clear_sidebar(){
            $("#repo").empty();
        }

        rectangleSelect(x1, y1, x2, y2) {
            let x_large = x1 > x2 ? x1 : x2,
                x_small = x1 < x2 ? x1 : x2,
                y_large = y1 > y2 ? y1 : y2,
                y_small = y1 < y2 ? y1 : y2;
        
            // console.log("inside rectangle: ", x1, " ", y1, " ", x2, " ", y2);
            const allElements = document.getElementsByTagName('*');
            
            for (const element of allElements) {
                let pos = getPos(element);
                let x_l = pos[0],
                    x_r = pos[1],
                    y_t = pos[2],
                    y_d = pos[3];
                if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
                    if (x_l != x_r && y_t != y_d && !this.searchList.isDuplicate(element)) {
                        this.searchList.append(element);
                        console.log("push");
                    }
                }
            }
            console.log(this.searchList.elements);

            document.body.removeChild(this.options);
            this.options = null;
            this.createOptions();
            this.enabled = true;
            let checkbox = document.getElementById("cs_active");
            checkbox.checked = true;
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

            let elems = document.getElementsByClassName("cs_color_button");
            Array.from(elems).forEach(elem => {
                elem.className = elem.className.replace(" cs_active", "");
            });
            document.getElementById("cs_color_"+color).className += " cs_active"; 
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
            canvas.className = 'cs_canvas';
            
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
                        this.rectangleSelect(this.startX, this.startY, x, y);
                        $("*").removeClass("mystyle");
                        this.searchList.search();
                        this.searchList.updateSidebar();
                    } 

                    //console.log(this.searchList.elements);

                    this.isDraw = false;
                    this.clearCanvas();
                }
        }

        clearResults(){
            this.searchList.clear();
            document.body.removeChild(this.options);
            this.options = null;
            this.createOptions();
            this.clear_sidebar();
            $("*").removeClass("mystyle");
        }

        

        static helpHtml = `<div class="cs_modal_content"><span id="cs_modal_close" class="cs_modal_close">&times;</span><p id="cs_modal_text">...</p></div>`;

        createOptions () {
            let options = document.createElement('div');
            options.id = this.optionsElementId;
            options.setAttribute('class', 'cs_options');
            options.innerHTML = this.optionsHtml;

            document.body.appendChild(options);
            this.options = options;

            let colors = ['yellow', 'blue', 'green', 'red', 'white', 'black'];
            for (let color of colors) {
                document.getElementById('cs_color_'+color).addEventListener('click', 
                    () => this.setColor(color));
            }

            document.getElementById("clr_btn").addEventListener("click", () => {
                // TODO: replace with a clear function
                clipSearch.clearResults();
            });

            document.getElementById('cs_active').addEventListener("click", () => {
                this.switchActiveMode(false);
            });


            document.getElementById('cs_close').addEventListener("click", () => {
                    this.remove();
                });

            document.getElementById('cs_maximize').addEventListener("click", () => {
                    document.getElementById("cs_minimized").setAttribute('style', 'display: none');
                    document.getElementById("cs_maximized").setAttribute('style', 'display: block');
                });
            document.getElementById('cs_minimize').addEventListener("click", () => {
                    document.getElementById("cs_maximized").setAttribute('style', 'display: none');
                    document.getElementById("cs_minimized").setAttribute('style', 'display: block');
                });

            document.getElementById('cs_help').addEventListener('click', () => {
                    let helpModal = document.createElement("div");
                    helpModal.id = "cs_modal";
                    helpModal.setAttribute('class', 'cs_modal');
                    helpModal.innerHTML = ClipSearch.helpHtml;
                    document.body.appendChild(helpModal);
                    document.getElementById('cs_modal_text').innerHTML = chrome.i18n.getMessage("help_text");
                    let removeModal = () => document.body.removeChild(document.getElementById('cs_modal'));
                    document.getElementById('cs_modal_close').addEventListener("click", removeModal);
                });

            this.options.addEventListener("mousedown", e => this.optionsDrag(e));
            document.addEventListener("mouseup", e => this.optionsDrop(e));
            document.addEventListener("mousemove", e => this.optionsMove(e));
            this.optionsDragData = { isDragged: false, sX: 0, sY: 0 };

            // i18n
            let translateInnerHtml = ["options_heading"];
            for (let t of translateInnerHtml) {
                document.getElementById('cs_'+t).innerHTML = chrome.i18n.getMessage(t);
            }

            let translateTitle = ["minimize", "maximize", "help", "color_yellow", "color_blue", "color_green", "color_red", "color_white", "color_black"];
            for (let t of translateTitle) {
                document.getElementById('cs_'+t).setAttribute("title", chrome.i18n.getMessage(t));
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
                document.getElementById("cs_options_heading_minimized").innerHTML = title;
            }
        }

        switchActiveMode (changeCheckedStatus) {
            if (changeCheckedStatus) {
                let checkbox = document.getElementById("cs_active");
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
            let checkBox = document.getElementById("cs_active");
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
            this.sidebar_init();
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

    clipSearch = new ClipSearch('clipSearch_canvas','clipSearch_options');

    chrome.runtime.onMessage.addListener(function(request, sender, response){
        //console.log("onMessge");
        console.log("request received: ", request);
        switch(request){
            case "switch":
                console.log("Switch request received.");
                clipSearch.switchActiveMode(true);
                break;
            case "clear":
                clipSearch.clearResults();
                break;
            case "delete":
                //console.log("Delete request received.");
                clipSearch.searchList.elements.pop();
                this.rectangleSelect(this.startX, this.startY, x, y);
                $("*").removeClass("mystyle");
                searchelement(clipSearch.searchList.elements)
                //console.log(clipSearch.searchList.elements);
                break;
            default:
                console.log("No command received.");
                break;
        }

    });


    document.addEventListener("keydown", (event) => {
        if (event.key == "Shift") {
            clipSearch.enable();
            document.getElementsByTagName("body")[0].style.cursor = "crosshair";
        }
    });
    document.addEventListener("keyup", (event) => {
        if (event.key == "Shift") {
            clipSearch.switchActiveMode(true);
            document.getElementsByTagName("body")[0].style.cursor = "default";
        }
    });
    
    
    
    //Split('body', 'sidebar');
  

    window.addEventListener("resize", () => clipSearch.canvasResize());

    clipSearch.init();

} else {

    if (clipSearch.isEnabled()) {
        clipSearch.remove();
    } else {
        clipSearch.init();
    }

}