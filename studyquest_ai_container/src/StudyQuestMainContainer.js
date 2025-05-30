import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * StudyQuestMainContainer: Main container for StudyQuest AI.
 * Handles file upload, text extraction stub, MCQ generation stub, and quiz display with instant feedback.
 */
function StudyQuestMainContainer() {
  // STATES
  const [step, setStep] = useState("upload"); // 'upload' | 'processing' | 'quiz'
  const [file, setFile] = useState(null);
  const [processingMsg, setProcessingMsg] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({}); // { [qIdx]: selectedOptionIdx }
  const [feedback, setFeedback] = useState({}); // { [qIdx]: isCorrect }
  const [error, setError] = useState(null);

  // COLORS/THEME based on provided palette
  const theme = {
    background: "#050505",
    primary: "#F1F5F9",
    accent: "#F59E42",
    cardBg: "#171717",
    text: "#ffffff",
    textSecondary: "#b5b8c0",
    border: "rgba(241,245,249,0.11)",
    correct: "#22c55e",
    incorrect: "#ef4444",
  };

  // HANDLERS
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF or DOCX file to continue.");
      return;
    }

    // Step 1. BEGIN Processing...
    setProcessingMsg("Uploading and extracting text from your document...");
    setStep("processing");
    setError(null);

    // Step 2. Simulate Extraction
    const extractedText = await simulateExtraction(file);

    if (!extractedText) {
      setStep("upload");
      setError("Failed to extract text from your document.");
      return;
    }

    setProcessingMsg("Generating quiz questions from your content...");

    // Step 3. Simulate MCQ generation
    const generatedMcqs = await simulateMcqApi(extractedText);

    if (!generatedMcqs || generatedMcqs.length === 0) {
      setStep("upload");
      setError(
        "Unable to generate questions from your file. Please try another document."
      );
      return;
    }

    setMcqs(generatedMcqs);
    setQuizAnswers({});
    setFeedback({});
    setStep("quiz");

    // Reset
    setProcessingMsg("");
  };

  const handleAnswer = (qIdx, optIdx) => {
    // Only allow one answer per question (but can change)
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));

    // Give instant feedback
    const correctIdx = mcqs[qIdx].answerIdx;
    setFeedback((prev) => ({
      ...prev,
      [qIdx]: correctIdx === optIdx ? "correct" : "incorrect",
    }));
  };

  const handleRestart = () => {
    setFile(null);
    setStep("upload");
    setError(null);
    setMcqs([]);
    setQuizAnswers({});
    setFeedback({});
    setProcessingMsg("");
  };

  // Simulated API stubs—replace with real API calls in production
  async function simulateExtraction(file) {
    // Simulate file processing delay
    await wait(1800);
    // Return a sample text for demonstration
    return (
      "The process of photosynthesis involves conversion of sunlight into chemical energy by plants. " +
      "Newton's three laws of motion describe the relationship between a body and the forces acting on it. " +
      "Water boils at 100 degrees Celsius at standard atmospheric pressure."
    );
  }

  async function simulateMcqApi(text) {
    // Simulate API call delay
    await wait(1500);
    // Simulated MCQs—replace with LLM/NLP API output
    return [
      {
        question:
          "What is the main purpose of photosynthesis in plants?",
        options: [
          "To convert chemical energy into sunlight",
          "To convert sunlight into chemical energy",
          "To absorb oxygen from the air",
          "To produce carbon dioxide"
        ],
        answerIdx: 1
      },
      {
        question:
          "According to Newton's second law of motion, force is equal to:",
        options: [
          "Mass divided by acceleration",
          "Weight times velocity",
          "Mass times acceleration",
          "Acceleration divided by mass"
        ],
        answerIdx: 2
      },
      {
        question:
          "At what temperature does water boil at standard atmospheric pressure?",
        options: [
          "0 degrees Celsius",
          "50 degrees Celsius",
          "100 degrees Celsius",
          "212 degrees Celsius"
        ],
        answerIdx: 2
      }
    ];
  }

  function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // RENDER SECTIONS

  const renderUploadSection = () => (
    <form
      className="sqai-upload-box"
      onSubmit={handleUpload}
      style={{
        background: theme.cardBg,
        border: `1.8px dashed ${theme.accent}`,
        borderRadius: 14,
        padding: 36,
        margin: "42px auto 0",
        maxWidth: 420,
        boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
        color: theme.text,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 18 }}>
        Upload a Study File
      </div>
      <div style={{ color: theme.textSecondary, fontSize: "1rem", marginBottom: 18 }}>
        Supported: <b>PDF</b> or <b>DOCX</b> (max 10MB).
      </div>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        style={{
          marginBottom: 20,
          padding: "8px 0",
          color: "#fff"
        }}
      />
      {error && (
        <div style={{ color: theme.incorrect, fontSize: 15, marginBottom: 12 }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-large"
        style={{
          background: theme.accent,
          border: "none",
          color: "#fff",
          fontWeight: 500,
          borderRadius: 6,
        }}
      >
        Generate Quiz
      </button>
    </form>
  );

  const renderProcessing = () => (
    <div
      style={{
        margin: "70px auto 0",
        padding: 36,
        maxWidth: 420,
        borderRadius: 14,
        background: theme.cardBg,
        color: theme.text,
        border: `1.2px solid ${theme.border}`,
        textAlign: "center",
        boxShadow: "0 2px 16px rgba(0,0,0,0.20)",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 12 }}>
        <span
          className="spinner"
          style={{
            display: "inline-block",
            marginRight: 10,
            width: 18,
            height: 18,
            border: `3px solid ${theme.accent}`,
            borderBottomColor: "transparent",
            borderRadius: "50%",
            animation: "sqai-spin 1.2s linear infinite"
          }}
        ></span>
        {processingMsg}
      </div>
      <style>
        {`
        @keyframes sqai-spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        `}
      </style>
      <div style={{ color: theme.textSecondary, fontSize: 15 }}>
        This could take a few seconds. Please don&apos;t close the tab.
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div
      style={{
        margin: "48px auto 0",
        padding: "16px 0 64px 0",
        maxWidth: 760,
        width: "100%",
        color: theme.text,
      }}
    >
      <div style={{
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontSize: 25, fontWeight: 600 }}>
          Your Generated Quiz
        </div>
        <button
          className="btn"
          style={{
            background: "#23272e",
            border: `1px solid ${theme.border}`,
            color: theme.accent,
            fontWeight: 500,
          }}
          onClick={handleRestart}
        >
          &#8592; Upload New File
        </button>
      </div>
      <div>
        {mcqs.map((q, idx) => (
          <div
            key={idx}
            style={{
              background: theme.cardBg,
              borderRadius: 13,
              border: `1.15px solid ${theme.border}`,
              marginBottom: 28,
              padding: "22px 22px 14px 22px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              position: "relative",
              transition: "box-shadow 0.19s"
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 19, marginBottom: 16 }}>
              Q{idx + 1}. {q.question}
            </div>
            <div>
              {q.options.map((opt, optIdx) => {
                const answered = Object.prototype.hasOwnProperty.call(quizAnswers, idx);
                const isCorrect = feedback[idx] === "correct";
                const isIncorrect =
                  answered && quizAnswers[idx] === optIdx && !isCorrect;
                const isOptionCorrect =
                  answered && q.answerIdx === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswer(idx, optIdx)}
                    disabled={answered}
                    className="btn"
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: answered
                        ? isOptionCorrect
                          ? theme.correct
                          : isIncorrect
                            ? theme.incorrect
                            : "#23272e"
                        : "#23272e",
                      color: answered
                        ? isOptionCorrect || isIncorrect
                          ? "#fff"
                          : theme.text
                        : theme.text,
                      border: quizAnswers[idx] === optIdx
                        ? `2px solid ${theme.accent}`
                        : `1px solid ${theme.border}`,
                      marginBottom: 9,
                      padding: "10px 16px",
                      fontWeight: quizAnswers[idx] === optIdx ? 600 : 400,
                      borderRadius: 7,
                      cursor: answered ? "default" : "pointer",
                      opacity: answered && !isOptionCorrect && !isIncorrect ? 0.75 : 1,
                      fontSize: "1rem",
                      transition: "all 0.18s"
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div>
              {feedback[idx] === "correct" && (
                <span style={{ color: theme.correct, fontWeight: 600, fontSize: 16 }}>
                  Correct!
                </span>
              )}
              {feedback[idx] === "incorrect" && (
                <span style={{ color: theme.incorrect, fontWeight: 600, fontSize: 16 }}>
                  Incorrect. Correct answer: <b>{q.options[q.answerIdx]}</b>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Optional MCQs download/save can go here in the future */}
    </div>
  );

  // MAIN RENDER
  return (
    <div>
      <div
        className="container"
        style={{
          marginTop: "auto",
          paddingTop: 48,
        }}
      >
        <div
          style={{
            marginBottom: 32,
            padding: "16px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: theme.accent,
              fontWeight: 500,
              letterSpacing: 1.5,
              fontSize: "1.1rem"
            }}
          >
            STUDYQUEST AI
          </div>
          <h1
            style={{
              color: theme.text,
              fontWeight: 700,
              fontSize: "2.6rem",
              margin: "8px 0 10px 0",
              letterSpacing: 0.8
            }}
          >
            Instantly turn your notes into smart quizzes!
          </h1>
          <div style={{ color: theme.textSecondary, fontSize: "1.13rem", margin: "0 auto", maxWidth: 480 }}>
            Upload your study materials as PDF or Word files and let AI generate custom multiple-choice quizzes for you. Test your knowledge and learn faster.
          </div>
        </div>
        {step === "upload" && renderUploadSection()}
        {step === "processing" && renderProcessing()}
        {step === "quiz" && renderQuiz()}
      </div>
    </div>
  );
}

export default StudyQuestMainContainer;
