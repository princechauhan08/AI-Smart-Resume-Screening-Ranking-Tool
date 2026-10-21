
from flask import Flask, render_template, request, jsonify

from resume_parser import (
    extract_text,
    extract_name,
    extract_email,
    extract_phone,
    extract_skills
)

from ranking import (
    calculate_score,
    matching_skills,
    missing_skills
)



from database import insert_candidate, get_candidates
from genai import analyze_resume


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/screen-resumes", methods=["POST"])
def screen_resumes():
    try:
        job_description = request.form.get(
            "job_description", ""
        ).strip()

        uploaded_files = request.files.getlist("resumes")

        if not job_description:
            return jsonify({
                "error": "Please enter a job description."
            }), 400

        uploaded_files = [
            file for file in uploaded_files if file.filename
        ]

        if not uploaded_files:
            return jsonify({
                "error": "Please upload at least one resume."
            }), 400

        results = []

        for uploaded_file in uploaded_files:
            try:
                # Use the existing resume parser
                resume_text = extract_text(uploaded_file)

                name = extract_name(resume_text)
                email = extract_email(resume_text)
                phone = extract_phone(resume_text)
                skills = extract_skills(resume_text)

                # Existing ATS scoring logic
                score = calculate_score(
                    skills, job_description
                )

                matched = matching_skills(
                    skills, job_description
                )

                missing = missing_skills(
                    skills, job_description
                )

                # Existing database logic
                insert_candidate(
                    name,
                    email,
                    phone,
                    ", ".join(skills),
                    score
                )

                # Existing Groq AI logic
                analysis = analyze_resume(
                    resume_text,
                    job_description
                )

                # Prepare result for the frontend
                results.append({
                    "candidate_name": name,
                    "email": email,
                    "phone": phone,
                    "skills": skills,
                    "match_score": score,
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "summary": str(analysis)
                })

            except Exception as error:
                results.append({
                    "candidate_name": uploaded_file.filename,
                    "error": str(error)
                })

        # Highest ATS score first
        results.sort(
            key=lambda candidate: (
                candidate.get("match_score", -1)
                if isinstance(
                    candidate.get("match_score", -1),
                    (int, float)
                )
                else -1
            ),
            reverse=True
        )

        # Existing database ranking
        candidates = get_candidates()

        ranking = []

        for candidate in candidates or []:
            ranking.append({
                "candidate_name": candidate[1],
                "email": candidate[2],
                "phone": candidate[3],
                "skills": candidate[4],
                "match_score": candidate[5]
            })

        return jsonify({
            "results": results,
            "ranking": ranking
        })

    except Exception as error:
        app.logger.exception("Resume screening failed")

        return jsonify({
            "error": str(error)
        }), 500



import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )

