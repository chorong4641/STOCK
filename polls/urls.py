from django.urls import path
from .views import home_views, stock_views, news_views, word_views, user_views , board_views

urlpatterns = [
        # 메인 페이지
        # path('',main_views.main, name='main'),
        path('api/chart/stock',home_views.stock, name='stock'),
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

        # 주식 용어 페이지
        path('api/word/stockword',word_views.stockword, name='stockword'),

        # 회원가입/로그인 페이지
        path('api/user/register',user_views.register, name='register'),
        path('api/user/login',user_views.login, name='login'),
        path('api/user/logout',user_views.logout, name='logout'),
        path('api/user/edit',user_views.edit, name='edit'),

        # 게시판 페이지
        path('api/board/create',board_views.create, name='create'),
        path('api/board/read',board_views.read, name='read'),
        path('api/board/update',board_views.update, name='update'),
        path('api/board/delete',board_views.delete, name='delete'),
]