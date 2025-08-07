from PlayerBase import PlayerDBManager# type: ignore
from ItemBase import ItemDBManager# type: ignore
from ItemPlayerBase import ItemPlayerDBM # type: ignore
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS  # 👈 Import this


app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    'host': 'localhost',
    'database': 'itemTracker_db',
    'user': 'root',
    'password': 'curtis'
}

playerbase_manager = PlayerDBManager(DB_CONFIG)

itembase_manager = ItemDBManager(DB_CONFIG)

itemPlayer_manager = ItemPlayerDBM(DB_CONFIG)

def main():

    if not playerbase_manager.connect():
        print("Failed to connect to the PlayerBase, Exiting...")
        sys.exit(1)

    if not itembase_manager.connect():
        print("Failed to connect to the ItemBase, Exiting...")
        sys.exit(1)

    if not itemPlayer_manager.connect():
        print("Failed to connect to the ItemPlayerBase, Exiting...")
        sys.exit(1)

    playerbase_manager.create_player_table()

    itembase_manager.create_item_table()

    itemPlayer_manager.create_itemPlay_table()

@app.route("/")
def home():
    return("Welcome to the Item tracker")

# Player related routes

@app.route("/player")
def list_player():
    return playerbase_manager.list_players(), 201

@app.route("/player", methods=['POST'])
def create_player():
    new_player_data = request.get_json()
        
    player_tag = new_player_data['player_tag']

    new_player = playerbase_manager.create_player(player_tag)

    if 'error' in new_player:
        return jsonify({'error': new_player['error']}), new_player.get('status', 400)

    return jsonify(new_player), 201

@app.route("/player/<player_id>", methods=['DELETE'])
def delete_player(player_id):
    deleted_player = playerbase_manager.delete_player(player_id)

    if 'error' in deleted_player:
        return jsonify({'error': deleted_player['error']}), deleted_player.get('status', 500)
    
    return jsonify(deleted_player), 200

@app.route("/player/<player_id>", methods=['PATCH'])
def edit_player(player_id):
    try:
        edited_player_data = request.get_json()

        edited_player = playerbase_manager.edit_player(edited_player_data, player_id)

        if 'error' in edited_player:
            return jsonify({'error': edited_player['error']}), edited_player.get('status', 500)

        return jsonify(edited_player), edited_player.get('status')
    
    except:
        return jsonify({'error': 'Missing data', 'status': 400})

# Item related routes

@app.route("/item")
def list_item():
    return itembase_manager.list_items(), 201

@app.route("/item", methods=['POST'])
def create_item():
    new_item_data = request.get_json()

    item_name = new_item_data['item_name']
    item_qty = new_item_data.get('item_qty', 1) # Get the quantity or 1

    new_item = itembase_manager.create_item(item_name, item_qty)

    return jsonify(new_item), 201

@app.route("/item/<item_id>", methods=['DELETE'])
def delete_item(item_id):
    deleted_item = itembase_manager.delete_item(item_id)

    if 'error' in deleted_item:
        return jsonify({'error': deleted_item['error']}), deleted_item.get('status', 500)
    
    return jsonify(deleted_item), 200

@app.route("/item/<item_id>", methods=['PATCH'])
def edit_item(item_id):
    try:
        edited_item_data = request.get_json()

        edited_item = itembase_manager.edit_item(edited_item_data, item_id)

        if 'error' in edited_item:
            return jsonify({'error': edited_item['error']}), edited_item.get('status', 500)

        return jsonify(edited_item), edited_item.get('status')
    
    except:
        return jsonify({'error': 'Missing data', 'status': 400})
    
# Link related routes

@app.route("/link/<player_tag>")
def player_items(player_tag):
    search_data = itemPlayer_manager.search_link(player_tag)

    if 'error' in search_data:
            return jsonify({'error': search_data['error']}), search_data.get('status', 500)
    
    return jsonify(search_data),200

@app.route("/link", methods=['POST'])
def link_player_item():
    new_link_data = request.get_json()

    

    linked_data = itemPlayer_manager.create_link(new_link_data)

    if 'error' in linked_data:
            return jsonify({'error': linked_data['error']}), linked_data.get('status', 500)

    return jsonify(linked_data), 201

@app.route("/link/<player_id>/<item_id>", methods=['DELETE'])
def delete_link(player_id, item_id):
    deleted_link = itemPlayer_manager.delete_link(player_id, item_id)

    if 'error' in deleted_link:
        return jsonify({'error': deleted_link['error']}), deleted_link.get('status', 500)
    
    return jsonify(deleted_link), 200

if __name__ == "__main__":
    main()
    app.run(debug=True)