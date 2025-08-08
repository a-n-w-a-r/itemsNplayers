from DatabaseManager import DatabaseManager
from mysql.connector import Error 

class ItemPlayerDBM(DatabaseManager):
    table_name = "itemPlayerBase"

    @DatabaseManager.requires_connection
    def create_itemPlay_table(self):
        create_table_query =   f"""
                                CREATE DATABASE IF NOT EXISTS itemtracker_db;
                                CREATE TABLE IF NOT EXISTS {self.table_name} (
                                player_id INT,
                                item_id INT,
                                quantity INT,
                                FOREIGN KEY (player_id) references playerBase(player_id) ON DELETE CASCADE,
                                FOREIGN KEY (item_id) references itemBase(item_id) ON DELETE CASCADE,
                                PRIMARY KEY (item_id, player_id)
                                );
                                """
        return self.create_table(create_table_query, self.table_name)
    
    @DatabaseManager.requires_connection
    def create_link(self, new_link_data):
        try:
            player_tag = new_link_data['player_tag']
            item_name = new_link_data['item_name']
            quantity = int(new_link_data['item_qty'])

            if not player_tag or not item_name or quantity is None:
                return {'error':'Missing key in request data', 'status': 400}
            
            pid = self.execute_query(f"SELECT player_id FROM playerBase WHERE player_tag = %s",
                                        (player_tag,),
                                        fetchone=True)
            # pid returns {'player_id': 60}
            # print(pid)

            iid = self.execute_query(f"SELECT item_id, item_qty FROM itemBase WHERE item_name = %s",
                                        (item_name,),
                                        fetchone=True)
            # print(iid)
            
            leftover_items = self.execute_query(f"SELECT COALESCE(SUM(quantity), 0) total FROM {self.table_name} WHERE item_id = %s",
                                                (iid['item_id'],),
                                                fetchone=True)
            print(leftover_items)
            
            items_left = iid['item_qty'] - leftover_items['total']
            
            if quantity > items_left or quantity <= 0:
                print("Error - Not enough remaining items")
                return {"error": "Not enough items for link",
                        "status": 400
                        }
            
            self.execute_query(f"INSERT INTO {self.table_name} (player_id, item_id, quantity) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)",
                                        (pid['player_id'], iid['item_id'], quantity),
                                        commit=True
                                        )
            
            return {'player_id': pid['player_id'],
                    'item_id': iid['item_id'],
                    'quantity': quantity}

        except Error as err:
            print("error", err)
            return {'error': 'Item could not link to player', 'status': 500}

    @DatabaseManager.requires_connection  
    def delete_link(self, player_id, item_id):
        try:
            self.execute_query(f"DELETE FROM {self.table_name} WHERE player_id = %s and item_id = %s",
                                (player_id, item_id,),
                                commit=True)
            return {'Success':'Instance successfully deleted.', 'status': 200}
        except Error as err:
                print(f"Error deleting item: {err}")
                return {'error': 'Could not delete instance', 'status': 500}

    @DatabaseManager.requires_connection  
    def search_link(self, player_tag):
        try:
            if len(player_tag.strip()) == 0:
                raise ValueError

            pid = self.execute_query(f"SELECT player_id FROM playerBase WHERE player_tag = %s",
                                        (player_tag,),
                                        fetchone=True)
            if pid is None:
                raise Error
            
            # print(pid)
            items = self.execute_query(f"SELECT item_id, quantity FROM {self.table_name} WHERE player_id = %s",
                                        (pid['player_id'],),
                                        fetchall=True)
            # print(items)
            x = []
            for i in items:
                # print(i)
                item_name = self.execute_query(f"SELECT item_name FROM itemBase WHERE item_id = %s",
                                    (i['item_id'],),
                                    fetchone=True)
                # print(item_name)
                x.append({'player_id':pid['player_id'],'item_id': i['item_id'],'item_name': item_name['item_name'], 'item_qty': i['quantity']})

            return x
        except Error as err:
            print(f"Error searching item: {err}")
            return {'error': 'Could not search instance', 'status': 500}
        
        except ValueError as err:
            print(f"Error searching item: {err}")
            return {'error': 'Could not search instance', 'status': 404}