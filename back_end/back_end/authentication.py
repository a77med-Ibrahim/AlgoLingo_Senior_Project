from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')
        if not authorization_header:
            return None
        try:
            # Verify Firebase auth token
            id_token = authorization_header.split(' ').pop()
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token['email']

            # Get or create user from decoded token
            user, created = User.objects.get_or_create(username=uid, defaults={'email': email})

            return (user, None)
        except:
            raise exceptions.AuthenticationFailed('Authentication Failed')