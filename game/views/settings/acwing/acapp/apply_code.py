from django.http import JsonResponse
from random import randint
from urllib.parse import quote
from django.core.cache import cache

def get_state():
    res = ""
    for _ in range(8):
        res += str(randint(0,9))
    return res

def apply_code(request):
    appid = "5694"
    redirect_uri = quote("https://app5694.acapp.acwing.com.cn/settings/acwing/acapp/receive_code")      #quote用来encode特殊符号，否则会有bug
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200)        #这个权限有两个小时有效期



    return JsonResponse({
        'result':"success",
        'appid':appid,
        'redirect_uri':redirect_uri,
        'scope':scope,
        'state':state,
    })
