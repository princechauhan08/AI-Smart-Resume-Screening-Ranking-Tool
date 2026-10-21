
/* =========================================
   RESUMEAI - FRONTEND JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const resumeInput = document.getElementById("resumeFiles");
    const fileList = document.getElementById("fileList");
    const resumeCount = document.getElementById("resumeCount");
    const uploadArea = document.getElementById("uploadArea");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const jobDescription = document.getElementById("jobDescription");

    const loading = document.getElementById("loading");
    const messageBox = document.getElementById("messageBox");
    const resultsContainer = document.getElementById("resultsContainer");

    let selectedFiles = [];

    const allowedExtensions = ["pdf", "docx", "doc", "txt"];

    /* FILE SIZE FORMAT */

    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    /* SHOW MESSAGE */

    function showMessage(message, type = "error") {
        messageBox.textContent = message;
        messageBox.className = "message-box " + type;
        messageBox.hidden = false;
    }

    function clearMessage() {
        messageBox.textContent = "";
        messageBox.hidden = true;
        messageBox.className = "message-box";
    }

    /* CHECK FILE TYPE */

    function isAllowedFile(file) {
        const extension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(extension);
    }

    /* ADD SELECTED FILES */

    function addFiles(files) {
        clearMessage();

        let rejectedFiles = [];

        Array.from(files).forEach((file) => {
            if (!isAllowedFile(file)) {
                rejectedFiles.push(file.name);
                return;
            }

            const alreadySelected = selectedFiles.some(
                (existingFile) =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );

            if (!alreadySelected) {
                selectedFiles.push(file);
            }
        });

        renderFileList();

        if (rejectedFiles.length > 0) {
            showMessage(
                "Unsupported file type: " + rejectedFiles.join(", "),
                "error"
            );
        }
    }

    /* DISPLAY FILE LIST */

    function renderFileList() {
        fileList.replaceChildren();
        resumeCount.textContent = selectedFiles.length;

        if (selectedFiles.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-files";
            emptyMessage.textContent = "No resumes selected yet.";
            fileList.appendChild(emptyMessage);
            return;
        }

        selectedFiles.forEach((file, index) => {
            const item = document.createElement("div");
            item.className = "file-item";

            const details = document.createElement("div");
            details.style.minWidth = "0";

            const name = document.createElement("span");
            name.className = "file-name";
            name.textContent = file.name;

            const size = document.createElement("span");
            size.className = "file-size";
            size.textContent = formatFileSize(file.size);

            name.appendChild(size);
            details.appendChild(name);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-file";
            removeButton.textContent = "×";
            removeButton.title = "Remove " + file.name;
            removeButton.setAttribute(
                "aria-label",
                "Remove " + file.name
            );

            removeButton.addEventListener("click", () => {
                selectedFiles.splice(index, 1);
                renderFileList();
                clearMessage();
            });

            item.append(details, removeButton);
            fileList.appendChild(item);
        });
    }

    /* FILE INPUT */

    resumeInput.addEventListener("change", (event) => {
        addFiles(event.target.files);

        // Allow the same file to be selected again after removal.
        resumeInput.value = "";
    });

    /* DRAG AND DROP */

    uploadArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadArea.classList.add("drag-over");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
    });

    uploadArea.addEventListener("drop", (event) => {
        event.preventDefault();
        uploadArea.classList.remove("drag-over");

        if (event.dataTransfer) {
            addFiles(event.dataTransfer.files);
        }
    });

    /* SAFE TEXT DISPLAY */

    function addTextElement(parent, tagName, text, className = "") {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        element.textContent = text == null ? "" : String(text);
        parent.appendChild(element);

        return element;
    }

    /* DISPLAY SKILLS */

    function renderSkills(parent, title, skills) {
        if (!Array.isArray(skills) || skills.length === 0) {
            return;
        }

        const section = document.createElement("div");
        section.style.marginTop = "12px";

        addTextElement(section, "strong", title);

        const tags = document.createElement("div");
        tags.className = "skill-list";

        skills.forEach((skill) => {
            const tag = document.createElement("span");
            tag.className = "skill-tag";
            tag.textContent = String(skill);
            tags.appendChild(tag);
        });

        section.appendChild(tags);
        parent.appendChild(section);
    }


/* FORMAT AI ANALYSIS INTO SECTIONS */

function renderAnalysis(parent, analysis) {
    if (!analysis) return;

    const container = document.createElement("div");
    container.className = "ai-analysis";

    const text = String(analysis)
        .replace(/\r\n/g, "\n")
        .replace(/\*\*/g, "**");

    const sectionPattern =
        /\*\*(?:\d+\.\s*)?(Resume Summary|Candidate Strengths|Candidate Weaknesses|Interview Questions|Hiring Recommendation)\*\*/gi;

    const matches = [...text.matchAll(sectionPattern)];

    if (matches.length === 0) {
        const paragraph = document.createElement("p");
        paragraph.className = "analysis-paragraph";
        paragraph.textContent = text;
        container.appendChild(paragraph);
        parent.appendChild(container);
        return;
    }

    const intro = text.slice(0, matches[0].index).trim();

    if (intro) {
        const paragraph = document.createElement("p");
        paragraph.className = "analysis-paragraph";
        paragraph.textContent = intro.replace(/\*\*/g, "");
        container.appendChild(paragraph);
    }

    matches.forEach((match, index) => {
        const sectionTitle = match[1];
        const start = match.index + match[0].length;
        const end = index + 1 < matches.length
            ? matches[index + 1].index
            : text.length;

        let content = text.slice(start, end).trim();

        // Remove unnecessary Markdown formatting.
        content = content.replace(/\*\*/g, "").trim();

        const section = document.createElement("section");
        section.className = "analysis-section";

        const heading = document.createElement("h4");
        heading.className = "analysis-heading";
        heading.textContent = sectionTitle;

        section.appendChild(heading);

        const lines = content
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

        let list = null;
        let listType = null;

        lines.forEach(line => {
            const numbered = line.match(/^\d+[.)]\s+(.+)/);
            const bulleted = line.match(/^[-•]\s+(.+)/);

            if (numbered || bulleted) {
                const currentType = numbered ? "ol" : "ul";

                if (listType !== currentType) {
                    list = document.createElement(currentType);
                    list.className = "analysis-list";
                    section.appendChild(list);
                    listType = currentType;
                }

                const item = document.createElement("li");
                item.textContent = (numbered || bulleted)[1].trim();
                list.appendChild(item);
            } else {
                list = null;
                listType = null;

                const paragraph = document.createElement("p");
                paragraph.className = "analysis-paragraph";
                paragraph.textContent = line;
                section.appendChild(paragraph);
            }
        });

        container.appendChild(section);
    });

    parent.appendChild(container);
}


    /* DISPLAY ONE CANDIDATE */

    function renderCandidate(candidate, index) {
        const card = document.createElement("article");
        card.className = "candidate-card";

        const top = document.createElement("div");
        top.className = "candidate-top";

        const heading = document.createElement("div");

        const candidateName =
            candidate.candidate_name ||
            candidate.name ||
            candidate.filename ||
            candidate.resume_name ||
            "Candidate " + (index + 1);

        addTextElement(heading, "h3", candidateName);

        const recommendation =
            candidate.recommendation || "Not specified";

        addTextElement(
            heading,
            "span",
            recommendation,
            "recommendation"
        );

        const rawScore =
            candidate.match_score ??
            candidate.score ??
            candidate.similarity_score;

        const scoreElement = document.createElement("div");
        scoreElement.className = "candidate-score";

        if (rawScore !== undefined && rawScore !== null) {
            const numericScore = Number(rawScore);

            scoreElement.textContent = Number.isFinite(numericScore)
                ? numericScore + "%"
                : String(rawScore);
        } else {
            scoreElement.textContent = "N/A";
        }

        top.append(heading, scoreElement);
        card.appendChild(top);

        const details = document.createElement("div");
        details.className = "candidate-details";

        if (candidate.experience !== undefined) {
            addTextElement(
                details,
                "p",
                "Experience: " + candidate.experience
            );
        }

      if (candidate.summary) {
    renderAnalysis(details, candidate.summary);
}

        renderSkills(
            details,
            "Matched Skills",
            candidate.matched_skills
        );

        renderSkills(
            details,
            "Missing Skills",
            candidate.missing_skills
        );

        renderSkills(
            details,
            "Projects",
            candidate.projects
        );

        card.appendChild(details);

        return card;
    }

    /* DISPLAY API RESULTS */

    function renderResults(data) {
        resultsContainer.replaceChildren();

        // Support common response formats.
        let candidates = [];

        if (Array.isArray(data)) {
            candidates = data;
        } else if (data && Array.isArray(data.results)) {
            candidates = data.results;
        } else if (data && Array.isArray(data.candidates)) {
            candidates = data.candidates;
        } else if (data && Array.isArray(data.rankings)) {
            candidates = data.rankings;
        } else if (data && Array.isArray(data.screening_results)) {
            candidates = data.screening_results;
        } else if (data && typeof data === "object") {
            if (
                data.candidate_name ||
                data.match_score !== undefined ||
                data.recommendation
            ) {
                candidates = [data];
            }
        }

        if (candidates.length === 0) {
            showMessage(
                "The server responded, but no candidate results were found. The backend response format may need to be connected.",
                "error"
            );

            const pre = document.createElement("pre");
            pre.style.whiteSpace = "pre-wrap";
            pre.style.overflowWrap = "anywhere";
            pre.style.fontSize = "12px";
            pre.style.marginTop = "12px";
            pre.textContent = JSON.stringify(data, null, 2);

            resultsContainer.appendChild(pre);
            return;
        }

        candidates.forEach((candidate, index) => {
            resultsContainer.appendChild(
                renderCandidate(candidate, index)
            );
        });

        showMessage(
            "Analysis completed. Processed " +
                candidates.length +
                " candidate result(s).",
            "success"
        );
    }

    /* ANALYZE RESUMES */

    analyzeBtn.addEventListener("click", async () => {
        clearMessage();

        const description = jobDescription.value.trim();

        if (!description) {
            showMessage("Please enter a job description.");
            jobDescription.focus();
            return;
        }

        if (selectedFiles.length === 0) {
            showMessage("Please upload at least one resume.");
            return;
        }

        const formData = new FormData();
        formData.append("job_description", description);

        selectedFiles.forEach((file) => {
            formData.append("resumes", file);
        });

        loading.hidden = false;
        resultsContainer.replaceChildren();
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing resumes...";

        try {
            // This endpoint will be provided by the Python web backend.
            const response = await fetch("/screen-resumes", {
                method: "POST",
                body: formData
            });

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error(
                    "The server did not return JSON. Check that the Python backend and /screen-resumes route are running."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.error ||
                    data.message ||
                    "Resume screening failed. Please check the backend."
                );
            }

            renderResults(data);

            document.getElementById("results").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } catch (error) {
            showMessage(
                error.message ||
                "Unable to connect to the backend. Please check that the Python server is running.",
                "error"
            );
        } finally {
            loading.hidden = true;
            analyzeBtn.disabled = false;

            analyzeBtn.replaceChildren();

            const icon = document.createElement("span");
            icon.textContent = "✦";

            const label = document.createElement("span");
            label.textContent = "Analyze Resumes";

            const arrow = document.createElement("span");
            arrow.textContent = "→";

            analyzeBtn.append(icon, label, arrow);
        }
    });

    /* INITIALIZE */

    renderFileList();

    console.log("ResumeAI frontend initialized successfully.");
});