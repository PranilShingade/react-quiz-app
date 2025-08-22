/**
 * NextButton component - Navigation button for moving through quiz questions
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.dispatch - Redux-style dispatch function
 * @param {number|null} props.answer - Currently selected answer index
 * @param {number} props.index - Current question index
 * @param {number} props.numQuestions - Total number of questions
 * @returns {JSX.Element|null} Button element or null if no answer selected
 */
export default function NextButton({ dispatch, answer, index, numQuestions }) {
  // Don't show button until user has answered current question
  if (answer === null) return null;

  // Show "Next Question" button for all questions except the last
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next Question
      </button>
    );

  // Show "Finish" button on the last question
  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}
