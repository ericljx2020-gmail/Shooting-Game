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
            登陆
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>

        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登陆</button>
            </div>
        </div>
        <div class="ac-game-settings-error-messages">
            用户名或密码错误！
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <div class="ac-game-settings-item">
                <image width="30" src="https://app5694.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            </div>
        </div>
        
    </div>

    <div class="ac-game-settings-register">

    </div>

</div>

        `);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register.hide();

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start(){
        this.getinfo();
    }
    
    login(){        //打开登陆界面
        this.$register.hide();
        this.$login.show();
    }

    register(){     //打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    getinfo(){
        let outer = this;
        $.ajax({
            url:"https://app5694.acapp.acwing.com.cn/settings/getinfo/",
            type:"GET",
            data:{
                platform:outer.platform,
            },
            success:function(resp){
                console.log(resp);
                if (resp.result === "success"){
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    console.log(resp.photo, resp.username);
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

