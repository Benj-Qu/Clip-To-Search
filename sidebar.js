class Sidebar {
    constructor () {
        innerhtml = $("<div id='sidebar'></div>");
    }

    sidebarInit() {
        $('body').css({
            'padding-right': '600px'
        });
        this.sidebar.css({
            'all': 'initial',
            'position': 'fixed',
            'right': '0px',
            'top': '0px',
            'z-index': 9999,
            'width': '500px',
            'height': '100%',
            'overflow-y': 'scroll',
            'background-color': 'GhostWhite',
        });
        $('body').append(this.sidebar);
        let title = $('<h1>Sidebar</h1>');
        title.css({
            'font-size': '60px',
            'font-weight': 'bold',
        });
        let repo_head = $('<h1>Repository</h1>');
        repo_head.css({
            'font-size': '40=30px',
            'font-weight': 'bold',
        });
        let repo = $('<ul id="repo"></ul>');
        repo_head.append($('<hr class="solid">'));
        repo_head.append(repo);
        this.sidebar.append(title);
        this.sidebar.append($('<hr class="solid">'));
        this.sidebar.append(repo_head);
    }

    appendToSidebar(html){
        console.log("append");
        let li = $('<li></li>');
        li.append(html);

        let btn_group = $('<div></div>');
        btn_group.css({
            'display': 'inline-block',
            'vertical-align': 'middle',
        });
        let raw_btn = $('<button>Raw</button>');
        let rendered_btn = $('<button>Rendered</button>');
        raw_btn.css({
            'border': '1px solid black',
            'padding': '10px',
        });
        rendered_btn.css({
            'border': '1px solid black',
            'padding': '10px',
        });
        btn_group.append(raw_btn); 
        li.append(btn_group);
        $("#repo").append(li);
        $("#repo").append($('<hr class="dashed">'));
        
        let raw_html = html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var new_p = $('<p />').append(raw_html);
        
        raw_btn.click(function(){
            console.log('raw_btn clicked');
            li.replaceWith(function(){
                new_p.append(rendered_btn);
                return new_p;
            });
        });
        rendered_btn.click(function(){
            console.log('rendered_btn clicked');
            new_p.replaceWith(li);
        });
        
        //console.log(div);
    }
    
    clearSiderbar(){
        console.log("clear sidebar");
        this.sidebar.empty();
        let title = $('<p>Sidebar</p>');
        title.css({
            'font-size': '60px',
            'font-weight': 'bold',
        });
        this.sidebar.append(title);
    }
}