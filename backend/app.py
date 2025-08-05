import os
import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Google Gemini API 설정
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/get_question', methods=['POST'])
def get_question():
    data = request.get_json()
    part = data.get('part', '5')
    level = data.get('level', 'medium')

    model = genai.GenerativeModel('gemini-2.5-pro')

    prompt = ''
    if part == '7':
        prompt = f"""
        You are a TOEIC question generator.
        Generate a TOEIC Part 7 passage (like an email, article, or advertisement) with a {level} difficulty level, followed by 2 to 4 questions based on the passage.
        Format the output as a single JSON object with two keys: "passage" and "questions".
        The "passage" key should contain the full text of the passage.
        The "questions" key should be an array of JSON objects, where each object represents a single question and has the following keys: "question", "options" (an object with A, B, C, D), "answer" (the correct letter), and "explanation" (in Korean).
        """
    else: # For Part 5 and 6
        prompt = f"""
        You are a TOEIC question generator.
        Generate a TOEIC Part {part} question with a {level} difficulty level.
        Provide the question, four options (A, B, C, D), the correct answer, and a brief explanation in Korean.
        Format the output as a JSON object with the following keys: "question", "options", "answer", "explanation".
        For Part 6, the "question" should be a passage with blanks.
        """

    try:
        response = model.generate_content(prompt)
        clean_response = response.text.strip().replace('```json', '').replace('```', '')
        return jsonify(eval(clean_response))
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return jsonify({"error": "Failed to generate question from API."}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
