from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('fill', views.fill, name='fill'),
    path('preview', views.preview, name='preview'),
    # path('download', views.download_pdf, name='download'),
]