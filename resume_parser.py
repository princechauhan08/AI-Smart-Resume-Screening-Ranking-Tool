import pdfplumber
import re

# Extract complete text from PDF
def extract_text(pdf_file):
    text = ""

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text


# Extract Email
def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)

    if match:
        return match.group(0)

    return "Not Found"


# Extract Phone Number
def extract_phone(text):
    match = re.search(r'(\+91[- ]?)?[6-9]\d{9}', text)

    if match:
        return match.group(0)

    return "Not Found"


# Extract Candidate Name
def extract_name(text):
    lines = text.split("\n")

    for line in lines:
        line = line.strip()

        if (
            len(line) > 2
            and "@" not in line
            and not any(char.isdigit() for char in line)
        ):
            return line

    return "Unknown"


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


# Extract Skills
def extract_skills(text):

    found_skills = []

    text = text.lower()

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found_skills.append(skill)

    return sorted(list(set(found_skills)))