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
    redirect_uri = quote("https://app5694.acapp.acwing.com.cn/settings/acwing/web/receive_code")      #quote用来encode特殊符号，否则会有bug
    scope = "userinfo"
    state = get_state()

    cache.set(state, True, 7200)        #这个权限有两个小时有效期

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"


    return JsonResponse({
        'result':"success",
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state)
    })
