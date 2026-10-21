import sqlite3

# Create database
conn = sqlite3.connect("resume.db", check_same_thread=False)
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS candidates(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    skills TEXT,
    score REAL
)
""")

conn.commit()


# Insert or Update Candidate
def insert_candidate(name, email, phone, skills, score):

    cursor.execute(
        "SELECT id FROM candidates WHERE email=?",
        (email,)
    )

    existing = cursor.fetchone()

    if existing:

        cursor.execute("""
        UPDATE candidates
        SET name=?, phone=?, skills=?, score=?
        WHERE email=?
        """, (name, phone, skills, score, email))

    else:

        cursor.execute("""
        INSERT INTO candidates(name,email,phone,skills,score)
        VALUES(?,?,?,?,?)
        """, (name, email, phone, skills, score))

    conn.commit()


# Get Ranked Candidates
def get_candidates():

    cursor.execute("""
    SELECT *
    FROM candidates
    ORDER BY score DESC, id DESC
    """)

    return cursor.fetchall()