from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

import sys
from PyQt5.QtWidgets import *
import win32com.client
import pythoncom
import pandas as pd
import os
import json

# 종목 코드로 종목 상세 정보 호출
def getstock(request, stock_code):
    if request.method == 'GET':
        # stock_code = request.GET['stock_code']
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        
        # 현재가 객체 구하기
        objStockMst = win32com.client.Dispatch("DsCbo1.StockMst")
        objStockMst.SetInputValue(0,'A'+stock_code)   #종목 코드 - 삼성전자
        objStockMst.BlockRequest()
        
        # 현재가 통신 및 통신 에러 처리 
        rqStatus = objStockMst.GetDibStatus()
        rqRet = objStockMst.GetDibMsg1()
        print("통신상태", rqStatus, rqRet)
        if rqStatus != 0:
            exit()

        # 현재가 정보 조회
        data = {
            'code':objStockMst.GetHeaderValue(0),  #종목코드
            'name':objStockMst.GetHeaderValue(1),  # 종목명
            'time':objStockMst.GetHeaderValue(4),  # 시간
            'closing':objStockMst.GetHeaderValue(11), # 종가
            #'beforeafter':objStockMst.GetHeaderValue(12),  # 대비
            'opening':objStockMst.GetHeaderValue(13),  # 시가
            'high':objStockMst.GetHeaderValue(14),  # 고가
            'low':objStockMst.GetHeaderValue(15),  # 저가
            'calling':objStockMst.GetHeaderValue(16),  #매도호가
            'offer':objStockMst.GetHeaderValue(17),   #매수호가
            'trading_volume':objStockMst.GetHeaderValue(18),   #거래량
            'transaction_amount':objStockMst.GetHeaderValue(19)  #거래대금
        }
        pythoncom.CoUninitialize()
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {code:23,name:넷,time:~,closing:종가,beforeafter:대비,opening:시가 ,high:고가,low:저가,
        #         calling:매도호가,offer:매수호가,trading volume:거래량,transaction_amount:거래대금}

        
        # 예상 체결관련 정보
        # exFlag = objStockMst.GetHeaderValue(58) #예상체결가 구분 플래그
        # exPrice = objStockMst.GetHeaderValue(55) #예상체결가
        # exDiff = objStockMst.GetHeaderValue(56) #예상체결가 전일대비
        # exVol = objStockMst.GetHeaderValue(57) #예상체결수량
        # if (exFlag == ord('0')):
        #     print("장 구분값: 동시호가와 장중 이외의 시간")
        # elif (exFlag == ord('1')) :
        #     print("장 구분값: 동시호가 시간")
        # elif (exFlag == ord('2')):
        #     print("장 구분값: 장중 또는 장종료")
        
        # print("예상체결가 대비 수량")
        # print("예상체결가", exPrice)
        # print("예상체결가 대비", exDiff)
        # print("예상체결수량", exVol)