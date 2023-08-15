class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        Single Mode
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                        Multi Mode
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        Log out
                    </div>

                </div>
            </div>
        `);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function(){
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS = [];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;      //start function not yet called
        this.timedelta = 0;             //当前距离上一帧时间间隔
        this.uuid = this.create_uuid();

    }

    create_uuid(){
        let res = "";
        for (let i = 0; i < 8; i++){
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start(){        //only excute on first frame
    }

    update(){       //execute on every frame
    }

    on_destroy(){    //excute before being deleted
    }

    destroy(){      //delete an object

        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++){
            if (AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
        
    }
}

let last_timestamp;

let AC_GAME_ANIMATION = function(timestamp){
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++){
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}


requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField{
    constructor(playground){
        this.playground = playground;
        
        this.$history = $(`<div class="ac-game-chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;
        
        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;

        this.$input.keydown(function(e){
            if (e.which === 27){
                outer.hide_input();
            }else if(e.which === 13){
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text){
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(text);
                }
                return false;
            }
        });
    }

    render_message(message){
        console.log(message);
        return $(`<div>${message}</div>`)
    }

    add_message(username, text){
        this.show_history();
        if (username.length > 4){
            username = username[0]+username[1]+".."+username[username.length-1];
        }
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }


    show_input(){
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input(){
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }

    show_history(){
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id);
        
        this.func_id = setTimeout(function(){
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }
}
class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`);       //tabindex=0就可以监听事件. e.g. keydown....
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){
        this.$canvas.focus();
    }

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

    }

    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class NoticeBoard extends AcGameObject{
    constructor(playground){
        super();

        this.playground = playground;
        
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪0人";

        this.start();
    }

    start(){
    }

    write(text){
        this.text = text;
    }

    update(){
        this.render();
    }

    render(){
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
class Particle extends AcGameObject{
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.01;
        this.friction = 0.9;
    }

    start(){
    }


    update(){
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();

    }

    render(){
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
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

        if (this.character === "me"){
            this.fireball_coldtime = 3;         //单位s
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
        }
    }

    start(){
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪" + this.playground.player_count + "人");

        if (this.playground.player_count >= 3){
            this.playground.state = "fighting";
            this.playground.notice_board.write("fighting!");
        }

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

            if (outer.playground.state !== "fighting") return true;

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

                    if (outer.fireball_coldtime > outer.eps) return false;
                    let fireball = outer.shoot_fireball(tx, ty);
                    
                    if (outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_shoot_fireball(tx,ty,fireball.uuid);
                    }
                }else if (outer.cur_skill === "blink"){
                    if (outer.blink_coldtime > outer.eps) return false;
                    outer.blink(tx,ty);

                    if (outer.playground.mode === "multi mode"){
                        outer.playground.mps.send_blink(tx,ty);
                    }
                }
                outer.cur_skill = null;
            }
            
        });
        this.playground.game_map.$canvas.keydown(function(e){
            if (e.which === 13){    //enter
                if(outer.playground.mode === "multi mode"){
                    outer.playground.chat_field.show_input();      //打开聊天框
                    return false;
                }
            }else if (e.which === 27){
                if (outer.playground.mode === "multi mode"){
                    outer.playground.chat_field.hide_input();
                    return false;
                }
            }
            if (outer.playground.state !== "fighting") return true;

            if (e.which === 81){    //q

                if (outer.fireball_coldtime > outer.eps) return true;
                outer.cur_skill = "fireball";
                return false;
            }else if (e.which === 70){  //f
                if (outer.blink_coldtime > outer.eps) return true;
                outer.cur_skill = "blink";
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
        this.fireball_coldtime = 3;
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

    blink(tx,ty){
        let d = this.get_dist(this.x,this.y,tx,ty);
        d = Math.min(d,0.8);
        let angle = Math.atan2(ty-this.y,tx-this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 5;
        this.move_length = 0;       //闪现完停下
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
        if (this.character === "me" && this.playground.state === "fighting"){
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }

    update_coldtime(){
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(0,this.fireball_coldtime);
    
        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(0,this.blink_coldtime);
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

        if (this.character === "me" && this.playground.state === "fighting"){
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime(){        
        let scale = this.playground.scale;
        let x = 1.5, y = 0.9, r = 0.04;
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x-r) * scale, (y-r) * scale, r * 2 * scale, r * 2 * scale); 
        this.ctx.restore();
        if (this.fireball_coldtime > 0){
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, (1-Math.PI * 2 * this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
        }

        x = 1.62, y = 0.91, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x-r) * scale, (y-r) * scale, r * 2 * scale, r * 2 * scale); 
        this.ctx.restore();
        if (this.blink_coldtime > 0){
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, (1-Math.PI * 2 * this.blink_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
        }
    }

    on_destroy(){
        if (this.character === "me") this.playground.state = "over";

        for (let i = 0; i < this.playground.players.length; i++){
            if(this.playground.players[i] === this){
                this.playground.players.splice(i,1);
                break;
            }
        }
    }
}
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
class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;

        this.ws = new WebSocket("wss://app5694.acapp.acwing.com.cn/wss/multiplayer/")
        
        this.start();
    }

    start(){
        this.receive();
    }

    receive(){
        let outer = this;
        console.log(this);
        this.ws.onmessage = function(e){            //接收send发送过来的信息
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid){
                return false;
            }

            let event = data.event;
            if (event === "create_player"){
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if (event === "move_to"){
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball"){
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack"){
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "blink"){
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if (event === "message") {
                outer.receive_message(data.uuid, data.text);
            }
        };
    }

    send_create_player(username, photo){
        let outer = this;
        this.ws.send(JSON.stringify({       //send 用websocket服务器给别的玩家发信息
            'event':"create_player",
            'uuid':outer.uuid,
            'username':username,
            'photo':photo,
        }));
    }

    get_player(uuid){
        let players = this.playground.players;
        for (let i = 0; i < players.length; i++){
            let player = players[i];
            if (player.uuid === uuid) return player;
        }
        return null;
    }

    receive_create_player(uuid, username, photo){
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event':"move_to",
            'uuid':outer.uuid,
            'tx':tx,
            'ty':ty,
        }));
    }

    receive_move_to(uuid, tx, ty){
        let player = this.get_player(uuid);
        if (player){
            player.move_to(tx,ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid){
        let outer = this;
        this.ws.send(JSON.stringify({           //传输到后端
            'event':"shoot_fireball",
            'uuid':outer.uuid,                  //发射火球的球的uuid
            'tx':tx,
            'ty':ty,
            'ball_uuid':ball_uuid,              //火球的uuid
        }))
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

    receive_shoot_fireball(uuid, tx, ty, ball_uuid){
        let player = this.get_player(uuid);
        if (player){
            let fireball = player.shoot_fireball(tx,ty);
            fireball.uuid = ball_uuid;                      //全部屏幕里的uuid统一成唯一的
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event':"attack",
            'uuid':outer.uuid,
            'attackee_uuid':attackee_uuid,
            'x':x,
            'y':y,
            'angle':angle,
            'damage':damage,
            'ball_uuid':ball_uuid,
        }))
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid){        //uuid是攻击者的uuid
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);

        if (attacker && attackee){
            attackee.receive_attack(x,y,angle,damage,ball_uuid,attacker);
        }
    }

    send_blink(tx, ty){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event':"blink",
            'uuid':outer.uuid,
            'tx':tx,
            'ty':ty,
        }))
    }

    receive_blink(uuid, tx, ty){
        let player = this.get_player(uuid);

        if (player){
            player.blink(tx,ty);
        }
    }

    send_message(text){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event':"message",
            'uuid':outer.uuid,
            'text':text,
        }))
    }

    receive_message(uuid, text){
        let player = this.get_player(uuid);
        player.playground.chat_field.add_message(player.username, text)
    }

}
class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(
            `<div class="ac-game-playground">
            </div>`
        );
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

    refresh(){
        this.$playground = $(
            `<div class="ac-game-playground">
            </div>`
        );
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

    game_over(){
        this.players.splice(0,this.players.length);
        console.log(this.players.length);
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
class Settings{
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        this.username = "";
        this.photo = "";
        if(this.root.AcWingOS) this.platform = "ACAPP";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            Login
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="username">
            </div>
        </div>

        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="password">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>login</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-guest">
            Guest
        </div>
        <div class="ac-game-settings-option">
            register
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <div class="ac-game-settings-item">
                <image width="30" src="https://app5694.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    ACwing Login
                </div>
            </div>
        </div>

    </div>

    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            register
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="username">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="password">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="confirm password">
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>register</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            login
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <div class="ac-game-settings-item">
                <image width="30" src="https://app5694.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                <br>
                <div>
                    ACwing Login
                </div>
            </div>
        </div>

    </div>

</div>

        `);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");     //空格隔开说明在username内，'>'隔开说明是相邻级
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");
        this.$login_guest = this.$login.find(".ac-game-settings-guest");
        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start(){
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        }else{
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_register();           //register页面监听登陆按钮
        this.add_listening_events_login();

        this.$acwing_login.click(function(){
            outer.acwing_login();
        })
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function(){
            outer.login();
        });
        this.$register_submit.click(function(){
            outer.register_on_remote();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function(){
            outer.register();
        });
        this.$login_guest.click(() => {
            this.login_on_remote_guest();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }
    
    acwing_login(){
        $.ajax({
            url: "https://app5694.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET",
            success: function(resp){
                if (resp.result === "success"){
                    window.location.replace(resp.apply_code_url); 
                }
            }
        })
    }

    login_on_remote_guest(){
        let outer = this;
        let username = "guest1";
        let password = "123";
        this.$login_error_message.empty();

        $.ajax({
            url:"https://app5694.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data:{
                username: username,
                password: password,
            },
            success: function(resp){
                if (resp.result === "success"){
                    location.reload();
                }else{
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    login_on_remote() {
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app5694.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp){
                if (resp.result === "success"){
                    location.reload();
                }else{
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();
        
        $.ajax({
            url: "https://app5694.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data:{
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp){
                if (resp.result === "success") {
                    location.reload();
                }else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });

    }

    logout_on_remote() {
        let outer = this;
        if (this.platform === "ACAPP"){
            this.root.AcWingOS.api.window.close();
        }else{
            $.ajax({
                url: "https://app5694.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function(resp){
                    if (resp.result === "success"){
                        location.reload();
                    }
                }
            });
        }
    }
    
    login(){        //打开登陆界面
        this.$register.hide();
        this.$login.show();
    }

    register(){     //打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login_acapp(appid, redirect_uri, scope, state){
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp){
            if (resp.result === "success"){
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }
    
    getinfo_acapp(){
        let outer = this;

        $.ajax({
            url:"https://app5694.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type:"GET",
            success: function(resp){
                if (resp.result === "success"){
                    outer.login_acapp(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        })
    }

    getinfo_web(){
        let outer = this;
        $.ajax({
            url:"https://app5694.acapp.acwing.com.cn/settings/getinfo/",
            type:"GET",
            data:{
                platform:outer.platform,
            },
            success:function(resp){
                if (resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }else{
                    outer.login();
                }
            }
        })
    }

    hide(){
        this.$settings.hide();
    }

    hidden(){
        this.$settings.show();
    }
}

export class AcGame{
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#'+id);
        this.AcWingOS = AcWingOS;
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }
    
    start(){
    }
}
