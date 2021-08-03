from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from ..models import Board
from datetime import datetime

import json

# 조회
@csrf_exempt
def read(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        queryset = Board.objects.filter(code=request_data['code'])
        serialize = serializers.serialize('json', queryset)
        data = []
            
        # 데이터 가공
        for s in json.loads(serialize):
            temp = {}
            for k,v in s.items() :
                if k == "pk" :
                    temp['idx'] = v
                if k == "fields" :
                    temp.update(v)
            data.append(temp)
    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
    # 데이터 반환

# 작성
@csrf_exempt
def create(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        board = Board()
        board.id = request.session['id']
        board.code = request_data['code']
        board.contents = request_data['contents']
        board.date_insert = datetime.now()
        board.date_update = datetime.now()
        data = {'error':1}
        try:
            board.save()
            data['error'] = 0
        except:
            data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})
        # 성공 실패 여부 반환

# 수정
@csrf_exempt
def update(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        board = Board.objects.get(idx=request_data['idx'])
        data = {'error':1}

        if request.session['id'] == board.id :
            try:
                board.contents = request_data['contents']
                board.save()
                data['error'] = 0
            except:
                data['error'] = 1
        
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})
        # 성공 실패 여부 반환
    
# 삭제
@csrf_exempt
def delete(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        board = Board.objects.get(idx=request_data['idx'])
        data = {'error':1}
        if request.session['id'] == board.id :
            try:
                board.delete()
                data['error'] = 0
            except:
                data['error'] = 1
       
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})
        # 성공 실패 여부 반환