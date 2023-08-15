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

