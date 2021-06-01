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
        
        # 뉴스 페이지
        # path('api/news',news_views.news, name='getstock'),
]
