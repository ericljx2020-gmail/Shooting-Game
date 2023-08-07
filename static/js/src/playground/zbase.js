class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();

        this.root.$ac_game.append(this.$playground);

        this.start();


    }

    start(){
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        });
    }

    update(){
    }

    get_random_color(){
        let color = ["pink", "green", "indigo", "grey", "yellow"];
        return color[Math.floor(Math.random() * 5)];
    }

    resize(){
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();

    }

    show(mode){     //open playground scene
        let outer = this;
        this.$playground.show();
        this.resize();
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;
        this.state = "waiting"      //waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;
        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width/2/this.height, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));
        if (mode === "single mode"){
            for (let i = 0; i < 5; i++){
                this.players.push(new Player(this, this.width/2/this.height, 0.5, 0.05, this.get_random_color()  , 0.15, "robot"));
            }
        }else{
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;
            this.mps.ws.onopen = function(){                //当multiplayer的窗口被打开的时候
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }

    }

    hide(){     //close playground scene
        this.$playground.hide();
    }
}
