import streamlit as st

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

from database import (
    insert_candidate,
    get_candidates
)

from genai import analyze_resume


st.set_page_config(
    page_title="AI Resume Screening",
    page_icon="📄",
    layout="wide"
)


st.title("📄 AI Smart Resume Screening and Candidate Ranking Tool")

st.write(
    "Upload resumes and compare candidates using ATS Score and Groq AI Resume Analysis."
)


uploaded_files = st.file_uploader(
    "Upload Resume(s) PDF",
    type=["pdf"],
    accept_multiple_files=True
)


job_description = st.text_area(
    "Enter Job Description",
    height=200,
    placeholder="Enter required skills and job details..."
)


if uploaded_files and job_description:

    progress = st.progress(0)

    total_files = len(uploaded_files)

    for index, uploaded_file in enumerate(uploaded_files):

        progress.progress((index + 1) / total_files)

        st.markdown("---")

        st.header(f"📄 Candidate {index + 1}")

        try:

            resume_text = extract_text(uploaded_file)

            name = extract_name(resume_text)

            email = extract_email(resume_text)

            phone = extract_phone(resume_text)

            skills = extract_skills(resume_text)


            score = calculate_score(
                skills,
                job_description
            )


            matched = matching_skills(
                skills,
                job_description
            )


            missing = missing_skills(
                skills,
                job_description
            )


            insert_candidate(
                name,
                email,
                phone,
                ", ".join(skills),
                score
            )


            st.success(
                f"✅ {name}'s resume processed successfully"
            )


            st.subheader("👤 Candidate Information")

            st.write("**Name:**", name)

            st.write("**Email:**", email)

            st.write("**Phone:**", phone)


            st.subheader("🛠 Skills Found")

            if skills:
                st.write(", ".join(skills))
            else:
                st.warning("No skills found")


            st.subheader("✅ Matching Skills")

            if matched:
                st.success(", ".join(matched))
            else:
                st.warning("No matching skills")


            st.subheader("❌ Missing Skills")

            if missing:
                st.error(", ".join(missing))
            else:
                st.success("No missing skills")


            st.subheader("🎯 ATS Score")

            st.progress(score / 100)

            st.write(
                f"### {score}%"
            )


            st.subheader("🤖 Groq AI Resume Analysis")


            with st.spinner(
                "Generating AI analysis..."
            ):

                analysis = analyze_resume(
                    resume_text,
                    job_description
                )


            st.write(analysis)


        except Exception as e:

            st.error(
                f"Error processing resume: {e}"
            )


    progress.empty()

    st.success(
        "🎉 All resumes processed successfully!"
    )



st.markdown("---")

st.header("🏆 Candidate Ranking")


candidates = get_candidates()


if candidates:

    rank = 1

    for candidate in candidates:


        if rank == 1:
            medal = "🥇"

        elif rank == 2:
            medal = "🥈"

        elif rank == 3:
            medal = "🥉"

        else:
            medal = "🏅"


        st.markdown(
            f"""
## {medal} Rank #{rank}

**Name:** {candidate[1]}

**Email:** {candidate[2]}

**Phone:** {candidate[3]}

**Skills:** {candidate[4]}

**ATS Score:** {candidate[5]} %

---
"""
        )

        rank += 1


else:

    st.info(
        "No candidates available yet."
    )