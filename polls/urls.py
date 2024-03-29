from django.urls import path
from .views import home_views, stock_views, news_views, word_views, user_views , board_views , bookmark_views , mockinvestment_view , suggestion_views

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
        path('api/disclosure/<str:stock_code>',stock_views.disclosure, name='disclosure'),
        path('api/financial/<str:stock_code>',stock_views.financial, name='financial'),
        path('api/trading/<str:stock_code>',stock_views.trading, name='trading'),

        # 뉴스 페이지
        path('api/news/<str:company_name>',news_views.news, name='news'),

        # 주식 용어 페이지
        path('api/word/stockword',word_views.stockword, name='stockword'),

        # 회원가입/로그인 페이지
        path('api/user/register',user_views.register, name='register'),
        path('api/user/login',user_views.login, name='login'),
        path('api/user/logout',user_views.logout, name='logout'),
        path('api/user/edit',user_views.edit, name='edit'),
        path('api/user/find_id',user_views.find_id, name='find_id'),
        path('api/user/confirm_pw',user_views.confirm_pw, name='confirm_pw'),
        path('api/user/reset_pw',user_views.reset_pw, name='reset_pw'),

        # 게시판 페이지
        path('api/board/create',board_views.create, name='board_create'),
        path('api/board/read',board_views.read, name='board_read'),
        path('api/board/update',board_views.update, name='board_update'),
        path('api/board/delete',board_views.delete, name='board_delete'),

        # 북마크 페이지
        path('api/bookmark/group_create',bookmark_views.group_create, name='group_create'),
        path('api/bookmark/group_delete',bookmark_views.group_delete, name='group_delete'),
        path('api/bookmark/stock_create',bookmark_views.stock_create, name='stock_create'),
        path('api/bookmark/stock_delete',bookmark_views.stock_delete, name='stock_delete'),
        path('api/bookmark/read',bookmark_views.bookmark_read, name='bookmark_read'),

        # 모의투자 페이지
        path('api/mock/insert',mockinvestment_view.insert, name='mock_insert'),
        path('api/mock/read',mockinvestment_view.read, name='mock_read'),
        
         # 종목추천 페이지
        path('api/suggestion',suggestion_views.suggestion, name='suggestion'),
]