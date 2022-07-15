class Sidebar {
    constructor () {
        this.sidebar = $("<div id='sidebar'></div>");
        this.repo = $('<ul id="repo"></ul>');
        this.sidebar_init();
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
}