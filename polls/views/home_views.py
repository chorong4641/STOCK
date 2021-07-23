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

#차트 데이터 호출
def stock(request):
    if request.method == 'GET':
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()

        # 국내 지수 구하기
        objDomeindex = win32com.client.Dispatch("DsCbo1.StockWeek")
        Domecode = {'KOSPI':'U001','KOSDAQ':'U201'}
        Domedata = {'KOSPI':[],'KOSDAQ':[]}
        for k,v in Domecode.items() :
            objDomeindex.SetInputValue(0,v) # 나스닥
            objDomeindex.SetInputValue(1,ord("D")) # 일자별
            objDomeindex.SetInputValue(3,9999) # 일자별
            objDomeindex.BlockRequest()
            for i in range(0,6) :
                temp = {}
                temp['date'] = objDomeindex.GetDataValue(0,i)
                temp['index'] = objDomeindex.GetDataValue(1,i) / 100
                Domedata[k].append(temp)
            Domedata[k].reverse()

        # 해외 지수 구하기
        objForeindex = win32com.client.Dispatch('Dscbo1.CpSvr8300')
        Forecode = {'DOW':'.DJI','NASDAQ':'COMP','SP500':'SPX','SH':'SHANG'}
        Foredata = {'DOW':[],'NASDAQ':[],'SP500':[],'SH':[]}
        for k,v in Forecode.items() :
            objForeindex.SetInputValue(0,v) # 나스닥
            objForeindex.SetInputValue(1,ord("D")) # 일자별
            objForeindex.SetInputValue(3,9999) # 일자별
            objForeindex.BlockRequest()
            for i in range(0,6) :
                temp = {}
                temp['date'] = objForeindex.GetDataValue(0,i)
                temp['index'] = objForeindex.GetDataValue(1,i)
                Foredata[k].append(temp)
            Foredata[k].reverse()
        pythoncom.CoUninitialize()
        Domedata.update(Foredata)
        return JsonResponse(Domedata, json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {KOSPI:[{date:20210531,index:3232},{date:20210531,index:3232}],KOSDAQ:[{date:20210531,index:3232},{date:20210531,index:3232}]}

# 종목명으로 유사 종목 검색값 호출
def searchstock(request,stock_name):
    if request.method == 'GET':
        queryset = Stock.objects.filter(name__icontains=stock_name)[:5] # 종목 유사값 최대 5개
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