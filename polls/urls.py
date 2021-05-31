from django.urls import path
from . import views

urlpatterns = [
        path('',views.main, name='main'),
        path('polls/chart/foreign',views.foreign, name='foreign'),
        path('polls/chart/domestic',views.domestic, name='domestic'),
        path('api/getstock/<str:stock_code>',views.getstock, name='getstock'),
        path('api/searchstock/<str:stock_name>',views.searchstock, name='searchstock')
        # path('chart/foreign',views.foreign, name='foreign'),
        # path('chart/domestic',views.domestic, name='domestic')
        # path('signup/',views.signup, name='signup'),
]
