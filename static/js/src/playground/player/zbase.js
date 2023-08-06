class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, speed, character, username, photo){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;
        this.fireballs = [];
        this.friction = 0.9;
        this.cooling_time = 0;
        this.cur_skill = null;
        if (this.character !== "robot"){
            this.img = new Image();
            this.img.src = this.photo;
        }
    }

    start(){
        if (this.character === "me") {
            this.add_listening_events();
        }else if (this.character === "robot"){
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx,ty);

        }
    }

    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {        //rightclick
                let tx = (e.clientX - rect.left) / outer.playground.scale
                let ty = (e.clientY - rect.top) / outer.playground.scale
                outer.move_to(tx,ty);
                if (outer.playground.mode === "multi mode"){
                    outer.playground.mps.send_move_to(tx,ty);
                }
            }else if (e.which === 1){   //leftclick
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY-rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball"){
                    let fireball = outer.shoot_fireball(tx, ty);
                    
                    if (outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_shoot_fireball(tx,ty,fireball.uuid);
                    }
                }
                outer.cur_skill = null;
            }
            
        });
        $(window).keydown(function(e){
            if (e.which === 81){    //q
                outer.cur_skill = "fireball";
                return false;
            }
        })

        
    }
    
    shoot_fireball(tx, ty){
        //first we need to find the parameter of the fireball
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty-this.y, tx-this.x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.6;
        let move_length = 0.8
        let fireball = new FireBall(this.playground, this, x,y,radius,vx,vy,color,speed, move_length, 0.01);
        this.fireballs.push(fireball);
        return fireball;
    }

    destroy_fireball(uuid){
        for (let i = 0; i < this.fireballs.length; i++){
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid){
                fireball.destroy();
                break;
            }
        }
    }

    is_attacked(angle, damage){
        this.radius -= damage;
        for (let i = 0; i < 20 + Math.random() * 10; i++){
            let x = this.x, y = this.y;
            let radius = Math.max(this.radius * Math.random() * 0.1, 0);
            let degree = Math.random() * Math.PI * 2;
            let vx = Math.cos(degree);
            let vy = Math.sin(degree);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        if (this.radius < this.eps){
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;

    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker){
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
    }

    get_dist(x,y,tx,ty){
        let dx = tx-x;
        let dy = ty-y;
        return(Math.sqrt(dx*dx+dy*dy));
    }

    move_to(tx,ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty-this.y, tx-this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

    }

    update(){
        this.update_move();
        this.render();
    }

    update_move(){      //更新玩家移动
        this.cooling_time += this.timedelta / 1000;
        let player_count = this.playground.players.length;
        if (this.character === "robot" && player_count && this.cooling_time > 4 && Math.random() < 1 / 180.0){
            let player = this.playground.players[Math.floor(Math.random()*player_count)];        //me
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }
        if (this.damage_speed > this.eps){
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta/1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta/1000;
            this.damage_speed *= this.friction;
        }else{

            if (this.move_length < this.eps){
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot"){
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx,ty);
                }
            }else{
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;  // moved/1 * vx更好理解
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render(){
        let scale = this.playground.scale;
        if (this.character !== "robot"){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale); 
            this.ctx.restore();
        }else{
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy(){
        for (let i = 0; i < this.playground.players.length; i++){
            if(this.playground.players[i] === this){
                this.playground.players.splice(i,1);
                break;
            }
        }
    }
}
