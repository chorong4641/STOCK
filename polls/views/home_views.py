from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from ..models import Stock

import sys
from PyQt5.QtWidgets import *
import win32com.client
import pythoncom
import pandas as pd
import os
import json

# 메인
def main(request):
    return HttpResponse('main')

#국내차트 데이터 호출
def domestic(request):
    if request.method == 'GET':
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        else : print("Plus 연결 성공")
  
        # 일자별 object 구하기
        objDomeindex = win32com.client.Dispatch("DsCbo1.StockWeek")
        code = {'KOSPI':'U001','KOSDAQ':'U201'}
        data = {'KOSPI':[],'KOSDAQ':[]}
        for k,v in code.items() :
            objDomeindex.SetInputValue(0,v) # 나스닥
            objDomeindex.SetInputValue(1,ord("D")) # 일자별
            objDomeindex.SetInputValue(3,9999) # 일자별
            objDomeindex.BlockRequest()
            for i in range(0,6) :
                temp = {}
                temp['date'] = objDomeindex.GetDataValue(0,i)
                temp['index'] = objDomeindex.GetDataValue(1,i)
                data[k].append(temp)
        pythoncom.CoUninitialize()
        return JsonResponse(data, json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {KOSPI:[{date:20210531,index:3232},{date:20210531,index:3232}],KOSDAQ:[{date:20210531,index:3232},{date:20210531,index:3232}]}

# 해외차트 데이터 호출
def foreign(request):
    if request.method == 'GET':
        pythoncom.CoInitialize()
        objCpStatus = win32com.client.Dispatch('CpUtil.CpCybos')

        bConnect = objCpStatus.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        else : print("Plus 연결 성공")
        
        objForeindex = win32com.client.Dispatch('Dscbo1.CpSvr8300')
        # code = {'DOW':'.DJI','NASDAQ':'COMP'}
        # data = {'DOW':{},'NASDAQ':{}}
        code = {'DOW':'.DJI','NASDAQ':'COMP','SP500':'SPX','SH':'SHANG'}
        data = {'DOW':[],'NASDAQ':[],'SP500':[],'SH':[]}
        for k,v in code.items() :
            objForeindex.SetInputValue(0,v) # 나스닥
            objForeindex.SetInputValue(1,ord("D")) # 일자별
            objForeindex.SetInputValue(3,9999) # 일자별
            objForeindex.BlockRequest()
            for i in range(0,6) :
                temp = {}
                temp['date'] = objForeindex.GetDataValue(0,i)
                temp['index'] = objForeindex.GetDataValue(1,i)
                data[k].append(temp)
        pythoncom.CoUninitialize()
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {DOW:[{date:20210531,index:3232},{date:20210531,index:3232}],NASDAQ:[{date:20210531,index:3232},{date:20210531,index:3232}],
        #         SP500:[{date:20210531,index:3232},{date:20210531,index:3232}],SH:[{date:20210531,index:3232},{date:20210531,index:3232}]}

# 종목명으로 유사 종목 검색값 호출
def searchstock(request,stock_name):
    if request.method == 'GET':
        queryset = Stock.objects.filter(name__contains=stock_name)[:5] # 종목 유사값 최대 5개
        serialize = serializers.serialize('json', queryset)
        data = []
        
        # 데이터 가공
        for s in json.loads(serialize):
            temp = {}
            for k,v in s.items() :
                if k == 'pk' :
                    temp['code'] = v
                elif k == "fields" :
                    temp.update(v)
            data.append(temp)
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
        # data = [{code:23,name:넷},{code:344,name:넷떡상}]