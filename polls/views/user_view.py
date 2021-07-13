from django.http import response
from django.http.response import Http404
from django.shortcuts import render, redirect
from django.http import HttpRequest,HttpResponse, JsonResponse
from django.core import serializers
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import  get_object_or_404
from ..models import User
from datetime import datetime

import json
import string
import random
import hashlib
import base64
import requests

# 로그인
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            queryset = User.objects.filter(id = data['id'])
            serialize = serializers.serialize('json', queryset)
            for s in json.loads(serialize):
                pw_old = s['fields']['password']
                break
            
            # 해쉬비번 검증 후 세션생성(로그인 성공)
            if check_password(data['pw'], pw_old) :
                request.session['user'] = data['id']
                return HttpResponse('로그인성공')

            return HttpResponse('로그인실패')
        except:
            return HttpResponse('로그인실패')

# 회원 가입
@csrf_exempt
def register(request):
   if request.method == 'POST':
        data = json.loads(request.body)
        user = User()
        user.id = data['id']
        user.password = make_password(data['pw'])
        user.name = data['name']
        user.email = data['email']
        user.date_insert = datetime.now()
        user.date_update = datetime.now()
        try:
            user.save()
            return HttpResponse('회원가입완료')
        except:
            return HttpResponse('회원가입실패')

# 정보 수정
@csrf_exempt
def edit(request):
    if request.method == 'PUT':
        return HttpResponse('수정완료')