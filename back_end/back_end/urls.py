from django.urls import path, include, re_path
from django.views.generic import TemplateView
from .views import register_user

urlpatterns = [
    path('auth/register/', register_user, name='register'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
