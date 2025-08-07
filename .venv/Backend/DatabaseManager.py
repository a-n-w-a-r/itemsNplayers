import mysql.connector
from mysql.connector import Error

class DatabaseManager:

    def __init__(self, config):
        self.config = config
        self.connection = None
        self.cursor = None

    def connect(self):
        # Connect to the MySQL database
        try:
            self.connection = mysql.connector.connect(**self.config)

            if self.connection.is_connected():
                self.cursor = self.connection.cursor(buffered=True, dictionary=True)
                print(f"Connected to MySQL database:  {self.config['database']}")
                return True
        
        except Error as err:
            print(f"Error connecting to MySQL database: {err}")
        return False
    
    def disconnect(self):
        # Disconnect from the MySQL database
        if self.connection and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()
            print(f"Disconnected from MySQL database: {self.config['database']}")

    def check_connection(self, action_name: str):
        # Checks if the database is connected
        try:
            if not self.connection or not self.connection.is_connected():
                # Gets database name otherwise returns unknown
                db_name = self.config.get("database", "UnknownDB")
                print(f"Database not Connected: {db_name} not connected. Failed during {action_name}")
                return False
            return True
        except Error as err:
            print(f"Error checking connection: {err}")
            return False 
        
    def requires_connection(func):
        # Decorator to check connection
        def wrapper(self, *args, **kwargs):
            # Tracks which function the connection fails
            if not self.check_connection(action_name=func.__name__):
                return False
            return func(self, *args, **kwargs)
        return wrapper
    
    @requires_connection
    def create_table(self, create_query: str, table_name: str):
        # Creates SQL table if it doesn't exist
        try:
            # if not self.check_connection(table_name):
            #     return False
            # self.cursor.execute(create_query)
            # self.connection.commit()
            self.execute_query(create_query, commit=True)
            print(f"{table_name} table ensured to exist")
            return True
        except Error as err:
            print(f"Error creating table: {err}")
    
    def execute_query(self, query, params=None, fetchone=False, fetchall=False, commit=False):
        try:
            self.cursor.execute(query,params or ())
            
            if fetchone:
                return self.cursor.fetchone()
            if fetchall:
                return self.cursor.fetchall()
            if commit:
                self.connection.commit()
            
            return True
        except Error as err:
            print("Error:", err)
            raise err
