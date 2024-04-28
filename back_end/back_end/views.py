# back_end/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreateSerializer
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes
from .authentication import FirebaseAuthentication

@api_view(['POST'])
@authentication_classes([FirebaseAuthentication])
def login_view(request):
    # At this point, authentication has already been done by FirebaseAuthentication
    # So, we just return a success response.
    # You could add any additional login logic here if necessary.
    return JsonResponse({"message": "User authenticated successfully"}, status=200)

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
