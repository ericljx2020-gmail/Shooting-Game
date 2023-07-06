class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        // this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
    }

    start(){
    }

    update(){
    }

    show(){     //open playground scene
        this.$playground.show();
    }

    hide(){     //close playground scene
        this.$playground.hide();
    }
}
