# 📄 AI Smart Resume Screening and Candidate Ranking Tool

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-Web%20App-black?logo=flask)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-yellow)

An AI-powered **Resume Screening and Candidate Ranking Tool** built with Python, Flask, Groq LLM, NLP, and SQLite. The application helps recruiters analyze PDF resumes, extract candidate information, calculate ATS scores, identify matching and missing skills, generate AI-powered insights, and rank candidates according to their suitability for a job description.

## 🌐 Live Demo

🚀 **Live Website:** [Click Here to Open the Application](https://your-live-app-url.onrender.com)

> Replace the placeholder URL with your actual deployed website URL after deployment.

## 📂 GitHub Repository

💻 **Source Code:** [View Project on GitHub](https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY-NAME)

## 🚀 Features

- 📄 Upload and analyze multiple PDF resumes.
- 👤 Extract candidate names, email addresses, and phone numbers.
- 🛠 Automatically identify technical skills using NLP and text processing.
- 🎯 Calculate ATS scores based on job description requirements.
- ✅ Identify matching skills.
- ❌ Highlight missing skills.
- 🤖 Generate AI-powered resume analysis using the Groq API.
- 💪 Display candidate strengths and weaknesses.
- ❓ Generate relevant interview questions.
- 📋 Provide AI-generated hiring recommendations.
- 🏆 Rank candidates according to their ATS scores.
- 💾 Store candidate information using SQLite.
- 🌐 Access the application through a web-based interface.

## 🛠 Tech Stack

- **Programming Language:** Python
- **Web Framework:** Flask
- **Frontend:** HTML, CSS, JavaScript
- **AI/LLM:** Groq API — Llama 3.3 70B Versatile
- **Database:** SQLite
- **PDF Processing:** pdfplumber
- **Text Processing:** Regular Expressions (Regex)
- **Environment Management:** python-dotenv
- **Version Control:** Git and GitHub
- **Deployment:** Render (planned)

## ⚙️ Project Workflow

```text
Upload Multiple PDF Resumes
           |
           v
Extract Resume Text
           |
           v
Extract Candidate Details
(Name, Email, Phone, Skills)
           |
           v
Compare Skills with Job Description
           |
           v
Calculate ATS Score
           |
           v
Generate AI Resume Analysis
           |
           v
Store Candidate Information
           |
           v
Rank Candidates
           |
           v
Display Results on Web Interface
```

## 📂 Project Structure

```text
AI-Smart-Resume-Screening-Groq-main/
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
├── web_app.py
├── app.py
├── resume_parser.py
├── ranking.py
├── database.py
├── genai.py
├── requirements.txt
├── .gitignore
├── README.md
│
└── .env  # Local only; never upload
```

*The structure above is illustrative. Keep the actual files and folders present in your project.*

## ⚡ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOSITORY-NAME.git
```

```bash
cd YOUR-REPOSITORY-NAME
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder with your own Groq API key.

**Security:** Never commit `.env`, API keys, or other secret credentials to GitHub.

### 5. Run the Application

Start the Flask web application using:

```bash
python web_app.py
```

Open the local URL displayed in your terminal, commonly:

```text
http://127.0.0.1:5000
```

> This project uses `web_app.py` to start the Flask application. It is not launched using `streamlit run app.py`.

## 🤖 AI Resume Analysis

The AI-powered analysis can include:

- Resume Summary
- Candidate Strengths
- Candidate Weaknesses
- Interview Questions
- Hiring Recommendation with Reason

The final output depends on the analysis prompt implemented in the application.

## 🎯 ATS Scoring and Candidate Ranking

The system compares extracted candidate skills with the skills identified from the job description.

It provides:

- 📊 ATS Percentage Score
- ✅ Matching Skills
- ❌ Missing Skills
- 🏆 Candidate Ranking

**Note:** ATS scores are estimates based on the application's scoring logic and extracted information. They do not guarantee a candidate's suitability or hiring outcome.

## 💾 Database

The application uses SQLite to store candidate information.

The database schema includes:

| Field | Description |
|---|---|
| ID | Unique candidate identifier |
| Name | Candidate name |
| Email | Candidate email address |
| Phone | Candidate phone number |
| Skills | Extracted skills |
| Score | Calculated ATS score |

The local database file is named `resume.db`. For production deployment, configure persistent storage or a suitable hosted database if candidate records must survive server restarts or redeployments.

## 🔐 Security

- Store the Groq API key in environment variables.
- Exclude `.env` and virtual environment folders from Git.
- Never expose API credentials in frontend JavaScript.
- Avoid committing private candidate resumes or personal information.
- Configure persistent storage for production data when required.

## 🔮 Future Enhancements

- Resume keyword highlighting
- AI-based resume improvement suggestions
- DOCX resume support
- Recruiter dashboard
- User authentication and authorization
- Resume history tracking
- Cloud database integration
- Improved candidate comparison and reporting

## 👨‍💻 Author

**Prince Chauhan**

B.Tech — Computer Science and Engineering

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

*Built with Python, Flask, Groq AI, and SQLite.*
