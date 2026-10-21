import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_resume(resume_text, job_description):

    resume_text = resume_text[:3000]

    prompt = f"""
You are an experienced HR Recruiter.

Analyze the candidate resume based on the given job description.

Job Description:
{job_description}

Candidate Resume:
{resume_text}

Do NOT calculate:
- ATS Score
- Matching Skills
- Missing Skills

Provide only these sections:

1. Resume Summary
- Write 3-4 lines.

2. Candidate Strengths
- 5 bullet points.

3. Candidate Weaknesses
- 3 bullet points.

4. Interview Questions
- 5 questions based on the resume.

5. Hiring Recommendation
- Recommended or Not Recommended.
- Explain the reason in 3-4 lines.

Keep the answer short and professional.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=700
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"