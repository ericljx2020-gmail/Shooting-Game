class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();
		this.start();
    }

    start(){
    }

    update(){
    }
    
    get_random_color(){
        let color = ["pink", "green", "indigo", "grey", "yellow"];
        return color[Math.floor(Math.random() * 5)];
    }

    show(){     //open playground scene
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 5; i++){
            this.players.push(new Player(this, this.width/2, this.height/2, this.height * 0.05, this.get_random_color()  , this.height * 0.15, false));
        }

    }

    hide(){     //close playground scene
        this.$playground.hide();
    }
}
