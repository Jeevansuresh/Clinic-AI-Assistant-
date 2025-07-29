users = {
    "dr.ram": {"password": "doctor123", "name": "Dr. Ram"},
    "dr.shyam": {"password": "doctor123", "name": "Dr. Shyam"}
}

def authenticate(username, password):
    return username in users and users[username]["password"] == password

def get_doctor_name(username):
    return users[username]["name"]

