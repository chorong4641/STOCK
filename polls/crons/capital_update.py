from django.core.exceptions import ImproperlyConfigured
from pathlib import Path
from datetime import datetime, timedelta
import psycopg2
import json
import FinanceDataReader as fdr

with open("STOCK/secret.json") as f:
    secrets = json.loads(f.read())

def get_secret(key, setting, secrets=secrets):
    try:
        return secrets[key][setting]
    except KeyError:
        error_msg = "Set the {} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)

DATABASES = {
    'NAME': get_secret("DATABASES","NAME"),                  
    'USER': get_secret("DATABASES","USER"),                          
    'PASSWORD': get_secret("DATABASES","PASSWORD"),                  
    'HOST': get_secret("DATABASES","HOST"),                     
    'PORT': get_secret("DATABASES","PORT"),                    
}
db = psycopg2.connect(host=DATABASES['HOST'], dbname=DATABASES['NAME'],user=DATABASES['USER'],password=DATABASES['PASSWORD'],port=DATABASES['PORT'])
cursor = db.cursor()

# 코드 조회
cursor.execute('select distinct code from public.mock_investment')
code = cursor.fetchall()
code_list = []
date = (datetime.now() + timedelta(days=-7)).strftime('%Y-%m-%d')
price = {}
for c in code:
    df = fdr.DataReader(c[0],str(date))
    df = df.head(1)
    df.reset_index(inplace = True)
    df = df[['Close']]
    df = df.rename(columns={'Close':'index'}).to_dict('records')
    price[c[0]] = df[0]['index']

# 종목 조회
cursor.execute('select id,code,price,count from public.mock_investment')
stock = cursor.fetchall()
start = stock[0][0]
end = len(stock)
data = {}
closing_price = 0
current_price = 0
for s in stock:
    if start != s[0]:
        start = s[0]
        closing_price = 0
        current_price = 0
    else:
        closing_price += s[2] * s[3]
        current_price += price[s[1]] * s[3]
    data[s[0]] = current_price - closing_price

# 전날 잔고 조회
yesterday = (datetime.now() + timedelta(days=-1)).strftime('%Y-%m-%d')
cursor.execute('select id,capital from public.user_capital where date_check = %s', [yesterday])
capital = cursor.fetchall()
total = {}
for c in capital:
    data[c[0]] = data[c[0]] + c[1]

# 오늘 잔고로 업데이트 업데이트는 (12시이후새벽)
for x,y in data.items():
    cursor.execute('INSERT INTO public.user_capital (id, capital, date_check, date_insert, date_update) VALUES (%s, %s, %s, %s, %s)', (x, y, datetime.now().strftime('%Y-%m-%d') , datetime.now(),datetime.now()))
db.commit()
db.close()
cursor.close()