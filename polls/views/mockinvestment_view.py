from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from ..models import MockInvestment
from ..models import MockOrder
from ..models import UserCapital
from datetime import datetime

import json
import sys
import win32com.client
import pythoncom

# 조회
@csrf_exempt
def read(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        queryset = MockInvestment.objects.filter(id=request_data['id']).order_by('date_insert')
        serialize = serializers.serialize('json', queryset)
        usercapital = UserCapital.objects.get(id=request_data['id'], date_check=datetime.today().strftime('%Y-%m-%d'))
        data = []
        code = []
        stock_count = {}
        try:    
            # 데이터 가공
            for s in json.loads(serialize):
                temp = {}
                for k,v in s.items() :
                    if k == "pk" :
                        temp['idx'] = v
                    if k == "fields" :
                        temp.update(v)
                        code.append(v['code'])
                        stock_count[v['code']] = v['count']
                data.append(temp)
        except:
            data['error'] = 1
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        
        # 현재가 객체 구하기
        objStockMst = win32com.client.Dispatch("DsCbo1.StockMst2")
        objStockMst.SetInputValue(0,'A'+',A'.join(map(str,code)))   
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
        # closing_price = 0
        current_price = 0
        for c in range(count):
            code = objStockMst.GetDataValue(0,c),  # 종목코드
            name = objStockMst.GetDataValue(1,c),  # 종목명
            price = objStockMst.GetDataValue(3,c), # 현재가
            closing = objStockMst.GetDataValue(19,c) # 전일종가
            stock_info[code[0][1:]] = {
                'name': name[0],
                'price': price[0],
                'closing': closing,
                'dtd': price[0] - closing,
                'rating': round((price[0] - closing) / closing * 100,2)
            }

        # 종목 데이터 가공
        for d in data:
            for k,v in stock_count.items() :
                if d['code'] == k :
                    d['name'] = stock_info[k]['name']
                    d['closing'] = stock_info[k]['closing']
                    d['dtd'] = stock_info[k]['dtd']
                    d['rating'] = stock_info[k]['rating']
                    current_price += stock_info[k]['price'] * v
                    continue
        user_price = {'price': usercapital.capital + current_price}
        # data.extend({'price': usercapital.capital + current_price })

        # 잔고 리스트
        queryset2 = UserCapital.objects.filter(id=request_data['id']).order_by('date_insert')
        serialize = serializers.serialize('json', queryset2)
        capital = {}
        try:    
            # 데이터 가공
            for s in json.loads(serialize):
                for k,v in s.items() :
                    if k == "fields" :
                        capital[v['date_check']] = v['capital']
            user_price['capital'] = capital
            data.append(user_price)
        except:
            data['error'] = 1

    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
    # [{"idx": 1, "id": "test", "code": "032300", "price": 56669, "count": 156, "date_insert": "2021-09-04T17:56:03", "date_update": "2021-09-15T16:37:59.406", "type": null, "name": "한국파마", "closing": 74700, "dtd": 1600, "rating": 2.14}, {"idx": 4, "id": "test", "code": "060240", "price": 7260, "count": 150, "date_insert": "2021-09-05T13:01:06.822", "date_update": "2021-09-05T13:01:06.822", "type": null, "name": "룽투코리아", "closing": 6760, "dtd": 640, "rating": 9.47}, {"idx": 5, "id": "test", "code": "066570", "price": 53000, "count": 2, "date_insert": "2021-09-15T16:47:40.401", "date_update": "2021-09-15T16:47:40.401", "type": null, "name": "LG전자", "closing": 141000, "dtd": -1500, "rating": -1.06}, {"price": 20481800}]

# 작성
@csrf_exempt
def insert(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        data = {'error':1}
        try:
            # 주문
            mockorder = MockOrder()
            mockorder.id = request_data['id']
            mockorder.code = request_data['code']
            mockorder.price = request_data['price']
            mockorder.count = request_data['count']
            mockorder.date_insert = datetime.now()
            mockorder.date_check = datetime.today().strftime('%Y-%m-%d')
            mockorder.save()

            # 종합
            try :
                queryset = MockInvestment.objects.get(id=request.session['id'],code=request_data['code'])
            except:
                queryset = None
            mockinvestment = MockInvestment()
            if queryset is None :
                # 매수 시
                mockinvestment.id = request_data['id']
                mockinvestment.code = request_data['code']
                mockinvestment.price = request_data['price']
                mockinvestment.count = request_data['count']
                mockinvestment.date_insert = datetime.now()
                mockinvestment.date_update = datetime.now()
                mockinvestment.save()
            else :
                # 추가 매수 및 부분 매도
                if mockinvestment.price != request_data['price']:
                    mockinvestment.idx = queryset.idx
                    mockinvestment.id = request_data['id']
                    mockinvestment.code = request_data['code']
                    mockinvestment.price = round((queryset.price * queryset.count + request_data['price'] * request_data['count']) / ( queryset.count + request_data['count'] ))
                    mockinvestment.count = queryset.count + request_data['count']
                    mockinvestment.date_insert = queryset.date_insert
                    mockinvestment.date_update = datetime.now()
                    mockinvestment.save()
                else:
                    # 전량 매도시 삭제
                    queryset.delete()
                
            # 자본 업데이트
            usercapital = UserCapital.objects.get(id=request_data['id'])
            usercapital.capital = usercapital.capital - request_data['price'] * request_data['count']
            usercapital.date_update = datetime.now()
            usercapital.save()
            data['error'] = 0
        except:
            data['error'] = 1
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False})

# # 수정 및 삭제
# @csrf_exempt
# def update(request):
#     if request.method == 'POST':
#         request_data = json.loads(request.body)
#         mockinvestment = MockInvestment.objects.get(idx=request_data['idx'])
#         data = {'error':1}

#         if request.session['id'] == mockinvestment.id :
#             try:
#                 if request_data['operator'] == 'minus' :
#                         if request_data['count'] == mockinv제estment.count :
#                                 delete(request) # 삭제
#                                      break;
#                         else
#                        // 자본 업데이트
#                     mockinvestment.current_price = request_data['price'] * request_data['count'] + mockinvestment.current_price * mockinvestment.count / ( request_data['count'] + mockinvestment.count )
#                     mockinvestment.count += request_data['count']         
#                 mockinvestment.date_update = datetime.now()
#                 mockinvestment.save()
#                 data['error'] = 0
#             except:
#                 data['error'] = 1   
#         return JsonResponse(data,json_dumps_params={'ensure_ascii': False})
#         # 성공 실패 여부 반환
    
# # 삭제
# @csrf_exempt
# def delete(request):
#     if request.method == 'POST':
#         request_data = json.loads(request.body)
#         mockinvestment = MockInvestment.objects.get(idx=request_data['idx'])
#         data = {'error':1}
#         if request.session['id'] == mockinvestment.id :
#             try:
#                     // 자본업데이
#                 mockinvestment.delete()
#                 data['error'] = 0
#             except:
#                 data['error'] = 1
       
#         return JsonResponse(data,json_dumps_params={'ensure_ascii': False})
#         # 성공 실패 여부 반환