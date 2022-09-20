class ClipSearch { 
        
    constructor (canvasElementId) {
        this.canvasElementId = canvasElementId;

        this.activeColor = null;
        this.canvas = null;
        this.startX = null, this.startY = null, this.isDraw = false;
        this.enabled = false;
        this.active = false;
        
        this.deleteMode = false;
        this.searchList = new SearchList();
        
        this.sidebar = $("<div id='sidebar'></div>");
    }


    make_clear_btn() {
        let cs = this;
        let btn = $("<button>Clear</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'clear_btn');
        btn.click(function() {
            cs.searchList.clear();
        });
        
        return btn;
    }


    make_add_mode_btn() {
        let sl = this.searchList;
        let btn = $("<button >Add Mode</button>");
        btn.addClass("cs_sb_btn");
        btn.attr('id', 'add_btn');
        btn.click(function() {
            sl.addSearchMode();
            sl.updateSidebar();
        });
        
        return btn;
    }


    make_strategy_btn() {
        return this.searchList.make_strategy_btn();
    }


    sidebar_init() {
        $('body').append(this.sidebar);
        
        let title = $('<h1>Sidebar</h1>'),
            repo_head = $('<h2 id="repo_head">Repository</h2>'),
            repo = $('<div id="repo" class="container"></div>'),
            repo_header = $('<div id="repo_header"></div>'),
            mode_btn_group = $('<div id="mode_btn_group"><div>'),
            strategy_btn = this.make_strategy_btn(),
            // strategy_btn = $('<div id="strategy_btn"><div>'),
            add_btn = this.make_add_mode_btn(),
            clear_btn = this.make_clear_btn();

        this.sidebar.append(title);
        this.sidebar.append($('<hr class="solid">'));
        this.sidebar.append(repo_header);
        repo_header.append(repo_head);
        repo_header.append(clear_btn);
        repo_header.append(strategy_btn);
        repo_header.append(add_btn);

        this.sidebar.append(mode_btn_group);
        this.sidebar.append(strategy_btn);
        this.sidebar.append($('<hr class="solid">'));
        this.sidebar.append(repo);
        
        $('body').addClass('cs_bd');
        title.addClass('cs_sb_title');
        repo_header.addClass('cs_sb_repo_header');
        repo_head.addClass('cs_sb_repo_head');
        clear_btn.addClass('cs_sb_btn');  
        add_btn.addClass("cs_sb_add_btn");    
        mode_btn_group.addClass("cs_sb_mode_btn_group"); 
        strategy_btn.addClass("cs_sb_strategy_btn");

        this.sidebar.addClass("cs_sb");

        this.searchList.updateSidebar();
    }


    addElements(elements) {
        for (let element of elements) {
            if (!this.searchList.isDuplicate(element) && !this.searchList.isContained(element)) {
                this.searchList.append(element);
            }
        }
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
            case 'yellow':
                this.setRectRGBA(255, 255, 0, 0.2, 0.6);
                break;
            default:
                this.setRectRGBA(255, 255, 0, 0.2, 0.6);
        }
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
    }


    mouseEvent (eventType, event) {
            let x = event.clientX;
            let y = event.clientY;
            if (eventType == 'down') {
                this.startX = x;
                this.startY = y;
                this.isDraw = true;
            } 
            else if (eventType == 'move') {
                if (this.isDraw) {
                    this.clearCanvas();
                    if (this.enabled) {
                        this.drawBox(this.startX, this.startY, x, y, 
                            this.rectangleBackgroundColor, this.rectangleBorderColor);
                    }
                }
            } 
            else if (eventType == 'up') {
                if (this.enabled) {
                    if (this.deleteMode) {
                        //TODO
                    }
                    else {
                        removeSearchStyle()
                        this.addElements(recSelect(this.startX, this.startY, x, y));
                        this.searchList.search();
                        this.searchList.updateSidebar();
                    }
                } 

                this.isDraw = false;
                this.clearCanvas();
            }
            else if (eventType == 'out') {
                this.isDraw = false;
                this.clearCanvas();
            }
    }


    switchActiveMode () {
        this.active = !this.active;

        if (!this.isActiveMode()) {
            if (!this.canvas) return;      
            document.body.removeChild(this.canvas);
            this.canvas = null;
        } 
        else {
            this.enable();
        }
    }


    isActiveMode () {
        return this.enabled && this.active;
    }


    enable () {
        if (!document.getElementById(this.canvasElementId)) {
            this.createCanvas();
        }
        this.enabled = true;
    }


    init () {
        this.sidebar_init();
        this.setColor("yellow");
    }


    remove () {
        if (this.canvas) {
            document.body.removeChild(this.canvas);
            this.canvas = null;
        }
        this.enabled = false;
        removeSearchStyle()
    }
}


function recSelect(x1, y1, x2, y2) {
    let list = [];

    let x_large = x1 > x2 ? x1 : x2,
        x_small = x1 < x2 ? x1 : x2,
        y_large = y1 > y2 ? y1 : y2,
        y_small = y1 < y2 ? y1 : y2;

    const allElements = document.getElementsByTagName('*');
    
    for (const element of allElements) {
        let pos = getPos(element);
        let x_l = pos[0],
            x_r = pos[1],
            y_t = pos[2],
            y_d = pos[3];
        if (x_l >= x_small && x_r <= x_large && y_t >= y_small && y_d <= y_large) {
            list.push(element);
        }
    }

    return list;
}


function getPos(element) {
    let rect = element.getBoundingClientRect();
    let x_l = rect.left + parseInt(getComputedStyle(element).paddingLeft),
        x_r = rect.right - parseInt(getComputedStyle(element).paddingRight),
        y_t = rect.top + parseInt(getComputedStyle(element).paddingTop),
        y_d = rect.bottom - parseInt(getComputedStyle(element).paddingBottom);
    let pos = [x_l, x_r, y_t, y_d];
    return pos;
}

// Disables text selection on the current page
function disableTextSelection(){
    document.querySelector('*').addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
}