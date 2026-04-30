from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


products = [
    {
        "id": "og47",
        "name": "The OG47",
        "price": 249,
        "description": "The signature creation of Origine 1847. A rich, smooth, and perfectly balanced chocolate crafted with monk fruit and allulose.",
        "image": "assets/original.jpeg"
    },
    {
        "id": "hazelnut",
        "name": "The Hazelnut",
        "price": 299,
        "description": "A luxurious blend of roasted hazelnuts and silky chocolate. Nutty, creamy, and indulgent — designed for depth.",
        "image": "assets/hazelnut.png"
    },
    {
        "id": "mixed_nuts",
        "name": "Mixed Nuts",
        "price": 299,
        "description": "A power-packed combination of premium nuts coated in our signature chocolate. Crunchy and wholesome.",
        "image": "assets/mixed_nuts.jpeg"
    }
]

cart = []

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products
    products = [p for p in products if p['id'] != product_id]
    return jsonify({"message": "Product deleted successfully"}), 200

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()

    if not data or not all(k in data for k in ("name", "price", "description", "image")):
        return jsonify({"error": "Missing required fields"}), 400
    
    new_product = {
        "id": data['name'].lower().replace(" ", "_"),
        "name": data['name'],
        "price": data['price'],
        "description": data['description'],
        "image": data['image']
    }
    
    products.append(new_product)
    return jsonify(new_product), 201

@app.route('/api/cart', methods=['GET'])
def get_cart():
    
    total = sum(item['price'] * item['quantity'] for item in cart)
    return jsonify({
        "items": cart,
        "total": total,
        "count": sum(item['quantity'] for item in cart)
    })

@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('id')
    quantity = int(data.get('quantity', 1))
    
    
    product = next((p for p in products if p['id'] == product_id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
        
    
    existing_item = next((item for item in cart if item['id'] == product_id), None)
    if existing_item:
        existing_item['quantity'] += quantity
    else:
        cart.append({
            "id": product['id'],
            "name": product['name'],
            "price": product['price'],
            "image": product['image'],
            "quantity": quantity
        })
        
    return jsonify({"message": "Added to cart"}), 201

@app.route('/api/cart/<product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    global cart
    cart = [item for item in cart if item['id'] != product_id]
    return jsonify({"message": "Item removed"}), 200

@app.route('/api/cart', methods=['DELETE'])
def clear_cart():
    global cart
    cart = []
    return jsonify({"message": "Cart cleared"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)
