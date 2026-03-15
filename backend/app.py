from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import bcrypt 
import jwt
import datetime
import random

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "supersecretkey"
#-----------CREATE DATABASE FUNCTION-------
def get_database_connection():
    conn = sqlite3.connect("data.db")
    conn.row_factory = sqlite3.Row
    return conn

#VERIFY TOKEN
def verify_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(
            token,
            app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )
        return decoded["user_id"]
    except:
        return None
    
    
#----CREATE UPI_ID FUNCTION
def generate_upi(username):
    random_number = random.randint(100, 999)
    return f"{username}{random_number}@mybank"

#------HOME-------
@app.route("/")
def home():
    return "Backend is running"


#-------INIT------
@app.route("/init")
def init():
    conn = get_database_connection()
    conn.execute("""CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT, upi_id TEXT UNIQUE, wallet_balance REAL, pin TEXT, status TEXT)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER, receiver_id INTEGER, type TEXT, amount REAL, status TEXT, timestamp DATETIME)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS requests(id INTEGER PRIMARY KEY AUTOINCREMENT, requester_id INTEGER, requested_from INTEGER, amount REAL, status TEXT, timestamp DATETIME)""")
    conn.commit()
    conn.close()
    return jsonify({"message":"Table initiliaze"})
    

#-------REGISTER-------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    password_hashed = bcrypt.hashpw(password_bytes, salt).decode("utf-8")
    upi_id = generate_upi(username)
    conn = get_database_connection()
    conn.execute("INSERT INTO users(username, email, password, upi_id, pin, wallet_balance) VALUES (?, ?, ?, ?, ?, ?)",(username, email, password_hashed, upi_id, "ok", 10000))
    conn.commit()
    conn.close()
    return jsonify({"message":"User register"})


#-----LOGIN-----
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    conn  = get_database_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username, )).fetchone()
    if user is None:
        return jsonify({"message":"User not found"})
    
    password_bytes = password.encode("utf-8")
    if not bcrypt.checkpw(password_bytes, user["password"].encode("utf-8")):
        return jsonify({"message":"Incorrect password"})
    token = jwt.encode(
        {
        "user_id": user["id"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes = 30)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
                       )
    conn.close()
    return jsonify({"token":token})


#-----DASHBOARD-------
@app.route("/dashboard", methods=["GET"])
def dashboard():
    user_id = verify_token()
    if not user_id:
        return jsonify({"error":"Unathorized"}), 401
    conn = get_database_connection()
    data = conn.execute("SELECT username, upi_id FROM users WHERE id = ?",(user_id,)).fetchall()
    conn.close()
    result = []
    for d in data:
        result.append({
            "username":d["username"],
            "upi_id":d["upi_id"]})
    return jsonify({"result":result})
#-----SEND MONEY-----
@app.route("/send", methods=["POST"])
def send():
    user_id = verify_token()
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    data = request.json
    upi_id = data.get("upi_id")
    amount = float(data.get("amount"))
    pin = data.get("pin")
    conn = get_database_connection()
    sender = conn.execute("SELECT * FROM users WHERE id = ?", (user_id, )).fetchone()
    receiver = conn.execute("SELECT * FROM users WHERE upi_id = ?", (upi_id, )).fetchone()
    if sender is None or receiver is None:
        return jsonify({"message":"User not found"})
    if sender["id"] == receiver["id"]:
        return jsonify({"message": "Cannot send to yourself"})
    if pin != sender["pin"]:
        return jsonify({"message":"Incorrect pin"})
    if sender["wallet_balance"] < amount:
        return jsonify({"message":"Insuffficient balance"})
    new_sender_balance = sender["wallet_balance"] - amount
    new_receiver_balance = receiver["wallet_balance"] + amount
    conn.execute("UPDATE users SET wallet_balance = ? WHERE id = ?",(new_sender_balance, sender["id"])
    )

    conn.execute("UPDATE users SET wallet_balance = ? WHERE id = ?",(new_receiver_balance, receiver["id"])
    )
    conn.execute("""INSERT INTO transactions
(sender_id, receiver_id, type, amount, status, timestamp)
VALUES (?, ?, ?, ?, ?, ?)
""",
(sender["id"], receiver["id"], "send", amount, "success", datetime.datetime.now()))
    conn.commit()
    conn.close()
    return jsonify({"message":"Successful"})


#------HISTORY------

@app.route("/transactions", methods=["GET"])
def history():
    user_id = verify_token()
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    conn = get_database_connection()
    transactions = conn.execute("SELECT * FROM transactions WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp DESC",(user_id, user_id)).fetchall()
    conn.close()
    result = []
    for tx in transactions:
        result.append({
             "from": tx["sender_id"],
            "to": tx["receiver_id"],
            "amount": tx["amount"],
            "timestamp": tx["timestamp"]
        })
    return jsonify(result)


#-------REQUEST-----
@app.route("/request", methods=["POST"])
def request_money():
    user_id = verify_token()
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    data = request.json
    receiver_upi = data.get("upi_id")
    amount = data.get("amount")
    conn = get_database_connection()
    receiver = conn.execute("SELECT * FROM users WHERE upi_id = ?",(receiver_upi,)).fetchone()
    if receiver is None:
        return jsonify({"message":"User not found"})
    conn.execute("INSERT INTO requests(requester_id, requested_from, amount, status, timestamp) VALUES (?, ?, ?, ?, ?)",(user_id, receiver["id"], amount, "pending", datetime.datetime.now()))
    conn.commit()
    conn.close()
    return jsonify({"message":"Request sent"})


@app.route("/users")
def show_users():
    conn = get_database_connection()
    users = conn.execute("SELECT username, upi_id, wallet_balance, pin FROM users").fetchall()
    conn.close()
    result = []
    for user in users:
        result.append({
            "username": user["username"],
            "upi_id": user["upi_id"],
            "amount": user["wallet_balance"],
            "pin": user["pin"]
        })
    return jsonify(result)
if __name__ == "__main__":
    app.run(debug=True)

