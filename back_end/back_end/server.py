from flask import Flask, request, jsonify
from flask_cors import CORS
from functions import fill_stack_randomly, generate_queue_operations_level1, generate_queue_operations_level2, generate_linked_list_operations1, check_linked_list_answer1, generate_heap, check_heap, generate_heap2, check_heap2
from firebase_admin import auth, firestore, initialize_app



app = Flask(__name__)
CORS(app)  # Allow cross-origin requests


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

           
            user = auth.create_user(
                email=email,
                password=password,
                display_name=name
            )

            # Save user data to Firestore
            user_ref = db.collection('users').document(user.uid)
            user_ref.set({
                'name': name,
                'email': email,
                'completedLevels': {},
                'points': {}
            })

            # Return a success response
            return jsonify({"message": "Registration successful"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

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

if __name__ == '__main__':
    app.run(debug=True)



