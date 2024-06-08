from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import fill_stack_randomly, generate_queue_operations_level1, generate_queue_operations_level2, generate_linked_list_operations1, check_linked_list_answer1, generate_heap, check_heap, generate_heap2, check_heap2
from firebase_admin import auth, credentials, initialize_app, firestore, exceptions
import firebase_admin
import logging

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

logging.basicConfig(level=logging.INFO)
firebase_app = initialize_app()
db = firestore.client()

@app.route('/register', methods=['OPTIONS', 'POST'])
def register():
    if request.method == 'OPTIONS':
        response = app.response_class()
        response.headers['Access-Control-Allow-Origin'] = '*'  # Set allowed origin
        response.headers['Access-Control-Allow-Methods'] = 'POST'  # Specify allowed methods
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # Specify allowed headers
        return response
    elif request.method == 'POST':
        try:
            data = request.json
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            logging.info(f'Registering user with email: {email}')

            # Create user
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name
            )

            logging.info(f'User created with UID: {user.uid}')

            # Save user details in Firestore
            user_ref = db.collection('users').document(user.uid)
            user_ref.set({
                'name': name,
                'email': email,
            })

            # Initialize user levels
            initialize_user_levels(user.uid)

            logging.info(f'User levels initialized for UID: {user.uid}')

            return jsonify({"message": "Registration successful"}), 201
        except exceptions.FirebaseError as e:
            logging.error(f'Firebase error: {e}')
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            logging.error(f'Error: {e}')
            return jsonify({"error": str(e)}), 500
        
def initialize_user_levels(user_id):
    levels = {
        "Stack_Level": ["FirstLevel", "SecondLevel", "ThirdLevel"],
        "QueueLevel": ["queueFirstLevel", "queueSecondLevel"],
        "LinkedList": ["LinkedFirstLevel", "LinkedSecondLevel"],
        "Binary_search_level": ["BinaryFirstLevel", "BSLevel2"]
    }

    for section, levels_list in levels.items():
        for level_name in levels_list:
            level_ref = db.collection('user_levels').document()
            level_ref.set({
                'userId': user_id,
                'section': section,
                'level': level_name,
                'status': False,
                'score': 0
            })        

@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    user_doc_ref = db.collection('users').document(user_id)
    user_doc = user_doc_ref.get()

    if user_doc.exists:
        return jsonify(user_doc.to_dict()), 200
    else:
        return jsonify({'error': 'User document not found'}), 404

@app.route('/Googleregister', methods=['OPTIONS', 'POST'])
def Googleregister():
    if request.method == 'OPTIONS':
        response = app.response_class()
        response.headers['Access-Control-Allow-Origin'] = '*'  # Set allowed origin
        response.headers['Access-Control-Allow-Methods'] = 'POST'  # Specify allowed methods
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # Specify allowed headers
        return response
    elif request.method == 'POST':
        try:
            data = request.json
            uid = data.get('uid')
            name = data.get('name')
            email = data.get('email')

            user_ref = db.collection('users').document(uid)
            user_ref.set({
                'name': name,
                'email': email,
            })

            # Initialize user levels
            initialize_user_levels(uid)

            return jsonify({"message": "Google Registration successful"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        

@app.route('/get_user_level_data', methods=['GET'])
def get_user_level_data():
    user_id = request.args.get('userId')
    section = request.args.get('section')
    level_name = request.args.get('level')

    missing_params = []
    if not user_id:
        missing_params.append('userId')
    if not section:
        missing_params.append('section')
    if not level_name:
        missing_params.append('level')

    if missing_params:
        logging.error("Missing parameters: %s", missing_params)
        return jsonify({'error': 'Missing parameters', 'missing': missing_params}), 400

    user_level_ref = db.collection('user_levels').where('userId', '==', user_id).where('section', '==', section).where('level', '==', level_name).limit(1).get()

    if user_level_ref:
        for doc in user_level_ref:
            logging.info("Document found: %s", doc.id)
            user_level_data = doc.to_dict()
            score = user_level_data.get('score')
            status = user_level_data.get('status')
            return jsonify({'score': score, 'status': status}), 200
    else:
        logging.error("User level not found")
        return jsonify({'error': 'User level not found'}), 404   
        
@app.route('/login', methods=['OPTIONS', 'POST'])
def login():
    if request.method == 'OPTIONS':
        response = app.response_class()
        response.headers['Access-Control-Allow-Origin'] = '*'  # Set allowed origin
        response.headers['Access-Control-Allow-Methods'] = 'POST'  # Specify allowed methods
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # Specify allowed headers
        return response
    elif request.method == 'POST':
        try:
            data = request.json
            id_token = data.get('idToken')

            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']

            user_ref = db.collection('users').document(uid)
            user_data = user_ref.get()
            if user_data.exists:
                return jsonify({"message": "Login successful", "user": user_data.to_dict()}), 200
            else:
                return jsonify({"error": "User not found"}), 404
        except exceptions.FirebaseError as e:
            return jsonify({"error": str(e)}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
@app.route('/add_level', methods=['POST'])
def add_level():
    try:
        data = request.json
        level_id = data.get('level_id')
        name = data.get('name')
        section = data.get('section')
        description = data.get('description')
       

        level_ref = db.collection('levels').document(level_id)
        level_ref.set({
            'name': name,
            'section': section,
            'description': description,
            
        })

        return jsonify({"message": "Level added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500       
    
@app.route('/update_user_level', methods=['POST'])
def update_user_level():
    data = request.get_json()

    logging.info("Received data: %s", data)

    user_id = data.get('userId')
    section = data.get('section')
    level_name = data.get('level')
    status = data.get('status')
    score = data.get('score')

    # Check if any parameter is missing
    missing_params = []
    if not user_id:
        missing_params.append('userId')
    if not section:
        missing_params.append('section')
    if not level_name:
        missing_params.append('level')
    if status is None:  # explicitly check for None
        missing_params.append('status')
    if score is None:  # explicitly check for None
        missing_params.append('score')

    if missing_params:
        logging.error("Missing parameters: %s", missing_params)
        return jsonify({'error': 'Missing parameters', 'missing': missing_params}), 400

    user_level_ref = db.collection('user_levels').where('userId', '==', user_id).where('section', '==', section).where('level', '==', level_name).limit(1).get()

    if user_level_ref:
        for doc in user_level_ref:
            logging.info("Document found: %s", doc.id)
            doc_ref = db.collection('user_levels').document(doc.id)
            doc_ref.update({
                'status': status,
                'score': score
            })
        logging.info("User level updated successfully")
        return jsonify({'message': 'User level updated successfully'}), 200
    else:
        logging.error("User level not found")
        return jsonify({'error': 'User level not found'}), 404

    
@app.route('/fill_stack', methods=['GET'])
def fill_stack():
    try:
        element_count = int(request.args.get('count', 5))
        stack = fill_stack_randomly(element_count)
        print(f"Generated stack: {stack}")  # Log the generated stack
        return jsonify(stack)
    except ValueError:
        return jsonify({"error": "Invalid count value"}), 400
        
@app.route('/check_answer', methods=['POST'])
def check_answer():
    try:
        data = request.json
        user_answer = data.get('user_answer')
        popped_values = data.get('popped_values')
        last_popped_value = popped_values[-1] if popped_values else None
        
        if user_answer is not None and last_popped_value is not None:
            if int(user_answer) == last_popped_value:
                return jsonify({"result": "Great!", "is_correct": True})
            else:
                return jsonify({"result": "Incorrect", "is_correct": False})
        return jsonify({"error": "Invalid data"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate_queue_operations_level1', methods=['GET'])
def generate_queue_operations_level1_route():
    try:
        operations, queue, enqueued_values = generate_queue_operations_level1()
        return jsonify({"operations": operations, "queue": queue, "enqueued_values": enqueued_values})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate_queue_operations_level2', methods=['GET'])
def generate_queue_operations_level2_route():
    try:
        operations, queue, enqueued_values, total_sum = generate_queue_operations_level2()
        return jsonify({"operations": operations, "queue": queue, "enqueued_values": enqueued_values, "total_sum": total_sum})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_queue_answer_level1', methods=['POST'])
def check_queue_answer_level1():
    try:
        data = request.json
        user_answer = list(map(int, data.get('user_answer')))
        correct_queue = data.get('correct_queue')
        
        if user_answer == correct_queue:
            return jsonify({"result": "Correct!", "is_correct": True})
        else:
            return jsonify({"result": "Incorrect, try again", "is_correct": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_queue_answer_level2', methods=['POST'])
def check_queue_answer_level2():
    try:
        data = request.json
        user_answer = int(data.get('user_answer'))
        total_sum = int(data.get('total_sum'))
        
        if user_answer == total_sum:
            return jsonify({"result": "Correct!", "is_correct": True})
        else:
            return jsonify({"result": "Incorrect, try again", "is_correct": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/generate_linked_list_operations1', methods=['GET'])
def generate_linked_list_operations_route():
    try:
        nodes, delete_step, remaining_values = generate_linked_list_operations1()
        return jsonify({"nodes": nodes, "delete_step": delete_step, "remaining_values": remaining_values})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_linked_list_answer1', methods=['POST'])
def check_linked_list_answer_route():
    try:
        data = request.json
        user_guess = data.get('user_guess')
        correct_values = data.get('correct_values')
        
        is_correct = check_linked_list_answer1(user_guess, correct_values)
        if is_correct:
            return jsonify({"result": "Correct!", "is_correct": True})
        else:
            return jsonify({"result": "Incorrect, try again", "is_correct": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/generate_heap', methods=['GET'])
def generate_heap_route():
    try:
        nodes = generate_heap()
        return jsonify({"nodes": nodes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_heap', methods=['POST'])
def check_heap_route():
    try:
        data = request.json
        heap = data.get('heap')
        is_max_heap = data.get('is_max_heap')
        
        is_correct = check_heap(heap, is_max_heap)
        if is_correct:
            return jsonify({"result": "Correct!", "is_correct": True})
        else:
            return jsonify({"result": "Incorrect, try again", "is_correct": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate_heap2', methods=['GET'])
def generate_heap_route2():
    try:
        nodes = generate_heap2()
        return jsonify({"nodes": nodes})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_heap2', methods=['POST'])
def check_heap_route2():
    try:
        data = request.json
        heap = data.get('heap')
        is_max_heap = data.get('is_max_heap')
        
        is_correct = check_heap2(heap, is_max_heap)
        if is_correct:
            return jsonify({"result": "Correct!", "is_correct": True})
        else:
            return jsonify({"result": "Incorrect, try again", "is_correct": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/update_leaderboard', methods=['POST'])
def update_leaderboard():
    try:
        data = request.json
        user_id = data.get('userId')
        total_points = data.get('totalPoints')
        display_name = data.get("userName")

        if not user_id or not total_points:
            return jsonify({'error': 'User ID and total points are required'}), 400

        leaderboard_ref = db.collection('leaderboard').document(user_id)
        leaderboard_ref.set({
            'userId': user_id,
            'userName': display_name,
            'totalPoints': total_points,
            
        })

        return jsonify({"message": "Leaderboard updated successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        leaderboard_collection = db.collection('leaderboard')
        leaderboard_docs = leaderboard_collection.stream()

        leaderboard_data = []
        for doc in leaderboard_docs:
            leaderboard_data.append(doc.to_dict())

        return jsonify(leaderboard_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
    
if __name__ == '__main__':
    app.run(debug=True)



