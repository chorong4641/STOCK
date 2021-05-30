from django.urls import path
from . import views

urlpatterns = [
        path('',views.main, name='main'),
        path('chart/foreign',views.foreign, name='foreign'),
        path('chart/domestic',views.domestic, name='domestic')
        # path('signup/',views.signup, name='signup'),
]
