from django.urls import path
from . import views

urlpatterns = [
        path('',views.main, name='main'),
        path('api/chart/foreign',views.foreign, name='foreign'),
        path('api/chart/domestic',views.domestic, name='domestic'),
        path('api/getstock/<str:stock_code>',views.getstock, name='getstock'),
        path('api/searchstock/<str:stock_name>',views.searchstock, name='searchstock')
]
