from DatabaseManager import DatabaseManager
from mysql.connector import Error

class PlayerDBManager(DatabaseManager):
    table_name = "playerBase"
    @DatabaseManager.requires_connection
    def create_player_table(self):
        # Create the table of players
        create_table_query =  f"""
                            CREATE TABLE IF NOT EXISTS {self.table_name} (
                            player_id INT AUTO_INCREMENT PRIMARY KEY,
                            player_tag VARCHAR(255) UNIQUE
                            );
                            """
        return self.create_table(create_table_query, self.table_name)
    
    @DatabaseManager.requires_connection
    def create_player(self, player_tag):
        try:
            if not player_tag:
                return {'error':'Missing Player Tag in request data', 'status': 400}
            
            if not self.is_unique(player_tag):
                return {'error': 'Player tag already exists', 'status': 409}
            
            self.execute_query(f"insert into {self.table_name} (player_tag) values (%s)", 
                                (player_tag,), 
                                commit=True
                                )
            
            return {'player_id':self.cursor.lastrowid, 
                    'player_tag': player_tag}
        
        except Error as err:
            print(f"Error creating player: {err}")
            return {'error': 'Could not create player', 'status': 500}
    
    @DatabaseManager.requires_connection
    def list_players(self):
        try:
            fetched_players = self.execute_query(f"SELECT player_id, player_tag from {self.table_name}", 
                                                    fetchall=True
                                                    )
            return fetched_players
        except Error as err:
            print(f"Error fetching players: {err}")
            return False
        
    def is_unique(self, player_tag):
        try:
            fetch = self.execute_query(f"SELECT player_tag from {self.table_name} where player_tag = %s", 
                                        (player_tag,), 
                                        fetchone=True
                                        )
            return fetch is None
        
            return {''}
        except Error as err:
            print(f"Error checking player tag uniqueness: {err}")
            return False
        
    @DatabaseManager.requires_connection
    def delete_player(self, player_id):
        try:
            self.execute_query(f"DELETE FROM {self.table_name} WHERE player_id = %s", 
                                (player_id,), 
                                commit=True
                                )
            return {'Success':'Player successfully deleted.', 'status': 200}
        except Error as err:
            print(f"Error deleting player: {err}")
            return {'error': 'Could not delete player', 'status': 500}
    
    @DatabaseManager.requires_connection
    def edit_player(self, edited_player_data, player_id):
        try:
            clauses = []
            values = []

            if 'player_tag' in edited_player_data:
                clauses.append("player_tag = %s")
                values.append(edited_player_data['player_tag'])
            
            values.append(player_id)

            self.execute_query(f"UPDATE {self.table_name} SET {', '.join(clauses)} WHERE player_id = %s",
                                tuple(values),
                                commit=True
                                )
            
            updated_player = self.execute_query(f"SELECT * FROM {self.table_name} wHERE player_id = %s", 
                                                (player_id,),
                                                fetchone=True)
            
            return updated_player
        
        except Error as err:
            print(f"Error editing item: {err}")
            return {'error': 'Could not edit item', 'status': 500}
        
        except ValueError as ve:
            print(f"Error editing item: {ve}")
            return {'error': 'Could not edit item', 'status': 500}
