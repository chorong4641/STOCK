from datetime import date
from ..models import Krx
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

import pandas as pd
import FinanceDataReader as fdr
import json
import requests

@csrf_exempt
def suggestion(request):
    if request.method == 'POST':
        request_data = json.loads(request.body)
        # df_marcap = pd.DataFrame(list(Krx.objects.filter(date__range=[request_data['start_date'],request_data['end_date']]).values())) <ㅡ실뎉이터
        df_marcap = pd.DataFrame(list(Krx.objects.filter(date__range=['2020-01-01','2020-12-31']).values()))
        df_marcap = df_marcap.set_index('date')
        pd.options.display.float_format = '{:.1f}'.format
        df_master = fdr.StockListing('KRX')
        df_master = df_master.dropna(subset=['Sector'])
        df = pd.merge(df_marcap[['code', 'name', 'marcap']].reset_index(), df_master[['Symbol', 'Sector']], left_on='code', right_on="Symbol")
        marcap_sector = pd.pivot_table(df, index='date', columns='Sector', values='marcap', aggfunc='sum')
        # cols = pd.DataFrame(marcap_sector.loc[request_data['end_date']-1].sort_values(ascending=False)).head(10).index <-실데이터
        cols = pd.DataFrame(marcap_sector.loc['2020-12-30'].sort_values(ascending=False)).head(10).index # <- 테스트데이터
        
        # graph = marcap_sector.loc[request_data['start_date']+1:, cols].plot(figsize=(16,8)) # <- 섹터별 시가총액 그래프 이걸 어케 보내주지..?
        # graph = marcap_sector.loc['2020-01-02':, cols].plot(figsize=(16,8)) # <- 테스트데이터 일단이걸로 테스트 ㄱㄱㄱ
        
        # top_sector = marcap_sector.loc[request_data['end_date']-1].sort_values(ascending=False)[:1] <-실 데이터
        top_sector = marcap_sector.loc['2020-12-30'].sort_values(ascending=False)[:1] # <- 테스트데이터
        top_sector = next(iter(top_sector.to_dict()))   # 1등섹터
        
        # 1등섹터에서 시가총액1위
        sug = df[(df['date'] == '2020-12-30') & (df['Sector'] == top_sector )]
        sug = sug.sort_values(by = ['marcap'], ascending = False).head(3) 
        # data = {'sector':top_sector,'company':sug['name'].values.tolist(),'graph':graph} <= 그래프 추가하면 해보셍
        data = {'sector':top_sector,'company':sug['name'].values.tolist()}
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        # {"sector": "통신 및 방송 장비 제조업", "company": ["삼성전자", "LG전자", "케이엠더블유"]}
        # https://github.com/FinanceData/marcap/blob/master/marcap-tutorial-04-sector-analysis.ipynb <- 참고사이트