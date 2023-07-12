from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get("username", "").strip();    #strip去掉前后空格
    password = data.get("password", "").strip();    #,""意思是如果为空就是""
    password_confirm = data.get("password_confirm", "").strip()
    
    if not username or not password:
        return JsonResponse({
            'result':"用户名密码不能为空"
        })
    
    if password != password_confirm:
        return JsonResponse({
            'result':"两次密码不一致"
        })

    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result':"该用户名已存在"
        })

    user = User(username=username)
    user.set_password(password)
    user.save()

    Player.objects.create(user=user, photo="https://img0.baidu.com/it/u=891223728,3540139486&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400")

    login(request, user)
    return JsonResponse({
        'result':"success"
    })
