import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate('/Users/khaledazzouzi/Desktop/AlgoLingo_Senior_Project/back_end/back_end/algolingo-f1d7a-firebase-adminsdk-r03am-6e85fd56cd.json') # Update this path
firebase_admin.initialize_app(cred)