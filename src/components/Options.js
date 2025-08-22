/**
 * Options component - Renders answer choices for a quiz question
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.question - Question object containing shuffled options and correct answer index
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @param {number|null} props.answer - Currently selected answer index
 * @returns {JSX.Element} Grid of clickable option buttons
 */
export default function Options({ question, dispatch, answer }) {
  // Check if user has already answered (for styling and disabling)
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.shuffledOptions.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            // Apply correct/wrong styling after answer is submitted
            hasAnswered
              ? index === question.correctAnswerIndex
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={index}
          disabled={hasAnswered} // Prevent changing answer once submitted
          onClick={() =>
            dispatch({
              type: "newAnswer",
              payload: index,
            })
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}
