from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from ..models import Word

import json

def stockword(request):
    if request.method == 'GET':
        queryset = Word.objects.all()
        serialize = serializers.serialize('json', queryset)
        data = []
        
        # 데이터 가공
        for s in json.loads(serialize):
            temp = {}
            for k,v in s.items() :
                if k == "fields" :
                    temp.update(v)
            data.append(temp)
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
        # data = [{"word": "매매","mean": "주식을 사고 파는 것"}, { "word": "매수", "mean": "주식을 사는 것" }]