const tag_type = {
	LI: 0,
    RAW_BTN : 1,
    RENDERED_BTN: 2,

}
class Sidebar {
    constructor () {
        this.sidebar = $("<div id='sidebar'></div>");
        this.repo = $('<ul id="repo"></ul>');
    }

    sidebar_init() {
        $('body').append(this.sidebar);
        let title = $('<h1>Sidebar</h1>');
        let repo_head = $('<h1 id="repo_head">Repository</h1>');
        repo_head.append($('<hr class="solid">'));
        repo_head.append(this.repo);
        
        $('body').addClass('cs_bd');
        title.addClass('cs_sb_title');
        repo_head.addClass('cs_sb_repo_head');
        this.sidebar.addClass("cs_sb");
    }
// id should be an int 

    make_id(id, tag_t){
        let id_str = id.toString();
        if(tag_t == tag_type.LI){
            let id_head = "li_id_";
        }else if(tag_t == tag_type.RAW_BTN){
            let id_head = "raw_btn_id_";
        }else{
            let id_head = "rendered_btn_id_";
        }
        
        let whole_id = id_head.concat(id_str);
        return whole_id;
    }

    create_raw_btn(ele, li){
        let raw_btn_id = this.make_id(ele.id, tag_type.RAW_BTN);
        
        let raw_btn = $('<button>Raw</button>');
        raw_btn.addClass('cs_sb_btn');
        raw_btn.attr('id', raw_btn_id);
        raw_btn_id.click(function(){
            let raw_html = ele.outerHTML.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            li.empty();
            li.append($("<p />").append(raw_html));
            li.append(create_rendered_btn(ele, li))
        });

        return raw_btn;
    }

    create_rendered_btn(ele, li){
        let rendered_btn_id = this.make_id(ele.id, tag_type.RENDERED_BTN);

        let rendered_btn = $('<button>Rendered</button>');
        rendered_btn.addClass('cs_sb_btn');
        rendered_btn.attr('id', rendered_btn_id);
        rendered_btn.click(function(){
            li.empty();
            li = create_list_item(ele, ele.outerHTML);
        });

        return rendered_btn;
    }

    create_list_item(ele, html){
        let li_id = this.make_id(ele.id, tag_type.LI);
        let li = $('<li></li>');

        let raw_btn = this.create_raw_btn(ele, li);

        li.append(html);
        li.append(raw_btn);
        
        li.attr('id', li_id);
        
        return li;
    }

    
    //ele should come with a unique id
    append(ele){
        console.log("append");
        let li = this.create_list_item(ele.id, ele.outerHTML);
        this.repo.append(li);
    }
    

    appendToSidebar(html){
        console.log("append");
        
        li.append(html);

        // let btn_group = $('<div></div>');
        // btn_group.css({
        //     'display': 'inline-block',
        //     'vertical-align': 'middle',
        // });
        
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