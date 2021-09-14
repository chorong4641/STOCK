from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from ..models import Stock
from datetime import datetime, timedelta
from pandas import Timestamp
import sys
from PyQt5.QtWidgets import *
import win32com.client
import pythoncom
import pandas as pd
import os
import json
import win32event
import FinanceDataReader as fdr

# 메인
def main(request):
    return HttpResponse('main')

def MessagePump(timeout):
    StopEvent = win32event.CreateEvent(None, 0, 0, None)
    waitables = [StopEvent]
    while 1:
        rc = win32event.MsgWaitForMultipleObjects(
            waitables,
            0,  # Wait for all = false, so it waits for anyone
            timeout, #(or win32event.INFINITE)
            win32event.QS_ALLEVENTS)  # Accepts all input
 
        if rc == win32event.WAIT_OBJECT_0:
            # Our first event listed, the StopEvent, was triggered, so we must exit
            print('stop event')
            break
 
        elif rc == win32event.WAIT_OBJECT_0 + len(waitables):
            # A windows message is waiting - take care of it. (Don't ask me
            # why a WAIT_OBJECT_MSG isn't defined < WAIT_OBJECT_0...!).
            # This message-serving MUST be done for COM, DDE, and other
            # Windowsy things to work properly!
            # print('pump')
            if pythoncom.PumpWaitingMessages():
                break  # we received a wm_quit message
        elif rc == win32event.WAIT_TIMEOUT:
            # print('timeout')
            return
            pass
        else:
            print('exception')
            raise RuntimeError("unexpected win32wait return value")

#차트 데이터 호출
def stock(request):
    if request.method == 'GET':
        code = {'KOSPI':'KS11','KOSDAQ':'KQ11','DOW':'DJI','NASDAQ':'IXIC','SP500':'US500','SH':'SSEC'}
        data = {'KOSPI':[],'KOSDAQ':[],'DOW':[],'NASDAQ':[],'SP500':[],'SH':[]}
        time =  (datetime.now() + timedelta(days=-12)).strftime('%Y-%m-%d')
        for k,v in code.items() :
            df = fdr.DataReader(v,str(time))
            df = df.head(6)
            df.reset_index(inplace = True)
            df['Date'] = df['Date'].dt.strftime('%Y%m%d')
            df = df[['Date','Close']]
            df = df.rename(columns={'Date':'date','Close':'index'})
            data[k].extend(df.to_dict('records'))
        return JsonResponse(data, json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {"KOSPI": [{"date": "20210902", "index": 3175.85}],"KODSDAQ":[{"date": "20210902", "index": 3175.85}]}

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