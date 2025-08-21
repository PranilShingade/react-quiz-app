import { useState } from "react";

export default function QuestionPanel({
  numQuestions,
  currentIndex,
  dispatch,
  answeredQuestions,
  isOpen,
  onToggle,
}) {
  return (
    <>
      {/* Toggle Button */}
      <button
        className="panel-toggle-btn"
        onClick={onToggle}
        title="Toggle Question Panel"
      >
        {isOpen ? "← Hide Panel" : "Show Panel →"}
      </button>

      {/* Panel */}
      <div className={`question-panel ${isOpen ? "open" : "closed"}`}>
        <div className="panel-header">
          <h3>Questions ({numQuestions})</h3>
          <button className="panel-close-btn" onClick={onToggle}>
            ×
          </button>
        </div>

        <div className="panel-content">
          <div className="question-grid">
            {Array.from({ length: numQuestions }, (_, index) => {
              const questionNumber = index + 1;
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={index}
                  className={`question-nav-btn ${
                    isCurrent ? "current" : ""
                  } ${isAnswered ? "answered" : "unanswered"}`}
                  onClick={() =>
                    dispatch({ type: "jumpToQuestion", payload: index })
                  }
                  title={`Jump to Question ${questionNumber} ${isAnswered ? "(Answered)" : "(Not Answered)"}`}
                >
                  {questionNumber}
                </button>
              );
            })}
          </div>

          <div className="panel-stats">
            <div className="stat">
              <span className="stat-label">Answered:</span>
              <span className="stat-value">
                {answeredQuestions.size}/{numQuestions}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Remaining:</span>
              <span className="stat-value">
                {numQuestions - answeredQuestions.size}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="panel-overlay" onClick={onToggle}></div>}
    </>
  );
}
