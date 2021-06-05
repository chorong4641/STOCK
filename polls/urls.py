from django.urls import path
from .views import home_views, stock_views, news_views

urlpatterns = [
        # 메인 페이지
        # path('',main_views.main, name='main'),
        path('api/chart/foreign',home_views.foreign, name='foreign'),
        path('api/chart/domestic',home_views.domestic, name='domestic'),
        path('api/searchstock/<str:stock_name>',home_views.searchstock, name='searchstock'),
        
        # 상세 페이지
        path('api/getstock/<str:stock_code>',stock_views.getstock, name='getstock'),
        path('api/searchnews/<str:stock_name>',stock_views.searchnews, name='searchnews'),
        path('api/chart/time/<str:stock_code>',stock_views.real_time, name='real_time'),
        path('api/chart/price/<str:stock_code>/<str:term>',stock_views.price_by_period, name='price_by_period'),

        # 뉴스 페이지
        path('api/news/heraldnews',news_views.heraldnews, name='heraldnews'),
        path('api/news/ytnnews',news_views.ytnnews, name='ytnnews'),
        path('api/news/joongangnews',news_views.joongangnews, name='joongangnews'),
]
