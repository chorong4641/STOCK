from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
from ..models import BookmarkGroup , BookmarkStock
from datetime import datetime

import json

# 그룹 추가
def group_create(request,group_name):
    if request.method == 'GET':
        data = {'error':1}

                # 로그인 사용자만 추가 가능
        if request.session['id']:
            bookmark_group = BookmarkGroup()
            bookmark_group.id = request.session['id']
            bookmark_group.name = group_name
            bookmark_group.date_insert = datetime.now()
            bookmark_group.date_update = datetime.now()
            data = {'error':1}
            try:
                bookmark_group.save()
                data['error'] = 0
            except:
                data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

# 종목 추가
def stock_create(request,group_idx,stock_code):
    if request.method == 'GET':
        data = {'error':1}
        try:
            queryset = BookmarkGroup.objects.filter(idx=group_idx,id=request.session['id'])
            if serializers.serialize('json', queryset) :
                bookmark_stock = BookmarkStock()
                bookmark_stock.group_idx = group_idx
                bookmark_stock.code = stock_code
                bookmark_stock.id = request.session['id']
                bookmark_stock.date_insert = datetime.now()
                data = {'error':1}
                try:
                    bookmark_stock.save()
                    data['error'] = 0
                except:
                    data['error'] = 1
        except:
            data['error'] = 1
        
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

#그룹 삭제
def group_delete(request,idx):
    if request.method == 'GET':
        bookmark_group = BookmarkGroup.objects.get(idx=idx)
        data = {'error':1}
        if request.session['id'] == bookmark_group.id :
            try:
                bookmark_group.delete()
                data['error'] = 0
            except:
                data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

# 종목 삭제
def stock_delete(request,idx):
    if request.method == 'GET':
        bookmark_stock = BookmarkStock.objects.get(idx=idx)
        data = {'error':1}
        if request.session['id'] == bookmark_stock.id :
            try:
                bookmark_stock.delete()
                data['error'] = 0
            except:
                data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})


# 조회 -> 조인필요
def bookmark_read(request):
    if request.method == 'GET':
        group = BookmarkGroup.objects.filter(id='test').values('idx','name')
        stock = BookmarkStock.objects.filter(id='test').values('idx','group_idx','code')
        
        # 데이터 가공
        for s in stock :
            for g in group :
                if s['group_idx'] == g['idx'] :
                    s['name'] = g['name']
        
        data = list(stock)
    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
    # [{'idx': 1, 'group_idx': 1, 'code': '032300', 'name': '테마'}, {'idx': 2, 'group_idx': 2, 'code': '036570', 'name': '게임'}, {'idx': 3, 'group_idx': 2, 'code': '251270', 'name': '게임'}, {'idx': 4, 'group_idx': 2, 'code': '293490', 'name': '게임'}]