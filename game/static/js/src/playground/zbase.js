class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>This is the game scene</div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
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
