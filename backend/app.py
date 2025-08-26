from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)

# Configure MongoDB
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/mydatabase")
mongo = PyMongo(app)

@app.route('/')
def hello_world():
    return jsonify(message="Welcome to the Flask API!")
# --- CRUD Operations ---
# CREATE an item
@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400

    new_item = {
        "name": data['name'],
        "description": data.get('description', '')
    }

    items_collection = mongo.db.items
    result = items_collection.insert_one(new_item)

    created_item = items_collection.find_one({"_id": result.inserted_id})
    created_item['_id'] = str(created_item['_id'])  # Convert ObjectId to string
    return jsonify(created_item), 201


# READ all items
@app.route('/items', methods=['GET'])
def get_items():
    items_collection = mongo.db.items
    items = []
    for item in items_collection.find():
        item['_id'] = str(item['_id'])
        items.append(item)
    return jsonify(items)


# READ a single item
@app.route('/items/<id>', methods=['GET'])
def get_item(id):
    items_collection = mongo.db.items
    try:
        item = items_collection.find_one({"_id": ObjectId(id)})
        if item:
            item['_id'] = str(item['_id'])
            return jsonify(item)
        return jsonify({"error": "Item not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400


# UPDATE an item
@app.route('/items/<id>', methods=['PUT'])
def update_item(id):
    data = request.json
    items_collection = mongo.db.items
    try:
        result = items_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        if result.modified_count == 1:
            updated_item = items_collection.find_one({"_id": ObjectId(id)})
            updated_item['_id'] = str(updated_item['_id'])
            return jsonify(updated_item)
        return jsonify({"error": "Item not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid ID format or no changes made"}), 400


# DELETE an item
@app.route('/items/<id>', methods=['DELETE'])
def delete_item(id):
    items_collection = mongo.db.items
    try:
        result = items_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Item deleted successfully"}), 204
        return jsonify({"error": "Item not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid ID format"}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)