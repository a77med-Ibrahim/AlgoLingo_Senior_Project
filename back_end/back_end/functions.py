import random

def fill_stack_randomly(element_count):
    stack = [random.randint(0, 100) for _ in range(element_count)]
    return stack

def generate_queue_operations_level1():
    queue = []
    operations = []
    enqueued_values = []
    count = random.randint(5, 15)
    
    for _ in range(count):
        if random.random() > 0.5 or not queue:
            value = random.randint(1, 100)
            operations.append(f"enqueue({value})")
            queue.append(value)
            enqueued_values.append(value)
        else:
            operations.append("dequeue()")
            if queue:
                queue.pop(0)
    
    return operations, queue, enqueued_values

def generate_queue_operations_level2():
    queue = []
    operations = []
    enqueued_values = []
    count = random.randint(5, 15)
    
    for _ in range(count):
        if random.random() > 0.5 or not queue:
            value = random.randint(1, 100)
            operations.append(f"enqueue({value})")
            queue.append(value)
            enqueued_values.append(value)
        else:
            operations.append("dequeue()")
            if queue:
                queue.pop(0)
    
    total_sum = sum(queue)
    return operations, queue, enqueued_values, total_sum

def generate_linked_list_operations1():
    node_count = random.randint(3, 5)  # 3-5 nodes
    nodes = [{"id": f"node-{i}", "value": random.randint(0, 100)} for i in range(node_count)]
    delete_step = random.randint(1, node_count - 1)  # Random node to be deleted (not the head)
    
    remaining_nodes = [node for i, node in enumerate(nodes) if i != delete_step]
    remaining_values = [node["value"] for node in remaining_nodes]

    return nodes, delete_step, remaining_values

def check_linked_list_answer1(user_guess, correct_values):
    user_guess_list = list(map(int, user_guess.split(',')))
    return user_guess_list == correct_values

def generate_heap():
    node_count = 7
    nodes = [{"id": i, "number": random.randint(1, 100)} for i in range(node_count)]
    return nodes

def check_heap(heap, is_max_heap):
    def is_max_heap_func(heap):
        for i in range(len(heap)):
            left = 2 * i + 1
            right = 2 * i + 2
            if (left < len(heap) and heap[i]["number"] < heap[left]["number"]) or (right < len(heap) and heap[i]["number"] < heap[right]["number"]):
                return False
        return True

    def is_min_heap_func(heap):
        for i in range(len(heap)):
            left = 2 * i + 1
            right = 2 * i + 2
            if (left < len(heap) and heap[i]["number"] > heap[left]["number"]) or (right < len(heap) and heap[i]["number"] > heap[right]["number"]):
                return False
        return True

    if is_max_heap:
        return is_max_heap_func(heap)
    else:
        return is_min_heap_func(heap)


def generate_heap2():
    node_count = 15
    nodes = [{"id": i, "number": random.randint(1, 1000)} for i in range(node_count)]
    return nodes

def check_heap2(heap, is_max_heap):
    def is_max_heap_func2(heap):
        for i in range(len(heap)):
            left = 2 * i + 1
            right = 2 * i + 2
            if (left < len(heap) and heap[i]["number"] < heap[left]["number"]) or (right < len(heap) and heap[i]["number"] < heap[right]["number"]):
                return False
        return True

    def is_min_heap_func2(heap):
        for i in range(len(heap)):
            left = 2 * i + 1
            right = 2 * i + 2
            if (left < len(heap) and heap[i]["number"] > heap[left]["number"]) or (right < len(heap) and heap[i]["number"] > heap[right]["number"]):
                return False
        return True

    if is_max_heap:
        return is_max_heap_func2(heap)
    else:
        return is_min_heap_func2(heap)