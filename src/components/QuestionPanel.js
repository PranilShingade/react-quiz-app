import { useState } from "react";

/**
 * QuestionPanel component - Sidebar navigation panel for jumping between questions
 * @component
 * @param {Object} props - Component props
 * @param {number} props.numQuestions - Total number of questions
 * @param {number} props.currentIndex - Index of current question
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @param {Set} props.answeredQuestions - Set of indices for answered questions
 * @param {boolean} props.isOpen - Panel open/closed state
 * @param {Function} props.onToggle - Callback to toggle panel visibility
 * @returns {JSX.Element} Collapsible panel with question navigation grid
 */
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
      {/* Toggle Button - Always visible for opening/closing panel */}
      <button
        className="panel-toggle-btn"
        onClick={onToggle}
        title="Toggle Question Panel"
      >
        {isOpen ? "← Hide Panel" : "Show Panel →"}
      </button>

      {/* Main Panel - Slides in/out based on isOpen state */}
      <div className={`question-panel ${isOpen ? "open" : "closed"}`}>
        <div className="panel-header">
          <h3>Questions ({numQuestions})</h3>
          <button className="panel-close-btn" onClick={onToggle}>
            ×
          </button>
        </div>

        <div className="panel-content">
          {/* Grid of numbered buttons for each question */}
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
                  title={`Jump to Question ${questionNumber} ${
                    isAnswered ? "(Answered)" : "(Not Answered)"
                  }`}
                >
                  {questionNumber}
                </button>
              );
            })}
          </div>

          {/* Statistics display */}
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

      {/* Semi-transparent overlay for mobile - closes panel when clicked */}
      {isOpen && <div className="panel-overlay" onClick={onToggle}></div>}
    </>
  );
}
