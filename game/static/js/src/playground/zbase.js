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
        console.log("resize");
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
         
    }

    show(){     //open playground scene
        this.$playground.show();
        this.resize();
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width/2/this.height, 0.5, 0.05, "white", 0.15, true));

        for (let i = 0; i < 5; i++){
            this.players.push(new Player(this, this.width/2/this.height, 0.5, 0.05, this.get_random_color()  , 0.15, false));
        }

    }

    hide(){     //close playground scene
        this.$playground.hide();
    }
}
