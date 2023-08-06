class FireBall extends AcGameObject{
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start(){
    }

    update(){
        if (this.move_length < this.eps){
            this.destroy();
            return false;
        }

        this.update_move();
        if (this.player.character !== "enemy"){
            this.update_attack();           //只有发射这个火球的人是me的时候，才判断碰撞
        }
        this.render();
    }

    update_move(){
        let moved = Math.min(this.move_length, this.speed * this.timedelta/1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack(){
        for (let i = 0; i < this.playground.players.length; i++){
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)){
                this.attack_player(player);
                break;                                  //break了每一次就只能打一个
            }
        }
    }

    get_dist(x1, y1, x2, y2){
        let dx = x2-x1;
        let dy = y2-y1;
        return Math.sqrt(dx*dx+dy*dy);
    }

    is_collision(player){
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        let sum_radius = this.radius + player.radius;
        if (dist < sum_radius){
            return true;
        }
        return false;
    }

    attack_player(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);   //碰撞角度和碰撞伤害

        if (this.playground.mode === "multi mode"){
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }

    render(){
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy(){
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i++){
            if (fireballs[i] === this){
                fireballs.splice(i,1);
                break;
            }
        }
    }
}
