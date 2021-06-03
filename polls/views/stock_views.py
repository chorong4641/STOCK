from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse

import sys
from PyQt5.QtWidgets import *
import win32com.client
import pythoncom
import pandas as pd
import os
import json
import requests
from bs4 import BeautifulSoup

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
            'code':objStockMst.GetHeaderValue(0),  # 종목코드
            'name':objStockMst.GetHeaderValue(1),  # 종목명
            'price':objStockMst.GetHeaderValue(11), # 현재가
            'closing':objStockMst.GetHeaderValue(10), # 전일종가
            'opening':objStockMst.GetHeaderValue(13),  # 시가
            'high':objStockMst.GetHeaderValue(14),  # 고가
            'low':objStockMst.GetHeaderValue(15),  # 저가
            'time':objStockMst.GetHeaderValue(4),  # 시간
            'trading_volume':objStockMst.GetHeaderValue(18),   #거래량
            'warning':chr(objStockMst.GetHeaderValue(67))   #투자경고구분
        }
        pythoncom.CoUninitialize()
        return JsonResponse(data,json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {code:코드,name:종목명,price:현재가,closing:종가,opening:시가,high:고가,low:저가,
        #         time:기준시간,trading volume:거래량,warning:투자경고구분}

# 종목뉴스 크롤링
def searchnews(request,stock_name):
    if request.method == 'GET':
        # 웹 주소
        webpage = requests.get('https://search.naver.com/search.naver?query='+stock_name+'&where=news&ie=utf8&sm=nws_hty')
        soup = BeautifulSoup(webpage.content, 'html.parser')

        # 데이터 호출
        list = soup.select('.news_area')[:5]
        data = []

        #데이터 추출
        for i in list:
            temp = {}
            source = i.select_one('.news_info > .info_group > a').get_text() #링크
            source = source.replace('언론사 선정','')
            href = i.select_one('.news_tit')['href']
            title = i.select_one('.news_tit')['title']
            temp = { 'source':source, 'href':href, 'title':title }
            data.append(temp)
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        #data = [{'source': 'http://www.newsis.com/view/?id=NISX20210602_0001461646&cID=13001&pID=13000','href': 'https://www.etoday.co.kr/news/view/2031898',
        # 'title': '[종합] "이건희 회장 신경영 뜻 기린다… 삼성전자, \'희망디딤돌\' 광주센터 개소'}, 
        # {'source': 'https://www.etoday.co.kr/news/view/2031898','href': 'http://yna.kr/AKR20210602065000003?did=1195m',
        # 'title': '삼성·현대차·SK·LG가 71대 그룹 매출·고용의 절반 차지'}]
        
        # 기간별 주가
        # def price_by_period(request):
        # http://money2.creontrade.com/e5/mboard/ptype_basic/plusPDS/DW_Basic_Read.aspx?boardseq=299&seq=42&page=1&searchString=%ec%9d%bc%ec%9e%90%eb%b3%84&prd=&lang=&p=8833&v=8639&m=9505