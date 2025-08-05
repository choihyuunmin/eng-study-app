# AI TOEIC Master

Google Gemini API를 활용한 AI 토익 문제 생성기입니다.
Toeic reading part 5, 6, 7의 문제를 생성해줍ㄴ디ㅏ.

### 주요 기능
- **Part 5**: 문법 문제 생성
- **Part 6**: 문단 완성 문제 생성  
- **Part 7**: 독해 문제 생성 (지문 + 다중 문제)
- **난이도 조절**: Easy, Medium, Hard 레벨 선택 가능
- **실시간 채점**: 답안 제출 후 즉시 정답 확인 및 해설 제공
- **한국어 해설**: 모든 문제에 대한 상세한 한국어 해설 제공

## 프로젝트 구조

```
eng-study-app/
├── README.md
├── requirements.txt
├── backend/
│   └── app.py         
└── frontend/
    ├── index.html
    └── static/
        ├── css/
        │   └── style.css
        └── js/
            └── script.js
```

## Install

### 1. 저장소 클론
```bash
git clone https://github.com/choihyuunmin/eng-study-app.git
cd eng-study-app
```

### 2. 가상환경 설정 (권장)
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. 의존성 설치
```bash
pip install -r requirements.txt
```

### 4. 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 Google Gemini API 키를 설정하세요:

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 5. 백엔드 서버 실행
```bash
cd backend
python app.py
netstat -anp | grep 5000
```

### 6. 프론트엔드 실행
frontend/index.html 파일 실행

## Google API 설정

### Gemini API 키 발급
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. 새 API 키 생성
3. `.env` 파일에 API 키 추가

### API 사용량 주의사항
- Gemini API는 사용량에 따라 요금이 부과될 수 있습니다
- 개발 시에는 무료 할당량을 확인하여 사용하세요
- API 키는 반드시 안전하게 보관하고 공개 저장소에 커밋하지 마세요