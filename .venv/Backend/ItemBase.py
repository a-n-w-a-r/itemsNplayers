from DatabaseManager import DatabaseManager
from mysql.connector import Error

class ItemDBManager(DatabaseManager):
    table_name = "itemBase"
    @DatabaseManager.requires_connection
    def create_item_table(self):
        create_table_query =   f"""
                                CREATE TABLE IF NOT EXISTS {self.table_name} (
                                item_id INT AUTO_INCREMENT PRIMARY KEY,
                                item_name VARCHAR(255) UNIQUE,
                                item_qty INT DEFAULT 1
                                );
                                """
        return self.create_table(create_table_query, self.table_name)
    
    @DatabaseManager.requires_connection
    def create_item(self, item_name, item_qty):
        try:
            if not item_name:
                return {'error':'Missing item name in request data', 'status': 400}
            
            # if not self.is_unique(item_name):
            #     return {'error': 'Item name already exists', 'status': 409}
            
            self.execute_query(f"""INSERT INTO {self.table_name} (item_name, item_qty) values (%s, %s) AS NEW 
                                ON DUPLICATE KEY UPDATE item_qty = {self.table_name}.item_qty + new.item_qty
                                """,
                                (item_name, item_qty,),
                                commit=True
                                )
            return {'item_id':self.cursor.lastrowid,
                    'item_name':item_name,
                    'item_qty':item_qty
                    }
        except Error as err:
            print(f"Error creating item: {err}")
            return {'error': 'Could not create item', 'status': 500}
        
    def is_unique(self, item_name):
        try:
            fetch = self.execute_query(f"SELECT item_name from {self.table_name} where item_name = %s", 
                                        (item_name,), 
                                        fetchone=True
                                        )
            return fetch is None
        except Error as err:
            print(f"Error checking player tag uniqueness: {err}")
            return False

    @DatabaseManager.requires_connection
    def list_items(self):
        try:
            fetched_items = self.execute_query(f"SELECT item_id, item_name, item_qty FROM {self.table_name}",
                                                fetchall = True)
            return fetched_items
        except Error as err:
            print(f"Error fetching item: {err}")
            return {'error': 'Could not fetch item', 'status': 500}
        
    @DatabaseManager.requires_connection
    def delete_item(self, item_id):
        try:
            self.execute_query(f"DELETE FROM {self.table_name} WHERE item_id = %s",
                                (item_id,),
                                commit=True)
            return {'Success':'Item successfully deleted.', 'status': 200}
        except Error as err:
            print(f"Error deleting item: {err}")
            return {'error': 'Could not delete item', 'status': 500}
        
    def edit_item(self, edited_item_data, item_id):
        try:
            clauses = []
            values = []

            if 'item_name' in edited_item_data:
                clauses.append("item_name = %s")
                values.append(edited_item_data['item_name'])

            if 'item_qty' in edited_item_data:
                clauses.append("item_qty = %s")
                values.append(edited_item_data['item_qty'])

            values.append(item_id)
            
            self.execute_query(f"UPDATE {self.table_name} SET {', '.join(clauses)} WHERE item_id = %s",
                                tuple(values),
                                commit=True
                                )
            
            updated_item = self.execute_query(f"SELECT * FROM {self.table_name} wHERE item_id = %s", 
                                                (item_id,),
                                                fetchone=True)
            
            return updated_item

            # return {'success': 'item was successfully edited',
            #         'status': 200
            #         }
        
        except Error as err:
            print(f"Error editing item: {err}")
            return {'error': 'Could not edit item', 'status': 500}
        
        except ValueError as ve:
            print(f"Error editing item: {ve}")
            return {'error': 'Could not edit item', 'status': 500}
