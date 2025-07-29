import subprocess
from config import SYSTEM_PROMPT

def ask_mistral(user_input):
    prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_input}\nAssistant:"
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral", prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        # Uncomment for debugging
        # print("Ollama stdout:", result.stdout)
        # print("Ollama stderr:", result.stderr)

        if result.returncode != 0:
            return "⚠️ LLM error. Please try again."
        return result.stdout.strip()
    except Exception as e:
        return f"⚠️ Internal error: {str(e)}"

def classify_message(msg):
    prompt = f"""Classify the following WhatsApp message into one of the categories: 
1. booking_appointment 
2. general_query

Reply only with the category name.

Message: "{msg}"
Category:"""
    try:
        result = subprocess.run(
            ["ollama", "run", "mistral", prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        # Uncomment for debugging
        # print("Classifier stdout:", result.stdout)
        # print("Classifier stderr:", result.stderr)

        if result.returncode != 0:
            return "error"
        return result.stdout.strip().lower()
    except Exception as e:
        return "error"
