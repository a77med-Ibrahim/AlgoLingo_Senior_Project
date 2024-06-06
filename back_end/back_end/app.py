from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
import firebase_admin

app = Flask(__name__)

# Initialize Firestore DB
cred = credentials.Certificate('.\algolingo-f1d7a-firebase-adminsdk-r03am-6e85fd56cd.json')
default_app = initialize_app(cred)
db = firestore.client()
user_ref = db.collection('users')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    try:
        # Check if user already exists
        user = user_ref.document(email).get()
        if user.exists:
            return jsonify({"error": "User already exists"}), 400

        # Create new user
        user_ref.document(email).set({
            'name': name,
            'email': email,
            'completedLevels': {},
            'points': {},
        })
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
