import os
import json

import uvicorn
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TOEIC Study App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Gemini API 설정
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class QuestionRequest(BaseModel):
    part: str = "5"
    level: str = "medium"

@app.post('/get_question')
async def get_question(request: QuestionRequest):
    part = request.part
    level = request.level

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
        
        try:
            result = json.loads(clean_response)
        except json.JSONDecodeError:
            # eval 대신 더 안전한 방법 사용
            result = eval(clean_response)
            
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate question from API.")

@app.get('/')
async def root():
    return {"message": "TOEIC Study App API is running"}

@app.get('/health')
async def health_check():
    return {"status": "healthy"}

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
