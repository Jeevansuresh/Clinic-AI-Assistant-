import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Skyno@1978",  # your DB password
        database="clinic_db"
    )
