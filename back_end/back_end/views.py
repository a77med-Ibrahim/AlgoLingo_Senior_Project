# back_end/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreateSerializer
import pyrebase
from django.shortcuts import render

config = {
  "apiKey": "AIzaSyAaiS4rJoSXvmhIroSm-ngE_fAhK-FMBY4",
  "authDomain": "algolingo-f1d7a.firebaseapp.com",
  "databaseURL": "https://algolingo-f1d7a-default-rtdb.firebaseio.com",
  "projectId": "algolingo-f1d7a",
  "storageBucket": "algolingo-f1d7a.appspot.com",
  "messagingSenderId": "103572764164",
  "appId": "1:103572764164:web:46085b9acc17ad5ad7e751",
}
firebase=pyrebase.initialize_app(config)
authe = firebase.auth()
database = firebase.database()

def index(request):
    Hello = database.child('Data').child('Email').get().val
    return render(request, 'index.html',{
        "Hello":Hello
    })

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
