from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from PyQt5.QtWidgets import *
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from datetime import datetime
from pykrx import stock

import sys
import win32com.client
import pythoncom
import pandas as pd
import os
import json
import requests
import OpenDartReader
import pandas as pd
import numpy as np

# 종목 코드로 종목 상세 정보 호출
def getstock(request, stock_code):
    if request.method == 'GET':
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
        stockdata = {
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

        # 일자별 object 구하기
        datecode = {'week':'D','month':'W','year':'M'}
        data = {'week':[],'month':[],'year':[]}
        for k,v in datecode.items() :
            objStockChart = win32com.client.Dispatch("CpSysDib.StockChart")
            objStockChart.SetInputValue(0,'A'+stock_code)  # 종목코드
            objStockChart.SetInputValue(1, ord('2'))  # 개수로 받기
            # objStockChart.SetInputValue(2, datetime.now().strftime("%Y%m%d"))  # To 날짜
            # objStockChart.SetInputValue(3, from_date.strftime("%Y%m%d"))  # From 날짜
            objStockChart.SetInputValue(4, 50)  # 최근 500일치
            objStockChart.SetInputValue(5, [0,2,3,4,5,8])  # 날짜,종가
            objStockChart.SetInputValue(6, ord(v))  # '차트 주기 - 일간 차트 요청
            objStockChart.SetInputValue(9, ord('1'))  # 수정주가 사용
            objStockChart.BlockRequest()
            
            # 정보 데이터 처리
            count = objStockChart.GetHeaderValue(3)
            for i in range(count):
                temp = {}
                date = objStockChart.GetDataValue(0, i)
                opening = objStockChart.GetDataValue(1, i) # 시가
                high = objStockChart.GetDataValue(2, i) # 고가
                low = objStockChart.GetDataValue(3, i) # 저가
                closing = objStockChart.GetDataValue(4, i) # 종가
                if v == 'D' :
                    date = str(date)[0:4] + '년' + str(date)[4:6] + '월' + str(date)[6:8] + '일'
                elif v == 'W' :
                    date = str(date)[0:4] + '년' + str(date)[4:6] + '월' + str(date)[6:7] + '주차'
                else :
                    date = str(date)[0:4] + '년' + str(date)[4:6] + '월'
                temp = {'date':date,'opening':opening,'high':high,'low':low,'closing':closing}
                data[k].append(temp)
            data[k].reverse()
        data.update({'info':[stockdata]})
        
        pythoncom.CoUninitialize()
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        #{"week": [{"date": 20210716, "opening": 80100, "high": 80100, "low": 79500, "closing": 79800}, {"date": 20210719, "opening": 79100, "high": 79200, "low": 78800, "closing": 79000}], 
        # "month": [{"date": 20210620, "opening": 80800, "high": 81900, "low": 80500, "closing": 80500}, {"date": 20210630, "opening": 79700, "high": 81900, "low": 79600, "closing": 81600}], 
        # "year": [{"date": 20210100, "opening": 81000, "high": 96800, "low": 80200, "closing": 82000}, {"date": 20210200, "opening": 81700, "high": 86400, "low": 81000, "closing": 82500}], 
        # "info": [{"code": "A005930", "name": "삼성전자", "price": 78800, "closing": 79300, "opening": 79400, "high": 79500, "low": 78800, "time": 1559, "trading_volume": 10040975, "warning": "1"}]}

# 종목뉴스 크롤링
def searchnews(request,stock_name):
    if request.method == 'GET':
        # 웹 주소
        webpage = requests.get('https://search.naver.com/search.naver?query='+stock_name+'&where=news&ie=utf8&sm=nws_hty')
        soup = BeautifulSoup(webpage.content, 'html.parser')

        # 데이터 호출
        list = soup.select('.news_area')[:10]
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
def price_by_period(request,stock_code,term):
    if request.method == 'GET':

        if term == 'week':
            term_date = 'D'
        elif term == 'month':
            term_date = 'W'
        elif term == 'year':
            term_date = 'M'

        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()

        # 일자별 object 구하기
        objStockChart = win32com.client.Dispatch("CpSysDib.StockChart")
        objStockChart.SetInputValue(0,'A'+stock_code)  # 종목코드
        objStockChart.SetInputValue(1, ord('2'))  # 개수로 받기
        # objStockChart.SetInputValue(2, datetime.now().strftime("%Y%m%d"))  # To 날짜
        # objStockChart.SetInputValue(3, from_date.strftime("%Y%m%d"))  # From 날짜
        objStockChart.SetInputValue(4, 7)  # 최근 500일치
        objStockChart.SetInputValue(5, [0,2,3,4,5,8])  # 날짜,종가
        objStockChart.SetInputValue(6, ord(term_date))  # '차트 주기 - 일간 차트 요청
        objStockChart.SetInputValue(9, ord('1'))  # 수정주가 사용
        objStockChart.BlockRequest()

        rqStatus = objStockChart.GetDibStatus()
        rqRet = objStockChart.GetDibMsg1()
        print("통신상태", rqStatus, rqRet)
        if rqStatus != 0:
            exit()
        
        # 정보 데이터 처리
        count = objStockChart.GetHeaderValue(3)
        data = []
        for i in range(count):
            temp = {}
            date = objStockChart.GetDataValue(0, i)
            opening = objStockChart.GetDataValue(1, i) # 시가
            high = objStockChart.GetDataValue(2, i) # 고가
            low = objStockChart.GetDataValue(3, i) # 저가
            closing = objStockChart.GetDataValue(4, i) # 종가
            temp = {'date':date,'opening':opening,'high':high,'low':low,'closing':closing}
            data.append(temp)
        data.reverse()
        pythoncom.CoUninitialize()    
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        # data = {[{"date": 20210600, "index": 82300}, {"date": 20210500, "index": 80500}, {"date": 20210400, "index": 81500}]

# 실시간 주가
def real_time(request,stock_code):
    if request.method == 'GET':
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()

        # 일자별 object 구하기
        objStockChart = win32com.client.Dispatch("CpSysDib.StockChart")
        objStockChart.SetInputValue(0,'A'+stock_code)  # 종목코드
        objStockChart.SetInputValue(1, ord('2'))  # 횟수로 받기
        # objStockChart.SetInputValue(2, datetime.now().strftime("%Y%m%d"))  # To 날짜
        # objStockChart.SetInputValue(3, from_date.strftime("%Y%m%d"))  # From 날짜
        objStockChart.SetInputValue(4, 1)  # 최근 500일치
        objStockChart.SetInputValue(5, [0,2,3,4,5,8])  # 날짜,종가
        objStockChart.SetInputValue(6, ord('m'))  # '차트 주기 - 일간 차트 요청
        objStockChart.SetInputValue(9, ord('1'))  # 수정주가 사용
        objStockChart.BlockRequest()
        
        print(objStockChart.BlockRequest())
        
        # 정보 데이터 처리
        count = objStockChart.GetHeaderValue(3)
        data = []
        for i in range(count):
            temp = {}
            index = objStockChart.GetDataValue(4, i)
            temp = {'index':index}
            data.append(temp)
    
        pythoncom.CoUninitialize()   
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        #data = [{index:23122}]

# 공시
def disclosure(request,stock_code):
    if request.method == 'GET':
        api_key = '1ddffd13985be3f62f4c11828d4239377347bf16'
        dart = OpenDartReader(api_key)
        data = dart.list(stock_code,start='2016').iloc[1:10]    # 공시 데이터 세팅 및 제한 10줄
        data.drop(['corp_code','corp_name','stock_code','corp_cls'],axis=1,inplace=True) # 불필요컬럼 제거
        data['url'] = 'http://dart.fss.or.kr/dsaf001/main.do?rcpNo=' + data['rcept_no'] # 링크 추가
        data = data.transpose()	#행 열 전환
        data.rename(columns=data.iloc[0], inplace=True)	# 행열이 전환된 데이터프레임의 열 이름 제대로 수정
        data = json.loads(json.dumps(list(data.to_dict().values())))
    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)

# 재무제표
def financial(request,stock_code):
    if request.method == 'GET':
        api_key = '1ddffd13985be3f62f4c11828d4239377347bf16'
        dart = OpenDartReader(api_key)
        # data = dart.finstate(stock_code, 2020,'11013')    # 재무제표 데이터값
        year = datetime.today().year        # 현재 연도 가져오기
        dart = dart.finstate(stock_code, year-1)
        dart.drop(['rcept_no','reprt_code','sj_nm','bsns_year','corp_code','stock_code','fs_div','sj_div','thstrm_nm','thstrm_dt','frmtrm_nm','frmtrm_dt','bfefrmtrm_nm','bfefrmtrm_dt','ord'],axis=1,inplace=True)
        dart = dart[dart['fs_nm'] == '연결재무제표' ]
        bfefrm_year = dart['bfefrmtrm_amount']
        frm_year = dart['frmtrm_amount']
        ths_year = dart['thstrm_amount']
        title = dart['account_nm']
        data = []
        df = stock.get_market_cap_by_date(str(datetime.today().year - 2) + '0101',datetime.today(),stock_code,'y') # 시가 총액 / 주식 발행수
        df2 = stock.get_market_ohlcv_by_date(str(datetime.today().year - 2) + '0101',datetime.today(),stock_code,'y') # 주가
        for k in range(len(title)) :
            temp = []
            temp = {title[k]:{year-2:bfefrm_year[k],year-1:frm_year[k],year:ths_year[k]}}
            data.append(temp)
            if title[k] == '자본총계':
                temp = {}
                pbr = {year-2:df['시가총액'][0]/int(bfefrm_year[k].replace(',','')),year-1:df['시가총액'][1]/int(frm_year[k].replace(',','')),year:df['시가총액'][2]/int(ths_year[k].replace(',',''))}
                temp = {'PBR':{year-2:pbr[year-2],year-1:pbr[year-1],year:pbr[year]}}
                data.append(temp)
            elif title[k] == '당기순이익':
                temp = {}
                eps = {year-2:int(bfefrm_year[k].replace(',',''))/df['상장주식수'][0],year-1:int(frm_year[k].replace(',',''))/df['상장주식수'][1],year:int(ths_year[k].replace(',',''))/df['상장주식수'][2]}
                per = {year-2:df2['종가'][0]/eps[year-2],year-1:df2['종가'][1]/eps[year-1],year:df2['종가'][2]/eps[year]}
                temp = {
                        'EPS':{year-2:eps[year-2],year-1:eps[year-1],year:eps[year]},
                        'PER':{year-2:per[year-2],year-1:per[year-1],year:per[year]},
                        'ROE':{year-2:round(pbr[year-2]/per[year-2]*100,2),year-1:round(pbr[year-1]/per[year-1]*100,2),year:round(pbr[year]/per[year]*100,2)},
                }
                data.append(temp)

    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
    # [{"rcept_no": "20180515001699", "account_nm": "당기순이익", "thstrm_nm": "제 50 기1분기", "thstrm_dt": "2018.01.01 ~ 2018.03.31", "thstrm_amount": "8,452,458,000,000", "frmtrm_nm": "제 49 기1분기", "frmtrm_dt": "2017.01.01 ~ 2017.03.31", "frmtrm_amount": "4,873,767,000,000", "thstrm_add_amount": "8,452,458,000,000", "frmtrm_add_amount": "4,873,767,000,000"}]
    # 참고: https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS003&apiId=2019020

# 매매동향
def trading(request,stock_code):
    if request.method == 'GET':
        pythoncom.CoInitialize()
        objCpCybos = win32com.client.Dispatch("CpUtil.CpCybos")
        bConnect = objCpCybos.IsConnect
        if (bConnect == 0):
            print("PLUS가 정상적으로 연결되지 않음. ")
            exit()
        
        # 객체 구하기
        objtrade = win32com.client.Dispatch("CpSysDib.CpSvrNew7216")
        objtrade.SetInputValue(0,'A'+stock_code)
        objtrade.SetInputValue(1,30)
        # objtrade.SetInputValue(2,'')
        objtrade.BlockRequest()
        
        # 통신 및 통신 에러 처리 
        rqStatus = objtrade.GetDibStatus()
        rqRet = objtrade.GetDibMsg1()
        print("통신상태", rqStatus, rqRet)
        if rqStatus != 0:
            exit()
        data = []
        for i in range(0,29) :
            temp = []
            date = objtrade.GetDataValue(0,i),  # 일자
            trading_volume = objtrade.GetDataValue(5,i),  # 거래량
            institutional_trade = objtrade.GetDataValue(6,i), # 기관매매
            institutional_trade_sum = objtrade.GetDataValue(7,i), # 기관매매 누적
            foreign_trade = objtrade.GetDataValue(8,i),  # 외국인 순매매
            foreign_ownership_rate = round(objtrade.GetDataValue(9,i),2) # 외국인 지분율
            temp = {'date':date[0],'trading_volume':trading_volume[0],'institutional_trade':institutional_trade[0],'institutional_trade_sum':institutional_trade_sum[0],'foreign_trade':foreign_trade[0],'foreign_ownership_rate':foreign_ownership_rate}
            data.append(temp)
        data.reverse()
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)