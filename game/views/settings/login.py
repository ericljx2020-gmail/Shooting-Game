from django.http import JsonResponse
from django.contrib.auth import authenticate, login


def signin(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)

    if not user:
        return JsonResponse({
        'result':"username or password incorrect"
        })
    login(request, user)
    return JsonResponse({
        'result':"success"
    })
