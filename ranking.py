import re

# Master Skill List
SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Bootstrap",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Express",
    "Express.js",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "MongoDB",
    "Git",
    "GitHub",
    "REST API",
    "FastAPI",
    "Flask",
    "Django",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Generative AI",
    "LLM",
    "LangChain",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Linux",
    "Streamlit"
]

# Extract required skills from Job Description
def get_required_skills(job_description):

    required = []

    jd = job_description.lower()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, jd):
            required.append(skill)

    return sorted(list(set(required)))


# Matching Skills
def matching_skills(candidate_skills, job_description):

    required = get_required_skills(job_description)

    return sorted(list(set(candidate_skills) & set(required)))


# Missing Skills
def missing_skills(candidate_skills, job_description):

    required = get_required_skills(job_description)

    return sorted(list(set(required) - set(candidate_skills)))


# ATS Score
def calculate_score(candidate_skills, job_description):

    required = get_required_skills(job_description)

    if len(required) == 0:
        return 0

    matched = matching_skills(candidate_skills, job_description)

    score = (len(matched) / len(required)) * 100

    return round(score, 2)