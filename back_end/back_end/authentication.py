import firebase_admin
from firebase_admin import auth
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth.models import User

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header:
            return None

        id_token = auth_header.split(' ').pop()
        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')

        uid = decoded_token.get('uid')
        user, created = User.objects.get_or_create(username=uid)

        return (user, None)
