from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm

import sys
from PyQt5.QtWidgets import *
import win32com.client
import pythoncom
import pandas as pd
import os

# 메인
def main(request):
    return HttpResponse('main')

#국내차트 데이터 전송
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
        code = {'코스피':'U001','코스닥':'U201'}
        list = {'코스피':{},'코스닥':{}}
        for k,v in code.items() :
            objDomeindex.SetInputValue(0,v) # 나스닥
            objDomeindex.SetInputValue(1,ord("D")) # 일자별
            objDomeindex.SetInputValue(3,9999) # 일자별
            objDomeindex.BlockRequest()
            for i in range(0,6) :
                list[k][objDomeindex.GetDataValue(0,i)] = objDomeindex.GetDataValue(1,i)
        pythoncom.CoUninitialize()
        return JsonResponse(list, json_dumps_params={'ensure_ascii': False}, status=200)

# 해외차트 데이터 전송
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
        code = {'다우':'.DJI','나스닥':'COMP'}
        list = {'다우':{},'나스닥':{}}
        for k,v in code.items() :
            objForeindex.SetInputValue(0,v) # 나스닥
            objForeindex.SetInputValue(1,ord("D")) # 일자별
            objForeindex.SetInputValue(3,9999) # 일자별
            objForeindex.BlockRequest()
            for i in range(0,6) :
                list[k][objForeindex.GetDataValue(0,i)] = objForeindex.GetDataValue(1,i)
        pythoncom.CoUninitialize()
        return JsonResponse(list,json_dumps_params={'ensure_ascii': False}, status=200)


# 회워가입
# def signup(request):
#     if request.method == 'POST':
        
    # return render(request, '../templetes/polls/signup.html', context)
# Create your views here.
