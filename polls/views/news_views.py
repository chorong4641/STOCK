from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
from ..models import News
from django.core import serializers

import json
import requests
from bs4 import BeautifulSoup

def news(request,company_name):
    if request.method == 'GET':
        queryset = News.objects.filter(company=company_name).order_by('-idx')[:7]
        serialize = serializers.serialize('json', queryset)
        data = []
        try:    
            # 데이터 가공
            for s in json.loads(serialize):
                temp = {}
                for k,v in s.items() :
                    if k == "fields" :
                        temp.update(v)
                data.append(temp)
        except:
            data['error'] = 1
    return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False},status=200)
    # 데이터 반환
    
# # 헤럴드 경제뉴스
# def heraldnews(request):
#     if request.method == 'GET':
#         # 웹 주소
#         webpage = requests.get('http://biz.heraldcorp.com/list.php?ct=010104000000')
#         soup = BeautifulSoup(webpage.content, 'html.parser')

#         # 데이터 호출
#         list = soup.select('.list > ul > li')
#         data = []

#         #데이터 추출
#         for i in list:
#             temp = {}
#             href = i.select_one('a')['href'] #링크
#             try: # 이미지 예외처리
#                 img = i.find('img')['src']
#             except:
#                 img = None
#             title = i.select_one('a > div > .list_title').get_text() #제목
#             text = i.select_one('a > div > .list_txt').get_text() #내용
#             date = i.select_one('.l_date').get_text() # 날짜
#             temp = {'href':'http://biz.heraldcorp.com/'+href, 'img':img, 'title':title, 'text':text, 'date':date }
#             data.append(temp)
#         return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
    
#     # data = [{'href': 'view.php?ud=20210602000698','img': 'http://res.heraldm.com/phpwas/restmb_idxmake.php?idx=707&simg=/content/image/2021/06/02/20210602000559_p.jpg',
#     # 'title': '5월 물가 2.6% 치솟아…9년1개월 만에 ‘최대폭’',
#     # 'text': ' 지난달 소비자 물가가 전년 동월보다 2.6% 오르며 9년 1개월 만에 가장 큰 폭으로 뛰었다. 특히 작황 부진과 조류 인플루엔자(AI) },
#     # {'href': 'view.php?ud=20210602000678','img': 'http://res.heraldm.com/phpwas/restmb_idxmake.php?idx=707&simg=/content/image/2021/06/02/20210602000545_p.jpg',
#     # 'title': '물가상승에 5년·10년물 급등...‘빚투’ 금리인상 부메랑 되나',
#     # 'text': ' 지난해부터 이어져온 ‘빚투 열풍’이 ‘금리 역습’에 직면했다. 물가 상승으로 시장금리가 오르며 대출금리 상승을 부추기고 있다. '}]

# # ytn 경제뉴스
# def ytnnews(request):
#     if request.method == 'GET':
#         # 웹 주소
#         webpage = requests.get('https://www.ytn.co.kr/news/list.php?mcd=0102')
#         soup = BeautifulSoup(webpage.content, 'html.parser')

#         # 데이터 호출
#         list = soup.select('.newslist_wrap ul > li > a')
#         data = []

#         #데이터 추출
#         for i in list:
#             temp = {}
#             href = i['href'] #링크
#             try: # 이미지 예외처리
#                 img = i.find('img')['src']
#             except:
#                 img = None
#             title = i.select_one('.infowrap > .til').get_text() #제목
#             text = i.select_one('.infowrap > .info > .desc').get_text() #내용
#             date = i.select_one('.infowrap > .info > .date').get_text() #날짜
#             temp = {'href':href, 'img':img, 'title':title, 'text':text , 'date':date}
#             data.append(temp)
#         return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)

        
# # joongang 경제뉴스
# def joongangnews(request):
#     if request.method == 'GET':
#         # 웹 주소
#         webpage = requests.get('https://news.joins.com/money?cloc=joongang-section-gnb3')
#         soup = BeautifulSoup(webpage.content, 'html.parser')

#         # 데이터 호출
#         list = soup.select('.story_list > li')
#         data = []

#         #데이터 추출
#         for i in list:
#             temp = {}
#             href = i.select_one('.headline > a')['href'] #링크
#             try: # 이미지 예외처리
#                 img = i.select_one('.card_image  img')['data-src']
#             except:
#                 img = None
#             title = i.select_one('.headline > a').get_text() #제목
#             text = i.select_one('.description > a').get_text() #내용
#             date = i.select_one('.meta > .date').get_text() #날짜
#             temp = {'href':href, 'img':img, 'title':title, 'text':text , 'date':date}
#             data.append(temp)
#         return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)