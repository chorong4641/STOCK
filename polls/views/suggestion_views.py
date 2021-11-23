from datetime import date,datetime
from ..models import Krx
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

import pandas as pd
import FinanceDataReader as fdr
import json
import requests
import datetime

@csrf_exempt
def suggestion(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body)
            # start_date = (datetime.datetime.strptime(request_data['start_date'],'%Y-%m-%d') + datetime.timedelta(1)).strftime("%Y-%m-%d")
            # end_date = (datetime.datetime.strptime(request_data['end_date'],'%Y-%m-%d') - datetime.timedelta(1)).strftime("%Y-%m-%d")
            if request_data['period'] == '6month':
                start_date = (datetime.datetime.strptime('2021-06-01','%Y-%m-%d') + relativedelta(months=-6)).strftime("%Y-%m-%d")
            elif request_data['period'] == '1year':
                start_date = (datetime.datetime.strptime('2021-06-01','%Y-%m-%d') + relativedelta(year=-1)).strftime("%Y-%m-%d")
            else :
                start_date = (datetime.datetime.strptime('2021-06-01','%Y-%m-%d') + relativedelta(year=-5)).strftime("%Y-%m-%d")
            end_date = '2021-05-30'
            df_marcap = pd.DataFrame(list(Krx.objects.filter(date__range=[start_date,'2021-05-30']).values()))
            # df_marcap = pd.DataFrame(list(Krx.objects.filter(date__range=['2020-01-01','2020-12-31']).values()))
            df_marcap = df_marcap.set_index('date')
            pd.options.display.float_format = '{:.1f}'.format
            df_master = fdr.StockListing('KRX')
            df_master = df_master.dropna(subset=['Sector'])
            df = pd.merge(df_marcap[['code', 'name', 'marcap']].reset_index(), df_master[['Symbol', 'Sector']], left_on='code', right_on="Symbol")
            marcap_sector = pd.pivot_table(df, index='date', columns='Sector', values='marcap', aggfunc='sum')
            cols = pd.DataFrame(marcap_sector.loc[end_date].sort_values(ascending=False)).head(10).index
            graph = marcap_sector.loc[(start_date + datetime.timedelta(1)).strftime("%Y-%m-%d"):, cols].to_json()
            
            top_sector = marcap_sector.loc[end_date].sort_values(ascending=False)[:10]
            top_sector = top_sector.to_dict()   # 1등섹터
            
            sug = []
            # 1등섹터에서 시가총액1위
            for s in top_sector.keys():
                temp = df[(df['date'] == end_date) & (df['Sector'] == s)]
                temp = temp.sort_values(by = ['marcap'], ascending = False).head(5)
                sug.append({s:temp['name'].values.tolist()})
            data = {'sug':sug,'graph':graph}
        except:
            data = {'error':1}
        return JsonResponse(data,safe=False,json_dumps_params={'ensure_ascii': False}, status=200)
        # {"sector": "통신 및 방송 장비 제조업", "company": ["삼성전자", "LG전자", "케이엠더블유"]}
        # https://github.com/FinanceData/marcap/blob/master/marcap-tutorial-04-sector-analysis.ipynb <- 참고사이트