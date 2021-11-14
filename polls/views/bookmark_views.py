from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
from ..models import BookmarkGroup , BookmarkStock
from datetime import datetime

import json
import sys
import win32com.client
import pythoncom

# 그룹 추가
@csrf_exempt
def group_create(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        data = {'error':1}

        # 로그인 사용자만 추가 가능
        if request_data['id']:
            bookmark_group = BookmarkGroup()
            bookmark_group.id = request_data['id']
            bookmark_group.name = request_data['group_name']
            bookmark_group.date_insert = datetime.now()
            bookmark_group.date_update = datetime.now()
            data['error'] = 1
            try:
                bookmark_group.save()
                data['error'] = 0
            except:
                data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

# 종목 추가
@csrf_exempt
def stock_create(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        data = {'error':1}
        try:
            queryset = BookmarkGroup.objects.filter(idx=request_data['group_idx'],id=request_data['id'])
            if serializers.serialize('json', queryset) :
                bookmark_stock = BookmarkStock()
                bookmark_stock.group_idx = request_data['group_idx']
                bookmark_stock.code = request_data['stock_code']
                bookmark_stock.id = request_data['id']
                bookmark_stock.date_insert = datetime.now()
                bookmark_stock.save()
                data['error'] = 0
        except:
            data['error'] = 1
        
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

#그룹 삭제
@csrf_exempt
def group_delete(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        bookmark_group = BookmarkGroup.objects.get(idx=request_data['idx'])
        bookmark_stock = BookmarkStock.objects.filter(group_idx=request_data['idx'])
        data = {'error':1}
        if request_data['id'] == bookmark_group.id :
            try:
                bookmark_group.delete()
                if bookmark_stock:
                    bookmark_stock.delete()
                data['error'] = 0
            except:
                data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

# 종목 삭제
@csrf_exempt
def stock_delete(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        for idx in request_data['idx']:
            bookmark_stock = BookmarkStock.objects.get(idx=idx)
            data = {'error':1}
            if request_data['id'] == bookmark_stock.id :
                try:
                    bookmark_stock.delete()
                    data['error'] = 0
                except:
                    data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})


# 조회 -> 조인필요
@csrf_exempt
def bookmark_read(request):
    if request.method == 'GET':
        request_data = json.loads(request.body)
        group = BookmarkGroup.objects.filter(id=request_data['id']).values('idx','name')
        stock = BookmarkStock.objects.filter(id=request_data['id']).values('idx','group_idx','code')
        
        idx_arr = []
        for s in stock:
            idx_arr.append(s['code'])
        idx_list = ',A'.join(map(str,idx_arr))
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        
        # 현재가 객체 구하기
        objStockMst = win32com.client.Dispatch("DsCbo1.StockMst2")
        objStockMst.SetInputValue(0,'A'+idx_list)   
        objStockMst.BlockRequest()
        
        # 현재가 통신 및 통신 에러 처리 
        rqStatus = objStockMst.GetDibStatus()
        rqRet = objStockMst.GetDibMsg1()
        print("통신상태", rqStatus, rqRet)
        if rqStatus != 0:
            exit()

        # 종목 정보
        count = objStockMst.GetHeaderValue(0)
        stock_info = {}
        for c in range(count):
            print(c)
            code = objStockMst.GetDataValue(0,c),  # 종목코드
            name = objStockMst.GetDataValue(1,c),  # 종목명
            price = objStockMst.GetDataValue(3,c), # 현재가
            closing = objStockMst.GetDataValue(19,c) # 전일종가
            stock_info[code[0][1:]] = {
                'name': name[0],
                'price': price[0],
                'dtd': price[0] - closing,
                'rating': round((price[0] - closing) / closing * 100,2)
            }

        # 데이터 가공
        data = []
        for g in group:
            temp = g
            temp['values'] = []
            for s in stock:
                if g['idx'] == s['group_idx']:
                    stock_data = {}
                    stock_data['idx'] = s['idx']
                    stock_data['code'] = s['code']
                    stock_data.update(stock_info[s['code']])
                    temp['values'].append(stock_data)
            data.append(temp)
    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
    # [{"idx": 3, "name": "금융", "values": [{"idx": 1, "code": "032300", "name": "한국파마", "price": 58100, "dtd": -900, "rating": -1.53}]}, 
    # {"idx": 5, "name": "테마", "values": [{"idx": 3, "code": "251270", "name": "넷마블", "price": 137000, "dtd": 2500, "rating": 1.86}, {"idx": 5, "code": "141080", "name": "레고켐바이오", "price": 54800, "dtd": 1000, "rating": 1.86}, {"idx": 8, "code": "293490", "name": "카카오게임즈", "price": 83400, "dtd": 0, "rating": 0.0}]}]