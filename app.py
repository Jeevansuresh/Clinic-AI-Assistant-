from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from ollama_client import ask_mistral, classify_message

app = Flask(__name__)

@app.route("/", methods=["POST"])
def bot():
    user_msg = request.values.get("Body", "").strip()
    response = MessagingResponse()
    
    category = classify_message(user_msg)

    if category == "booking_appointment":
        response.message("Sure! Booking appointment.")
    elif category == "general_query":
        reply = ask_mistral(user_msg)
        response.message(reply)
    else:
        response.message("Sorry, I didn't understand. Please try again.")
    
    return str(response)

if __name__ == "__main__":
    app.run(debug=True)
